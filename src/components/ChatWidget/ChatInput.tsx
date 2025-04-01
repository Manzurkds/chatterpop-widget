
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  primaryColor: string;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  primaryColor,
  isLoading 
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-3 border-t border-gray-200 bg-white"
    >
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ focusRing: primaryColor }}
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`p-2 rounded-r-md ${
            !message.trim() || isLoading ? 'opacity-50' : 'hover:opacity-80'
          }`}
          style={{ backgroundColor: primaryColor }}
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
      {isLoading && (
        <div className="text-xs text-gray-500 mt-1 ml-2">
          Bot is typing...
        </div>
      )}
    </form>
  );
};

export default ChatInput;
