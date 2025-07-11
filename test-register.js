// Use Node 18+ built-in fetch

async function testRegister() {
  try {
    const response = await fetch('https://cleantabs-70sittn2y-umit-akdeniz.vercel.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://cleantabs-70sittn2y-umit-akdeniz.vercel.app/auth/signup'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPassword123'
      })
    });

    const data = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRegister();