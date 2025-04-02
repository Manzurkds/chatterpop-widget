
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

// API proxy endpoint for chat requests
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, config } = req.body;
    
    if (!config || !config.apiKey) {
      return res.status(400).json({ error: { message: 'API key is required' } });
    }

    const response = await fetch(config.apiEndpoint || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    return res.json({ 
      reply: data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: { message: 'Server error processing your request' } 
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
