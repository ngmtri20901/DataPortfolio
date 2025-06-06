// Simple API endpoint simulation for Notion data
// This would normally be implemented as a proper backend API

// In a real implementation, this would use the MCP Notion API server
// For now, we'll simulate the response structure

const GHIBLI_DATABASE_ID = '209803d3-0664-813d-829e-eed91d2d9600';

// This simulates what a real backend API would return
export default function handler(req, res) {
  const { section } = req.query;
  
  // Simulate real data from the Ghibli Portfolio database
  const mockData = {
    results: [
      // Skills data
      ...((!section || section === 'Skills') ? [
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
          }
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
          }
        }
      ] : []),
      // Projects data
      ...((!section || section === 'Projects') ? [
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
          }
        }
      ] : [])
      // Add other sections as needed
    ],
    has_more: false,
    next_cursor: null
  };

  // Filter by section if specified
  let filteredResults = mockData.results;
  if (section) {
    filteredResults = mockData.results.filter(item => 
      item.properties.Section.select.name === section
    );
  }

  // Simulate API delay
  setTimeout(() => {
    res.status(200).json({
      ...mockData,
      results: filteredResults
    });
  }, 300);
} 