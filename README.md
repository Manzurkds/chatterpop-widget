
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
        apiEndpoint="https://your-api-endpoint.com/chat"
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
| `apiEndpoint` | string | 'https://api.example.com/chat' | API endpoint for the chatbot backend |

## API Integration

The widget sends POST requests to the specified `apiEndpoint` with the following structure:

Request:
```json
{
  "message": "User's message here"
}
```

Expected Response:
```json
{
  "reply": "Bot's response here"
}
```

## License

MIT
