
# ChatterPop Widget

A customizable chatbot widget built with React and TypeScript that can be easily integrated into any web application.

## Installation

```bash
npm install chatterpop-widget
# or
yarn add chatterpop-widget
```

## Usage as React Component

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

## Usage as Standalone JavaScript Widget

You can also use ChatterPop as a standalone JavaScript widget on any website:

1. Include the CSS and JavaScript in your HTML:

```html
<link rel="stylesheet" href="https://path-to-your-server/chatterpop.css">
<script src="https://path-to-your-server/chatterpop.iife.js"></script>
```

2. Configure and initialize the widget:

```html
<script>
  // Option 1: Auto-initialization
  window.ChatterPopConfig = {
    botName: "AssistantBot",
    welcomeMessage: "👋 Hello! How can I help you today?",
    primaryColor: "#4F46E5",
    position: "bottom-right",
    llmConfig: {
      apiKey: "your-openai-api-key",
      model: "gpt-3.5-turbo"
    },
    contentfulSpaceId: "your-contentful-space-id",
    contentfulToken: "your-contentful-token"
  };

  // Option 2: Manual initialization
  // const widget = window.ChatterPop.init({
  //   botName: "AssistantBot",
  //   welcomeMessage: "👋 Hello! How can I help you today?",
  //   primaryColor: "#4F46E5",
  //   position: "bottom-right"
  // });
  
  // To unmount the widget:
  // widget.unmount();
</script>
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
| `contentfulSpaceId` | string | undefined | Contentful space ID for API integration |
| `contentfulToken` | string | undefined | Contentful access token for API integration |

## LLM Integration

The widget supports direct integration with OpenAI and other LLM APIs. To use it:

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

## API Integration

The widget now integrates with Zalando's search API and Contentful's GraphQL API. When users send a message, it:

1. Forwards the user's message to Zalando's search API
2. Takes the search results and sends them to Contentful's GraphQL API using a detailed article query structure
3. Combines all data with the original message before sending to the LLM

To use this functionality, you need to set environment variables for Contentful:
- `CONTENTFUL_SPACE_ID`: Your Contentful space ID
- `CONTENTFUL_TOKEN`: Your Contentful access token

For the standalone widget, you can pass these values directly:
```js
window.ChatterPop.init({
  contentfulSpaceId: "your-contentful-space-id",
  contentfulToken: "your-contentful-token"
});
```

If no API key is provided, the widget will fall back to using a mock API for demonstration purposes.

## Server Setup

To avoid CORS issues with LLM APIs, a simple Express server is included:

1. Install server dependencies:
```bash
npm install express cors body-parser
```

2. Start the server (using ES modules):
```bash
node server/index.js
```

Or if you prefer to run with explicit module type:
```bash
node --experimental-modules server/index.js
```

The server will:
- Run on port 3001 by default (can be changed with PORT environment variable)
- Provide a proxy endpoint at `/api/chat` that forwards requests to the LLM API
- Serve the built frontend application

## Building the Standalone Widget

To build the standalone widget:

```bash
npm run build
```

This will generate the following files in the `dist` directory:
- `chatterpop.iife.js` - The bundled widget as an Immediately Invoked Function Expression (for direct browser use)
- `chatterpop.es.js` - The bundled widget as an ES module (for import in modern JS applications)
- `chatterpop.css` - The styles for the widget

## License

MIT
