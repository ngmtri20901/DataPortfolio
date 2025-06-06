import { NotionResponse, NotionDatabaseResult, NotionPortfolioItem } from '../types/notion';

// Environment variables with fallbacks
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DB_ID || '209803d3-0664-813d-829e-eed91d2d9600';

// Backend server configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

interface NotionDatabaseInfo {
  id: string;
  title: Array<{ plain_text: string }>;
  [key: string]: unknown;
}

interface NotionQueryRequest {
  page_size: number;
  sorts: Array<{
    property: string;
    direction: 'ascending' | 'descending';
  }>;
  filter?: {
    property: string;
    select: {
      equals: string;
    };
  };
}

// Helper function to make authenticated requests to Notion API
async function makeNotionRequest(endpoint: string, options: RequestInit = {}): Promise<NotionResponse> {
  const url = `${NOTION_API_BASE}${endpoint}`;
  
  // Headers for direct API calls (proxy handles auth in dev mode)
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add auth headers when not using proxy
  if (!import.meta.env.DEV) {
    defaultHeaders['Authorization'] = `Bearer ${NOTION_TOKEN}`;
    defaultHeaders['Notion-Version'] = NOTION_VERSION;
  }

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

    return await response.json() as NotionResponse;
  } catch (error) {
    console.error('Notion API request failed:', error);
    throw error;
  }
}

// Helper function for database info requests
async function makeNotionDatabaseRequest(endpoint: string, options: RequestInit = {}): Promise<NotionDatabaseInfo> {
  const url = `${NOTION_API_BASE}${endpoint}`;
  
  // Headers for direct API calls (proxy handles auth in dev mode)
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  // Only add auth headers when not using proxy
  if (!import.meta.env.DEV) {
    defaultHeaders['Authorization'] = `Bearer ${NOTION_TOKEN}`;
    defaultHeaders['Notion-Version'] = NOTION_VERSION;
  }

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

    return await response.json() as NotionDatabaseInfo;
  } catch (error) {
    console.error('Notion API request failed:', error);
    throw error;
  }
}

// Query the Notion database with optional section filter
export async function queryNotionDatabase(section?: string): Promise<NotionResponse> {
  try {
    const requestBody: NotionQueryRequest = {
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

    console.log('Querying Notion database:', NOTION_DATABASE_ID, 'with section:', section);
    
    const response = await makeNotionRequest(`/databases/${NOTION_DATABASE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    console.log('Notion API response:', response);
    return response;
  } catch (error) {
    console.error('Error querying Notion database:', error);
    throw error;
  }
}

// Transform Notion API response to our portfolio item format
export function transformNotionItem(item: NotionDatabaseResult): NotionPortfolioItem {
  const properties = item.properties as {
    Name?: { title?: Array<{ plain_text?: string }> };
    Content?: { rich_text?: Array<{ plain_text?: string }> };
    Link?: { url?: string | null };
    Section?: { select?: { name?: string } };
    Order?: { number?: number };
    Icon?: { rich_text?: Array<{ plain_text?: string }> };
  };
  
  const sectionName = properties.Section?.select?.name;
  const validSection: 'Skills' | 'Certificates' | 'Projects' | 'About' | 'Contact' = 
    (sectionName === 'Skills' || sectionName === 'Certificates' || sectionName === 'Projects' || 
     sectionName === 'About' || sectionName === 'Contact') ? sectionName : 'About';

  return {
    id: item.id,
    title: properties.Name?.title?.[0]?.plain_text || '',
    content: properties.Content?.rich_text?.[0]?.plain_text || '',
    link: properties.Link?.url || undefined,
    section: validSection,
    order: properties.Order?.number || 0,
    icon: properties.Icon?.rich_text?.[0]?.plain_text || undefined,
  };
}

// Main function to fetch portfolio data from Notion
export async function fetchPortfolioDataFromNotion(section?: string): Promise<NotionPortfolioItem[]> {
  try {
    console.log('Fetching portfolio data from Notion. Section:', section);
    console.log('Using database ID:', NOTION_DATABASE_ID);
    console.log('Using token (first 10 chars):', NOTION_TOKEN.substring(0, 10) + '...');
    
    const response = await queryNotionDatabase(section);
    const portfolioItems = response.results.map(transformNotionItem);
    
    console.log('Successfully fetched', portfolioItems.length, 'items from Notion');
    return portfolioItems.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to fetch portfolio data from Notion:', error);
    
    // Return empty array instead of throwing to allow graceful fallback
    return [];
  }
}

// Verify Notion API connection
export async function verifyNotionConnection(): Promise<boolean> {
  try {
    console.log('Verifying Notion API connection...');
    const response = await makeNotionDatabaseRequest(`/databases/${NOTION_DATABASE_ID}`);
    console.log('Notion database verified:', response.title?.[0]?.plain_text || 'Untitled');
    return true;
  } catch (error) {
    console.error('Notion API connection verification failed:', error);
    return false;
  }
} 