
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { Message } from './types';
import { mockChatResponse } from '../../lib/mockApi';

interface ChatWidgetProps {
  botName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  apiEndpoint?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  botName = 'ChatBot',
  welcomeMessage = 'Hi there! 👋 How can I help you today?',
  primaryColor = '#3B82F6',
  position = 'bottom-right',
  apiEndpoint = 'https://api.example.com/chat',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial bot message when widget is first opened
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
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let data;
      
      // In development or demo mode, use mock API
      if (process.env.NODE_ENV === 'development' || apiEndpoint === 'https://api.example.com/chat') {
        data = await mockChatResponse(text);
      } else {
        // In production, use the provided API endpoint
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
          }),
        });
        data = await response.json();
      }
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Sorry, I couldn't process that request.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
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

  // Position classes based on the position prop
  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className="fixed z-50" style={{ [position.split('-')[1]]: '20px', bottom: '20px' }}>
      {/* Chat button */}
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

      {/* Chat window */}
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
