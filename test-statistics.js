// Simple test script to check statistics endpoint
const fetch = require('node-fetch');

async function testStatistics() {
  try {
    console.log('Testing statistics endpoint...');
    
    const response = await fetch('http://192.168.50.171:5000/statistics');
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Statistics data:', JSON.stringify(data, null, 2));
    
    // Test individual endpoints as fallback
    console.log('\nTesting fallback endpoints...');
    
    const birthResponse = await fetch('http://192.168.50.171:5000/birthRecords');
    const deathResponse = await fetch('http://192.168.50.171:5000/deathRecords');
    
    const birthData = await birthResponse.json();
    const deathData = await deathResponse.json();
    
    console.log('Birth records count:', Array.isArray(birthData) ? birthData.length : 'Not an array');
    console.log('Death records count:', Array.isArray(deathData) ? deathData.length : 'Not an array');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testStatistics();