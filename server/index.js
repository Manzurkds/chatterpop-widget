
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist directory (after building the React app)
app.use(express.static(path.join(__dirname, '../dist')));

// Helper function to minify GraphQL queries (simplified version)
const gqlmin = (query) => {
  return query.replace(/\s+/g, ' ').trim();
};

// API proxy endpoint for chat requests
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, config, contentfulQuery } = req.body;
    
    // Get the last user message
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()?.content || '';
    
    if (!lastUserMessage) {
      return res.status(400).json({ error: { message: 'No user message found' } });
    }

    // Step 1: Call the Zalando API with the user's message
    const zalandoResponse = await fetch(`https://partner.zalando.com/api/search?query=${encodeURIComponent(lastUserMessage)}&page=1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!zalandoResponse.ok) {
      console.error('Zalando API Error:', await zalandoResponse.text());
      return res.status(zalandoResponse.status).json({ 
        error: { message: 'Error from Zalando API' } 
      });
    }

    const zalandoData = await zalandoResponse.json();
    
    // Step 2: Call the Contentful GraphQL API with the results from Zalando
    // We'll use the provided GraphQL query or fall back to a default one
    const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID || 'your-default-space-id';
    const contentfulToken = process.env.CONTENTFUL_TOKEN || 'your-default-token';
    
    // Extract a reasonable slug from the user message for the GraphQL query
    // This is a simplistic approach; in a real app, you might derive this differently
    const slug = lastUserMessage.toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    
    const contentfulResponse = await fetch(`https://graphql.contentful.com/content/v1/spaces/${contentfulSpaceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${contentfulToken}`
      },
      body: JSON.stringify({
        query: gqlmin(contentfulQuery || '{ pageArticleCollection(limit: 5) { items { title slug } } }'),
        variables: { 
          slug: slug,
          preview: false,
          searchResults: zalandoData 
        }
      })
    });

    if (!contentfulResponse.ok) {
      console.error('Contentful API Error:', await contentfulResponse.text());
      return res.status(contentfulResponse.status).json({ 
        error: { message: 'Error from Contentful API' } 
      });
    }

    const contentfulData = await contentfulResponse.json();
    
    // If the original request had an API key, still make the LLM call with the enriched data
    if (config && config.apiKey) {
      // Craft a new message that includes the API data
      const enrichedMessage = `User asked: ${lastUserMessage}\n\nZalando search results: ${JSON.stringify(zalandoData)}\n\nContentful data: ${JSON.stringify(contentfulData)}`;
      
      // Replace the last user message with our enriched one
      const enhancedMessages = [...messages];
      const lastUserIndex = enhancedMessages.findIndex(msg => msg.role === 'user' && msg.content === lastUserMessage);
      if (lastUserIndex !== -1) {
        enhancedMessages[lastUserIndex] = { role: 'user', content: enrichedMessage };
      }

      const llmResponse = await fetch(config.apiEndpoint || 'https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-3.5-turbo',
          messages: enhancedMessages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!llmResponse.ok) {
        const errorData = await llmResponse.json();
        return res.status(llmResponse.status).json(errorData);
      }

      const llmData = await llmResponse.json();
      return res.json({ 
        reply: llmData.choices[0].message.content,
        zalandoData,
        contentfulData
      });
    } else {
      // If no API key is provided, just return the data from both APIs
      return res.json({ 
        reply: `Here are the results from Zalando and Contentful for your query: "${lastUserMessage}"`,
        zalandoData,
        contentfulData
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: { message: 'Server error processing your request: ' + error.message } 
    });
  }
});

// For any other request, send back the index.html (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
