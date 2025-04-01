
import { Message } from '../components/ChatWidget/types';

// This is a simple mock API for demonstration purposes
// In a real-world scenario, you would connect to an actual LLM service

const MOCK_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! How can I help you today?",
    "Hi there! What can I assist you with?",
    "Greetings! What can I do for you?"
  ],
  help: [
    "I can help you with product information, troubleshooting, or general questions. What do you need assistance with?",
    "I'm here to help! Please let me know what you're looking for."
  ],
  product: [
    "Our products include a range of solutions for businesses and individuals. Could you specify which product you're interested in?",
    "We offer various products across different categories. Can you tell me which specific product you'd like to know more about?"
  ],
  pricing: [
    "Our pricing depends on the specific product and plan you're interested in. You can find detailed pricing information on our pricing page.",
    "We offer flexible pricing plans to suit different needs. Would you like me to provide a link to our pricing page?"
  ],
  default: [
    "I'm not sure I understand. Could you rephrase your question?",
    "I don't have information on that specific topic. Could you try asking something else?",
    "I'm still learning! Could you try asking your question in a different way?"
  ]
};

const getResponseCategory = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.match(/hello|hi|hey|greetings/)) {
    return 'greeting';
  } else if (message.match(/help|assist|support/)) {
    return 'help';
  } else if (message.match(/product|service|offer/)) {
    return 'product';
  } else if (message.match(/price|cost|pricing|plan/)) {
    return 'pricing';
  }
  
  return 'default';
};

const getRandomResponse = (category: string): string => {
  const responses = MOCK_RESPONSES[category] || MOCK_RESPONSES.default;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

export const mockChatResponse = async (message: string): Promise<{ reply: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const category = getResponseCategory(message);
  const response = getRandomResponse(category);
  
  return { reply: response };
};
