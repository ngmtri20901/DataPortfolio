import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3001;

// Environment variables
const NOTION_TOKEN = process.env.NOTION_TOKEN || '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';
const NOTION_DATABASE_ID = process.env.VITE_NOTION_DB_ID || '209803d3-0664-813d-829e-eed91d2d9600';

// Middleware
app.use(cors());
app.use(express.json());

// Notion API configuration
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Helper function to make Notion API requests
async function makeNotionRequest(endpoint, options = {}) {
  const url = `${NOTION_API_BASE}${endpoint}`;
  
  const defaultHeaders = {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Notion API Error ${response.status}: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Notion API request failed:', error);
    throw error;
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get database info
app.get('/api/database/:id', async (req, res) => {
  try {
    const databaseId = req.params.id;
    const data = await makeNotionRequest(`/databases/${databaseId}`);
    res.json(data);
  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Query database
app.post('/api/database/:id/query', async (req, res) => {
  try {
    const databaseId = req.params.id;
    const requestBody = req.body || {};
    
    // Default query parameters
    const defaultQuery = {
      page_size: 100,
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        }
      ]
    };
    
    const queryBody = { ...defaultQuery, ...requestBody };
    console.log('Querying database:', databaseId, 'with body:', JSON.stringify(queryBody, null, 2));
    
    const data = await makeNotionRequest(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(queryBody),
    });
    
    console.log('Query result:', data.results?.length || 0, 'items');
    res.json(data);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get portfolio data by section
app.get('/api/portfolio/:section?', async (req, res) => {
  try {
    const section = req.params.section;
    
    const requestBody = {
      page_size: 100,
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        }
      ]
    };
    
    // Add section filter if provided
    if (section) {
      requestBody.filter = {
        property: 'Section',
        select: {
          equals: section
        }
      };
    }
    
    console.log('Fetching portfolio data for section:', section || 'all');
    
    const data = await makeNotionRequest(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
    
    // Transform data to portfolio format
    const portfolioItems = data.results.map(item => {
      const properties = item.properties;
      const sectionName = properties.Section?.select?.name;
      const validSection = ['Skills', 'Certificates', 'Projects', 'About', 'Contact'].includes(sectionName) 
        ? sectionName : 'About';

      return {
        id: item.id,
        title: properties.Name?.title?.[0]?.plain_text || '',
        content: properties.Content?.rich_text?.[0]?.plain_text || '',
        link: properties.Link?.url || undefined,
        section: validSection,
        order: properties.Order?.number || 0,
        icon: properties.Icon?.rich_text?.[0]?.plain_text || undefined,
      };
    });
    
    // Sort by order
    portfolioItems.sort((a, b) => a.order - b.order);
    
    console.log('Transformed', portfolioItems.length, 'portfolio items');
    res.json(portfolioItems);
  } catch (error) {
    console.error('Portfolio data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Notion API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database ID: ${NOTION_DATABASE_ID}`);
  console.log(`🔑 Token configured: ${NOTION_TOKEN ? 'Yes' : 'No'}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health`);
  console.log(`  GET  /api/database/:id`);
  console.log(`  POST /api/database/:id/query`);
  console.log(`  GET  /api/portfolio/:section?`);
});

export default app; 