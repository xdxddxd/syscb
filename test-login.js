// Test script to verify login functionality
const testLogin = async () => {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'admin@sistema.com' 
      }),
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Login API is working!');
      
      // Now test auth verification
      const verifyResponse = await fetch('http://localhost:3000/api/auth/verify', {
        headers: {
          'Cookie': response.headers.get('Set-Cookie') || ''
        }
      });
      
      console.log('Verify status:', verifyResponse.status);
      const verifyData = await verifyResponse.json();
      console.log('Verify data:', verifyData);
      
      if (verifyResponse.ok) {
        console.log('✅ Token verification is working!');
      } else {
        console.log('❌ Token verification failed');
      }
    } else {
      console.log('❌ Login failed');
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testLogin();
