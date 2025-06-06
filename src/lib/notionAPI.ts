import { NotionResponse, NotionDatabaseResult, NotionPortfolioItem } from '../types/notion';

// Environment variables with fallbacks
const NOTION_TOKEN = import.meta.env.VITE_NOTION_TOKEN || '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';
const NOTION_DATABASE_ID = import.meta.env.VITE_NOTION_DB_ID || '209803d3-0664-813d-829e-eed91d2d9600';

// Notion API configuration
const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

interface NotionAPIError {
  code: string;
  message: string;
}

// Helper function to make authenticated requests to Notion API
async function makeNotionRequest(endpoint: string, options: RequestInit = {}): Promise<NotionResponse | Record<string, unknown>> {
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

// Query the Notion database with optional section filter
export async function queryNotionDatabase(section?: string): Promise<NotionResponse> {
  try {
    const requestBody: any = {
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
    const response = await makeNotionRequest(`/databases/${NOTION_DATABASE_ID}`);
    console.log('Notion database verified:', response.title);
    return true;
  } catch (error) {
    console.error('Notion API connection verification failed:', error);
    return false;
  }
}

// Test function to check all sections
export async function testNotionDataFetch(): Promise<void> {
  const sections = ['Skills', 'Certificates', 'Projects', 'About', 'Contact'];
  
  console.log('Testing Notion data fetch for all sections...');
  
  for (const section of sections) {
    try {
      const data = await fetchPortfolioDataFromNotion(section);
      console.log(`${section}: ${data.length} items`);
    } catch (error) {
      console.error(`Failed to fetch ${section}:`, error);
    }
  }
} 