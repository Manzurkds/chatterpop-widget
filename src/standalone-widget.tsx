
import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatbotWidget from './lib/ChatbotWidget';
import { LLMService } from './lib/llmService';
import './index.css'; // Import main styles

interface ChatbotConfig {
  botName?: string;
  welcomeMessage?: string;
  primaryColor?: string;
  position?: 'bottom-right' | 'bottom-left';
  apiEndpoint?: string;
  llmConfig?: {
    apiKey: string;
    model?: string;
    apiEndpoint?: string;
  };
  contentfulSpaceId?: string;
  contentfulToken?: string;
}

// Standalone initialization function
function initChatterPopWidget(config: ChatbotConfig = {}) {
  // Create container for the widget if it doesn't exist
  let widgetContainer = document.getElementById('chatterpop-widget');
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'chatterpop-widget';
    document.body.appendChild(widgetContainer);
  }

  // Set Contentful environment variables if provided
  if (config.contentfulSpaceId) {
    window.CONTENTFUL_SPACE_ID = config.contentfulSpaceId;
  }
  if (config.contentfulToken) {
    window.CONTENTFUL_TOKEN = config.contentfulToken;
  }

  // Create LLM service instance if API key is provided
  let llmService = undefined;
  if (config.llmConfig?.apiKey) {
    llmService = new LLMService(config.llmConfig);
  }

  // Render the widget
  const root = ReactDOM.createRoot(widgetContainer);
  root.render(
    <React.StrictMode>
      <ChatbotWidget
        botName={config.botName}
        welcomeMessage={config.welcomeMessage}
        primaryColor={config.primaryColor}
        position={config.position}
        apiEndpoint={config.apiEndpoint}
        llmService={llmService}
      />
    </React.StrictMode>
  );

  return {
    unmount: () => root.unmount()
  };
}

// Expose the initialization function globally
declare global {
  interface Window {
    ChatterPop: {
      init: typeof initChatterPopWidget;
    };
    CONTENTFUL_SPACE_ID?: string;
    CONTENTFUL_TOKEN?: string;
  }
}

// Initialize global object
window.ChatterPop = {
  init: initChatterPopWidget
};

// Auto-initialize if configuration is found
document.addEventListener('DOMContentLoaded', () => {
  if (window.ChatterPopConfig) {
    initChatterPopWidget(window.ChatterPopConfig);
  }
});

// Also add a separate type declaration for auto-initialization
declare global {
  interface Window {
    ChatterPopConfig?: ChatbotConfig;
  }
}

export default initChatterPopWidget;
