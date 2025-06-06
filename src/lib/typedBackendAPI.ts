import { NotionPortfolioItem } from '../types/notion';

// Backend server configuration
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Response interfaces
interface HealthResponse {
  status: string;
  timestamp: string;
}

interface DatabaseResponse {
  title?: Array<{ plain_text?: string }>;
  [key: string]: unknown;
}

interface PortfolioResponse extends Array<NotionPortfolioItem> {}

// Helper function to make requests to our backend
async function makeBackendRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = (errorData as { error?: string }).error || response.statusText;
      throw new Error(`Backend API Error ${response.status}: ${error}`);
    }

    return await response.json() as T;
  } catch (error) {
    console.error('Backend API request failed:', error);
    throw error;
  }
}

// Health check for backend
export async function checkBackendHealth(): Promise<boolean> {
  try {
    console.log('Checking backend health...');
    const response = await makeBackendRequest<HealthResponse>('/health');
    console.log('Backend health check:', response);
    return response.status === 'ok';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}

// Verify Notion API connection through backend
export async function verifyNotionConnection(): Promise<boolean> {
  try {
    console.log('Verifying Notion API connection through backend...');
    const databaseId = import.meta.env.VITE_NOTION_DB_ID || '209803d3-0664-813d-829e-eed91d2d9600';
    const response = await makeBackendRequest<DatabaseResponse>(`/api/database/${databaseId}`);
    console.log('Notion database verified through backend:', response.title?.[0]?.plain_text || 'Untitled');
    return true;
  } catch (error) {
    console.error('Notion API connection verification failed:', error);
    return false;
  }
}

// Fetch portfolio data from backend
export async function fetchPortfolioDataFromNotion(section?: string): Promise<NotionPortfolioItem[]> {
  try {
    console.log('Fetching portfolio data from backend. Section:', section);
    
    const endpoint = section ? `/api/portfolio/${section}` : '/api/portfolio';
    const portfolioItems = await makeBackendRequest<NotionPortfolioItem[]>(endpoint);
    
    console.log('Successfully fetched', portfolioItems.length, 'items from backend');
    
    // Sort by order and return
    return portfolioItems.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Failed to fetch portfolio data from backend:', error);
    
    // Return empty array instead of throwing to allow graceful fallback
    return [];
  }
}

// Test all sections
export async function testAllSections(): Promise<Record<string, NotionPortfolioItem[]>> {
  const sections = ['Skills', 'Certificates', 'Projects', 'About', 'Contact'];
  const results: Record<string, NotionPortfolioItem[]> = {};
  
  console.log('Testing all sections through backend...');
  
  for (const section of sections) {
    try {
      const data = await fetchPortfolioDataFromNotion(section);
      results[section] = data;
      console.log(`${section}: ${data.length} items`);
    } catch (error) {
      console.error(`Failed to fetch ${section}:`, error);
      results[section] = [];
    }
  }
  
  return results;
} 