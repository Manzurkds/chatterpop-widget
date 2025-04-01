
import React from 'react';
import ChatWidget from '../components/ChatWidget';
import { LLMService, LLMServiceConfig } from './llmService';

export interface ChatbotWidgetProps {
  /**
   * The name of the chatbot displayed in the header
   * @default 'ChatBot'
   */
  botName?: string;
  
  /**
   * The welcome message displayed when the chat is first opened
   * @default 'Hi there! 👋 How can I help you today?'
   */
  welcomeMessage?: string;
  
  /**
   * The primary color used for the chat button and user messages
   * @default '#3B82F6'
   */
  primaryColor?: string;
  
  /**
   * Position of the chat widget
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left';
  
  /**
   * API endpoint for the chatbot backend
   * @default 'https://api.openai.com/v1/chat/completions'
   */
  apiEndpoint?: string;

  /**
   * LLM configuration (apiKey, model, etc.)
   */
  llmConfig?: LLMServiceConfig;
}

/**
 * A customizable chat widget component that can be added to any React application
 */
export const ChatbotWidget: React.FC<ChatbotWidgetProps> = (props) => {
  // Create LLM service with provided config
  const llmService = props.llmConfig ? new LLMService(props.llmConfig) : undefined;

  return <ChatWidget {...props} llmService={llmService} />;
};

export default ChatbotWidget;
