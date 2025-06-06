import React, { useState, useEffect } from 'react';
import { fetchPortfolioDataFromNotion, verifyNotionConnection, checkBackendHealth } from '../lib/typedBackendAPI';
import { NotionPortfolioItem } from '../types/notion';

export default function NotionTest() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [data, setData] = useState<NotionPortfolioItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    testNotionConnection();
  }, []);

  const testNotionConnection = async () => {
    try {
      setStatus('Testing backend health...');
      setError(null);
      console.log('Starting backend and Notion connection test...');
      
      // Test backend health first
      const backendHealthy = await checkBackendHealth();
      console.log('Backend health test result:', backendHealthy);
      
      if (!backendHealthy) {
        setStatus('Backend server not available');
        setError('Backend server at http://localhost:3001 is not responding');
        return;
      }
      
      setStatus('Backend healthy! Testing Notion connection...');
      
      // Test Notion connection through backend
      const connectionOk = await verifyNotionConnection();
      console.log('Notion connection test result:', connectionOk);
      
      if (connectionOk) {
        setStatus('Notion connection successful! Fetching data...');
        
        // Try to fetch Skills data
        const skillsData = await fetchPortfolioDataFromNotion('Skills');
        console.log('Skills data:', skillsData);
        
        setData(skillsData);
        setStatus(`Success! Retrieved ${skillsData.length} items from Skills section`);
      } else {
        setStatus('Notion connection failed');
        setError('Unable to connect to Notion API through backend');
      }
    } catch (err) {
      console.error('Test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setStatus('Test failed');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h3>Notion API Connection Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong> {status}
      </div>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <button onClick={testNotionConnection} style={{ marginBottom: '20px' }}>
        Test Again
      </button>
      
      {data.length > 0 && (
        <div>
          <h4>Retrieved Data:</h4>
          <pre style={{ background: '#f5f5f5', padding: '10px', fontSize: '12px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px' }}>
        <p><strong>Database ID:</strong> {import.meta.env.VITE_NOTION_DB_ID || '209803d3-0664-813d-829e-eed91d2d9600'}</p>
        <p><strong>Has Token:</strong> {import.meta.env.VITE_NOTION_TOKEN ? 'Yes' : 'No'}</p>
        <p><strong>API Base:</strong> {import.meta.env.DEV ? '/api/notion' : 'https://api.notion.com/v1'}</p>
        <p><strong>Dev Mode:</strong> {import.meta.env.DEV ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
} 