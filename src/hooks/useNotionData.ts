import { useState, useEffect, useCallback } from 'react';
import { NotionPortfolioItem } from '../types/notion';
import { fetchPortfolioDataFromNotion, verifyNotionConnection, checkBackendHealth } from '../lib/typedBackendAPI';
import { fetchPortfolioDataMock } from '../lib/notion';

// Map frontend section IDs to Notion section names
const sectionMapping: Record<string, string> = {
  'skills': 'Skills',
  'certificates': 'Certificates',
  'projects': 'Projects',
  'about': 'About',
  'contact': 'Contact',
  'welcome': '', // Welcome section doesn't need Notion data
};

export function useNotionData(sectionId?: string) {
  const [data, setData] = useState<NotionPortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Skip loading for welcome section or unknown sections
      if (!sectionId || !sectionMapping[sectionId] || sectionMapping[sectionId] === '') {
        setData([]);
        setLoading(false);
        return;
      }
      
      // Get the proper section name for Notion
      const notionSectionName = sectionMapping[sectionId];
      
      // Use real Notion API data (with fallback to mock data)
      let portfolioData: NotionPortfolioItem[] = [];
      
      try {
        console.log('Checking backend health...');
        const backendHealthy = await checkBackendHealth();
        
        if (backendHealthy) {
          console.log('Backend is healthy, fetching data from Notion via backend...');
          portfolioData = await fetchPortfolioDataFromNotion(notionSectionName);
          
          // If no data returned, verify connection
          if (portfolioData.length === 0) {
            console.log('No data from Notion API, checking connection...');
            const connectionOk = await verifyNotionConnection();
            if (!connectionOk) {
              throw new Error('Notion API connection failed');
            }
          }
        } else {
          throw new Error('Backend server is not available');
        }
      } catch (err) {
        console.warn('Backend/Notion API failed, falling back to mock data:', err);
        portfolioData = await fetchPortfolioDataMock(notionSectionName);
      }
      
      // Sort by order
      const sortedData = portfolioData.sort((a, b) => a.order - b.order);
      setData(sortedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, refetch: loadData };
} 