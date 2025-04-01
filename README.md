
# ChatterPop Widget

A customizable chatbot widget built with React and TypeScript that can be easily integrated into any web application.

## Installation

```bash
npm install chatterpop-widget
# or
yarn add chatterpop-widget
```

## Usage

```jsx
import { ChatbotWidget } from 'chatterpop-widget';
import 'chatterpop-widget/dist/style.css'; // Import styles

function App() {
  return (
    <div className="App">
      <h1>My Website</h1>
      
      {/* Add the ChatbotWidget component */}
      <ChatbotWidget 
        botName="AssistantBot"
        welcomeMessage="👋 Hello! How can I help you today?"
        primaryColor="#4F46E5"
        position="bottom-right"
        llmConfig={{
          apiKey: "your-openai-api-key", // Required for LLM integration
          model: "gpt-3.5-turbo", // Optional, defaults to gpt-3.5-turbo
          apiEndpoint: "https://api.openai.com/v1/chat/completions" // Optional, defaults to OpenAI
        }}
      />
    </div>
  );
}

export default App;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `botName` | string | 'ChatBot' | The name of the chatbot displayed in the header |
| `welcomeMessage` | string | 'Hi there! 👋 How can I help you today?' | The welcome message displayed when the chat is first opened |
| `primaryColor` | string | '#3B82F6' | The primary color used for the chat button and user messages |
| `position` | 'bottom-right' \| 'bottom-left' | 'bottom-right' | Position of the chat widget |
| `apiEndpoint` | string | 'https://api.openai.com/v1/chat/completions' | API endpoint for the chatbot backend |
| `llmConfig` | LLMServiceConfig | undefined | Configuration for the LLM service |

## LLM Integration

The widget now supports direct integration with OpenAI and other LLM APIs. To use it:

```jsx
import { ChatbotWidget } from 'chatterpop-widget';

// With OpenAI (default)
<ChatbotWidget 
  llmConfig={{
    apiKey: "your-openai-api-key",
    model: "gpt-3.5-turbo" // Or any other OpenAI model
  }}
/>

// With a custom LLM API
<ChatbotWidget 
  llmConfig={{
    apiKey: "your-api-key",
    model: "your-model-name",
    apiEndpoint: "https://your-custom-api-endpoint.com"
  }}
/>
```

If no API key is provided, the widget will fall back to using a mock API for demonstration purposes.

## License

MIT
