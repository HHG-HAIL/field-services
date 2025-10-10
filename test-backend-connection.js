// Test Backend Connection Script
const testBackendConnection = async () => {
  const endpoints = [
    'http://localhost:8081/api/work-orders',
    'http://localhost:8082/api/technicians', 
    'http://localhost:8083/api/schedules'
  ];

  console.log('🔍 Testing backend connections...\n');

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      console.log(`✅ ${endpoint}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data count: ${Array.isArray(data) ? data.length : 'N/A'}`);
      console.log(`   Sample: ${JSON.stringify(data).substring(0, 100)}...\n`);
    } catch (error) {
      console.log(`❌ ${endpoint}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
};

// For Node.js environment
if (typeof require !== 'undefined') {
  const fetch = require('node-fetch');
  testBackendConnection();
}

// For browser environment
if (typeof window !== 'undefined') {
  testBackendConnection();
}