import { NotionResponse, NotionDatabaseResult } from '../types/notion';

// Notion Database ID for the Ghibli Portfolio Data
const NOTION_DATABASE_ID = process.env.VITE_NOTION_DB_ID;

// Updated mock data to match the new database structure

// Mock API response data
const mockAPIData: NotionDatabaseResult[] = [
  // Skills Section
  {
    object: 'page',
    id: '1',
    properties: {
      Name: { title: [{ plain_text: 'Business Data Analysis' }] },
      Content: { rich_text: [{ plain_text: 'SQL, Tableau, Power BI, Excel' }] },
      Section: { select: { name: 'Skills' } },
      Order: { number: 1 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '2',
    properties: {
      Name: { title: [{ plain_text: 'Data Engineering' }] },
      Content: { rich_text: [{ plain_text: 'Python, Apache Spark, AWS, ETL Pipelines' }] },
      Section: { select: { name: 'Skills' } },
      Order: { number: 2 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '3',
    properties: {
      Name: { title: [{ plain_text: 'Data Science' }] },
      Content: { rich_text: [{ plain_text: 'Machine Learning, R, Statistics, Deep Learning' }] },
      Section: { select: { name: 'Skills' } },
      Order: { number: 3 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  // Certificates Section
  {
    object: 'page',
    id: '4',
    properties: {
      Name: { title: [{ plain_text: 'AWS Certified Data Engineer' }] },
      Content: { rich_text: [{ plain_text: 'Advanced cloud data solutions & architecture' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 1 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '5',
    properties: {
      Name: { title: [{ plain_text: 'Google Data Analytics Certificate' }] },
      Content: { rich_text: [{ plain_text: 'Professional data analysis & visualization' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 2 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '6',
    properties: {
      Name: { title: [{ plain_text: 'Microsoft Azure Data Scientist' }] },
      Content: { rich_text: [{ plain_text: 'Machine learning & AI expertise' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 3 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '7',
    properties: {
      Name: { title: [{ plain_text: 'Tableau Desktop Specialist' }] },
      Content: { rich_text: [{ plain_text: 'Advanced data visualization techniques' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 4 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '8',
    properties: {
      Name: { title: [{ plain_text: 'Apache Spark Developer' }] },
      Content: { rich_text: [{ plain_text: 'Big data processing & analytics' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 5 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '9',
    properties: {
      Name: { title: [{ plain_text: 'Python Data Science Certification' }] },
      Content: { rich_text: [{ plain_text: 'Advanced Python for data analysis' }] },
      Section: { select: { name: 'Certificates' } },
      Order: { number: 6 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  // Projects Section
  {
    object: 'page',
    id: '10',
    properties: {
      Name: { title: [{ plain_text: 'E-commerce Analytics Dashboard' }] },
      Content: { rich_text: [{ plain_text: 'Real-time sales insights with Tableau & SQL' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 1 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '11',
    properties: {
      Name: { title: [{ plain_text: 'Predictive Customer Churn Model' }] },
      Content: { rich_text: [{ plain_text: 'ML model reducing churn by 25% using Python' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 2 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '12',
    properties: {
      Name: { title: [{ plain_text: 'ETL Pipeline for Financial Data' }] },
      Content: { rich_text: [{ plain_text: 'Automated data processing with Apache Spark' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 3 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '13',
    properties: {
      Name: { title: [{ plain_text: 'Social Media Sentiment Analysis' }] },
      Content: { rich_text: [{ plain_text: 'NLP model analyzing customer feedback' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 4 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '14',
    properties: {
      Name: { title: [{ plain_text: 'Supply Chain Optimization' }] },
      Content: { rich_text: [{ plain_text: 'Data-driven logistics improvement system' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 5 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '15',
    properties: {
      Name: { title: [{ plain_text: 'Healthcare Data Warehouse' }] },
      Content: { rich_text: [{ plain_text: 'Scalable data architecture on AWS' }] },
      Section: { select: { name: 'Projects' } },
      Order: { number: 6 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  // About Section
  {
    object: 'page',
    id: '16',
    properties: {
      Name: { title: [{ plain_text: 'Experience' }] },
      Content: { rich_text: [{ plain_text: '5+ years in data analytics and engineering' }] },
      Section: { select: { name: 'About' } },
      Order: { number: 1 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '17',
    properties: {
      Name: { title: [{ plain_text: 'Education' }] },
      Content: { rich_text: [{ plain_text: 'MS in Data Science, BS in Statistics' }] },
      Section: { select: { name: 'About' } },
      Order: { number: 2 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '18',
    properties: {
      Name: { title: [{ plain_text: 'Passion' }] },
      Content: { rich_text: [{ plain_text: 'Bridging the gap between data and business value' }] },
      Section: { select: { name: 'About' } },
      Order: { number: 3 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  // Contact Section
  {
    object: 'page',
    id: '19',
    properties: {
      Name: { title: [{ plain_text: 'Email' }] },
      Content: { rich_text: [{ plain_text: 'data.expert@email.com' }] },
      Section: { select: { name: 'Contact' } },
      Order: { number: 1 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '20',
    properties: {
      Name: { title: [{ plain_text: 'LinkedIn' }] },
      Content: { rich_text: [{ plain_text: 'linkedin.com/in/dataexpert' }] },
      Link: { url: 'https://linkedin.com/in/dataexpert' },
      Section: { select: { name: 'Contact' } },
      Order: { number: 2 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
  {
    object: 'page',
    id: '21',
    properties: {
      Name: { title: [{ plain_text: 'GitHub' }] },
      Content: { rich_text: [{ plain_text: 'github.com/dataexpert' }] },
      Link: { url: 'https://github.com/dataexpert' },
      Section: { select: { name: 'Contact' } },
      Order: { number: 3 },
    },
    created_time: new Date().toISOString(),
    last_edited_time: new Date().toISOString(),
  },
];

export async function mockNotionAPI(section?: string): Promise<NotionResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredData = mockAPIData;
  if (section) {
    filteredData = mockAPIData.filter(item => {
      const itemSection = (item.properties as {
        Section?: { select?: { name?: string } }
      }).Section?.select?.name;
      return itemSection === section;
    });
  }
  
  return {
    results: filteredData,
    has_more: false,
    next_cursor: undefined,
  };
}

// Real Notion API function
export async function fetchNotionData(section?: string): Promise<NotionResponse> {
  try {
    // This would be called via your backend API or Notion client
    // For now, we'll use the mock data but with proper structure
    return await mockNotionAPI(section);
  } catch (error) {
    console.error('Error fetching Notion data:', error);
    // Return mock data as fallback
    return await mockNotionAPI(section);
  }
} 