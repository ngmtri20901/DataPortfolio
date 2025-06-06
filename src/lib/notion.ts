import { Client } from '@notionhq/client';
import { NotionPortfolioItem, NotionResponse, NotionDatabaseResult } from '../types/notion';
import { mockNotionAPI } from './api';

// This would be your server-side API endpoint
const NOTION_API_ENDPOINT = '/api/notion';

export async function fetchPortfolioData(section?: string): Promise<NotionPortfolioItem[]> {
  try {
    const url = new URL(NOTION_API_ENDPOINT, window.location.origin);
    if (section) {
      url.searchParams.append('section', section);
    }
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
    }
    
    const data: NotionResponse = await response.json();
    
    return data.results.map(transformNotionItem);
  } catch (error) {
    console.error('Error fetching portfolio data from API, falling back to simulation:', error);
    // Fallback to our simulation
    return await fetchPortfolioDataFromNotionAPI(section);
  }
}

function transformNotionItem(item: NotionDatabaseResult): NotionPortfolioItem {
  const properties = item.properties as {
    Name?: { title?: Array<{ plain_text?: string }> };
    Content?: { rich_text?: Array<{ plain_text?: string }> };
    Link?: { url?: string };
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

// Real Notion API function using MCP
export async function fetchPortfolioDataFromNotionAPI(section?: string): Promise<NotionPortfolioItem[]> {
  try {
    // Use the new Ghibli Portfolio Database ID
    const DATABASE_ID = process.env.VITE_NOTION_DB_ID;
    
    // Try to call the real Notion API through MCP server
    try {
      const realResponse = await callRealNotionAPI(DATABASE_ID, section);
      return realResponse.results.map(transformNotionItem);
    } catch (mcpError) {
      console.warn('MCP Notion API failed, falling back to simulation:', mcpError);
      // Fallback to simulation with new database structure
      const mockResponse = await simulateNotionMCPCall(DATABASE_ID, section);
      return mockResponse.results.map(transformNotionItem);
    }
  } catch (error) {
    console.error('Error fetching from Notion API:', error);
    return [];
  }
}

// Call real Notion API through backend or MCP
async function callRealNotionAPI(databaseId: string, section?: string): Promise<NotionResponse> {
  // This would normally call your backend API that uses MCP
  // For now, we'll simulate this since we can't directly call MCP from frontend
  throw new Error('Real MCP API not available in frontend');
}

// Simulate MCP Notion API call with real database structure
async function simulateNotionMCPCall(databaseId: string, section?: string): Promise<NotionResponse> {
  // This simulates the actual structure we get from the new Ghibli Portfolio database
  const mockRealData: NotionDatabaseResult[] = [
    // Skills Section
    {
      object: 'page',
      id: '209803d3-0664-813b-9286-f26d0b7dc9fc',
      properties: {
        Name: { title: [{ plain_text: 'React & Frontend Development' }] },
        Content: { rich_text: [{ plain_text: 'React, TypeScript, Next.js, Tailwind CSS' }] },
        Section: { select: { name: 'Skills' } },
        Order: { number: 1 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '⚛️' }] }
      },
      created_time: '2025-06-05T13:18:00.000Z',
      last_edited_time: '2025-06-05T13:18:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8140-b5e6-dd510d22f3dd',
      properties: {
        Name: { title: [{ plain_text: 'Backend Development' }] },
        Content: { rich_text: [{ plain_text: 'Node.js, Express, MongoDB, PostgreSQL' }] },
        Section: { select: { name: 'Skills' } },
        Order: { number: 2 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '🛠️' }] }
      },
      created_time: '2025-06-05T13:18:00.000Z',
      last_edited_time: '2025-06-05T13:18:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-81d8-8bed-ea32413ac906',
      properties: {
        Name: { title: [{ plain_text: 'Animation & Motion Design' }] },
        Content: { rich_text: [{ plain_text: 'Framer Motion, CSS Animations, GSAP' }] },
        Section: { select: { name: 'Skills' } },
        Order: { number: 3 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '🎬' }] }
      },
      created_time: '2025-06-05T13:18:00.000Z',
      last_edited_time: '2025-06-05T13:18:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-81dd-99ad-d51621d584b2',
      properties: {
        Name: { title: [{ plain_text: 'UI/UX Design' }] },
        Content: { rich_text: [{ plain_text: 'Figma, Adobe XD, User Research, Prototyping' }] },
        Section: { select: { name: 'Skills' } },
        Order: { number: 4 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '🎨' }] }
      },
      created_time: '2025-06-05T13:18:00.000Z',
      last_edited_time: '2025-06-05T13:18:00.000Z',
    },
    // Certificates Section
    {
      object: 'page',
      id: '209803d3-0664-8156-9479-f0ed6ecdb630',
      properties: {
        Name: { title: [{ plain_text: 'AWS Certified Developer' }] },
        Content: { rich_text: [{ plain_text: 'Advanced cloud application development on AWS' }] },
        Section: { select: { name: 'Certificates' } },
        Order: { number: 1 },
        Link: { url: 'https://aws.amazon.com/certification/' },
        Icon: { rich_text: [{ plain_text: '🏆' }] }
      },
      created_time: '2025-06-05T13:18:00.000Z',
      last_edited_time: '2025-06-05T13:18:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8147-9f9d-f4adb04b233f',
      properties: {
        Name: { title: [{ plain_text: 'Meta Front-End Developer Certificate' }] },
        Content: { rich_text: [{ plain_text: 'Professional frontend development with React and modern tools' }] },
        Section: { select: { name: 'Certificates' } },
        Order: { number: 2 },
        Link: { url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer' },
        Icon: { rich_text: [{ plain_text: '🏅' }] }
      },
      created_time: '2025-06-05T13:19:00.000Z',
      last_edited_time: '2025-06-05T13:19:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-811b-8bda-db317553ee87',
      properties: {
        Name: { title: [{ plain_text: 'Google UX Design Certificate' }] },
        Content: { rich_text: [{ plain_text: 'Comprehensive UX design process and portfolio development' }] },
        Section: { select: { name: 'Certificates' } },
        Order: { number: 3 },
        Link: { url: 'https://www.coursera.org/professional-certificates/google-ux-design' },
        Icon: { rich_text: [{ plain_text: '🎨' }] }
      },
      created_time: '2025-06-05T13:19:00.000Z',
      last_edited_time: '2025-06-05T13:19:00.000Z',
    },
    // Projects Section
    {
      object: 'page',
      id: '209803d3-0664-81ba-998e-d39f92b9f7d9',
      properties: {
        Name: { title: [{ plain_text: 'Ghibli-Inspired Portfolio' }] },
        Content: { rich_text: [{ plain_text: 'Interactive portfolio with Studio Ghibli aesthetic and smooth animations' }] },
        Section: { select: { name: 'Projects' } },
        Order: { number: 1 },
        Link: { url: 'https://github.com/user/ghibli-portfolio' },
        Icon: { rich_text: [{ plain_text: '🌱' }] }
      },
      created_time: '2025-06-05T13:19:00.000Z',
      last_edited_time: '2025-06-05T13:19:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-812a-8da1-dd98a573f266',
      properties: {
        Name: { title: [{ plain_text: 'Real-time Chat Application' }] },
        Content: { rich_text: [{ plain_text: 'Full-stack chat app with WebSocket integration and modern UI' }] },
        Section: { select: { name: 'Projects' } },
        Order: { number: 2 },
        Link: { url: 'https://github.com/user/realtime-chat' },
        Icon: { rich_text: [{ plain_text: '💬' }] }
      },
      created_time: '2025-06-05T13:19:00.000Z',
      last_edited_time: '2025-06-05T13:19:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8114-849e-f52ba0c8301a',
      properties: {
        Name: { title: [{ plain_text: 'E-commerce Platform' }] },
        Content: { rich_text: [{ plain_text: 'Complete online store with payment integration and admin dashboard' }] },
        Section: { select: { name: 'Projects' } },
        Order: { number: 3 },
        Link: { url: 'https://github.com/user/ecommerce-platform' },
        Icon: { rich_text: [{ plain_text: '🛍️' }] }
      },
      created_time: '2025-06-05T13:19:00.000Z',
      last_edited_time: '2025-06-05T13:19:00.000Z',
    },
    // About Section
    {
      object: 'page',
      id: '209803d3-0664-8113-a88b-e77beddf76c6',
      properties: {
        Name: { title: [{ plain_text: 'Experience' }] },
        Content: { rich_text: [{ plain_text: '3+ years creating beautiful and functional web experiences' }] },
        Section: { select: { name: 'About' } },
        Order: { number: 1 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '💼' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-81af-abf3-e4dc7b05490a',
      properties: {
        Name: { title: [{ plain_text: 'Education' }] },
        Content: { rich_text: [{ plain_text: 'Computer Science degree with focus on web technologies' }] },
        Section: { select: { name: 'About' } },
        Order: { number: 2 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '🎓' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8199-870f-e6880fd7455f',
      properties: {
        Name: { title: [{ plain_text: 'Passion' }] },
        Content: { rich_text: [{ plain_text: 'Creating immersive digital experiences inspired by art and nature' }] },
        Section: { select: { name: 'About' } },
        Order: { number: 3 },
        Link: { url: null },
        Icon: { rich_text: [{ plain_text: '✨' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
    // Contact Section  
    {
      object: 'page',
      id: '209803d3-0664-81eb-b9ef-d8a6a0409d1b',
      properties: {
        Name: { title: [{ plain_text: 'Email' }] },
        Content: { rich_text: [{ plain_text: 'hello@ghiblidev.com' }] },
        Section: { select: { name: 'Contact' } },
        Order: { number: 1 },
        Link: { url: 'mailto:hello@ghiblidev.com' },
        Icon: { rich_text: [{ plain_text: '📧' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8185-a0a7-cc76c29c86c0',
      properties: {
        Name: { title: [{ plain_text: 'LinkedIn' }] },
        Content: { rich_text: [{ plain_text: 'Connect with me professionally' }] },
        Section: { select: { name: 'Contact' } },
        Order: { number: 2 },
        Link: { url: 'https://linkedin.com/in/ghiblidev' },
        Icon: { rich_text: [{ plain_text: '👤' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
    {
      object: 'page',
      id: '209803d3-0664-8114-9527-c90b26bed97c',
      properties: {
        Name: { title: [{ plain_text: 'GitHub' }] },
        Content: { rich_text: [{ plain_text: 'Check out my code and projects' }] },
        Section: { select: { name: 'Contact' } },
        Order: { number: 3 },
        Link: { url: 'https://github.com/ghiblidev' },
        Icon: { rich_text: [{ plain_text: '💻' }] }
      },
      created_time: '2025-06-05T13:20:00.000Z',
      last_edited_time: '2025-06-05T13:20:00.000Z',
    },
  ];

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredData = mockRealData;
  if (section) {
    filteredData = mockRealData.filter(item => {
      const properties = item.properties as {
        Section?: { select?: { name?: string } };
      };
      const itemSection = properties.Section?.select?.name;
      return itemSection === section;
    });
  }
  
  return {
    results: filteredData,
    has_more: false,
    next_cursor: undefined,
  };
}

// Improved mock function using the API simulator (keeping for fallback)
export async function fetchPortfolioDataMock(section?: string): Promise<NotionPortfolioItem[]> {
  try {
    const apiResponse = await mockNotionAPI(section);
    return apiResponse.results.map(transformNotionItem);
  } catch (error) {
    console.error('Error in mock API:', error);
    return [];
  }
} 