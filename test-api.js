const axios = require('axios');

// Test mood logging
async function testMoodAPI() {
  try {
    // Get token from login
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'jonathan.new@gmail.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;
    
    console.log('✅ Logged in as:', loginRes.data.user.email, 'ID:', userId);
    console.log('Token:', token.substring(0, 20) + '...');
    
    // Test mood logging
    const moodRes = await axios.post('http://localhost:5000/api/mood', {
      userId,
      mood: 'test',
      rating: 8,
      activities: 'testing',
      notes: 'test entry'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Mood logged successfully:', moodRes.data);
    
    // Get all moods
    const getMoodRes = await axios.get(`http://localhost:5000/api/mood/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Retrieved moods:', getMoodRes.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testMoodAPI();
