const axios = require('axios');

async function testRegistration() {
  try {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    };

    console.log('Sending registration request with data:', userData);
    
    const response = await axios.post('http://localhost:3001/api/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful!');
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the test
testRegistration();
