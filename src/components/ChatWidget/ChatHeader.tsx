
import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  botName: string;
  primaryColor: string;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ botName, primaryColor, onClose }) => {
  return (
    <div 
      className="px-4 py-3 flex justify-between items-center"
      style={{ backgroundColor: primaryColor }}
    >
      <div className="text-white font-medium">{botName}</div>
      <button 
        onClick={onClose}
        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        aria-label="Close chat"
      >
        <X size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;
