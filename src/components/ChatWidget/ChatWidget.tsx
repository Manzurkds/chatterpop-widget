
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Message } from './types';
import { mockChatResponse } from '../../lib/mockApi';
import { LLMService, defaultLLMService } from '../../lib/llmService';

interface ChatWidgetProps {
  botName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  apiEndpoint?: string;
  llmService?: LLMService;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  botName = 'ChatBot',
  welcomeMessage = 'Hi there! 👋 How can I help you today?',
  primaryColor = '#3B82F6',
  position = 'bottom-right',
  apiEndpoint = 'https://api.openai.com/v1/chat/completions',
  llmService,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [zalandoData, setZalandoData] = useState<any>(null);
  const [contentfulData, setContentfulData] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatService = llmService || defaultLLMService;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: welcomeMessage,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, welcomeMessage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const data = await chatService.sendMessage(text, messages);
      
      // Store API data if available
      if (data.zalandoData) setZalandoData(data.zalandoData);
      if (data.contentfulData) setContentfulData(data.contentfulData);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't process that request.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, there was an error processing your request.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className="fixed z-50" style={{ [position.split('-')[1]]: '20px', bottom: '20px' }}>
      <button
        onClick={toggleChat}
        className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg focus:outline-none transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: primaryColor }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageCircle className="text-white" size={24} />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute bottom-20 w-80 sm:w-96 h-[500px] max-h-[70vh] rounded-lg shadow-xl flex flex-col bg-white overflow-hidden animate-fade-in-up"
          style={{ [position.split('-')[1]]: '0' }}
        >
          <ChatHeader 
            botName={botName} 
            primaryColor={primaryColor} 
            onClose={() => setIsOpen(false)} 
          />
          
          <ChatMessages 
            messages={messages} 
            primaryColor={primaryColor} 
            messagesEndRef={messagesEndRef} 
          />
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            primaryColor={primaryColor}
            isLoading={isLoading} 
          />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
