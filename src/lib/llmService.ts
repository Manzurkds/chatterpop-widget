
import { Message } from '../components/ChatWidget/types';

export interface LLMServiceConfig {
  apiKey?: string;
  model?: string;
  apiEndpoint?: string;
}

// Default configuration
const defaultConfig: LLMServiceConfig = {
  model: 'gpt-3.5-turbo', // Default OpenAI model
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
};

export class LLMService {
  private config: LLMServiceConfig;

  constructor(config: LLMServiceConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async sendMessage(message: string, conversationHistory: Message[] = []): Promise<{ reply: string, zalandoData?: any, contentfulData?: any }> {
    // If no API key is provided, fall back to mock API
    if (!this.config.apiKey) {
      console.warn('No API key provided, falling back to mock API');
      return this.mockResponse(message);
    }

    try {
      // Format conversation history for OpenAI API
      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: message }
      ];

      // Use the proxy server endpoint instead of calling the LLM API directly
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          config: this.config
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API Error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return { 
        reply: data.reply,
        zalandoData: data.zalandoData,
        contentfulData: data.contentfulData
      };
    } catch (error) {
      console.error('Error calling LLM API:', error);
      return { 
        reply: "I'm having trouble connecting to my brain right now. Please try again later." 
      };
    }
  }

  // Fallback to mock API if no API key is provided
  private async mockResponse(message: string): Promise<{ reply: string }> {
    const { mockChatResponse } = await import('./mockApi');
    return mockChatResponse(message);
  }
}

// Export a singleton instance with default configuration
export const defaultLLMService = new LLMService();

// Export a function to create a configured LLM service
export const createLLMService = (config: LLMServiceConfig) => {
  return new LLMService(config);
};
