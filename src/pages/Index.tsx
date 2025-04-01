
import React from 'react';
import ChatWidget from '../components/ChatWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Chatbot Widget Demo</h1>
        <p className="text-gray-600 mb-6">
          This is a demo of the chatbot widget that can be used on any website.
          Click the chat icon in the bottom right corner to start a conversation.
        </p>
        <div className="text-sm text-gray-500 border-t pt-4 mt-4">
          In a real implementation, this widget would be included as an npm package
          and then embedded on the target website.
        </div>
      </div>
      
      {/* The ChatWidget component */}
      <ChatWidget 
        botName="AssistantBot"
        welcomeMessage="👋 Hello! I'm your virtual assistant. How can I help you today?"
        primaryColor="#4F46E5"
        position="bottom-right"
        apiEndpoint="https://api.example.com/chat"
      />
    </div>
  );
};

export default Index;
