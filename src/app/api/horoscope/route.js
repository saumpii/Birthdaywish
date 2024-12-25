// src/app/api/horoscope/route.js
export async function POST(req) {
    try {
      const { sign } = await req.json();
      
      // Get token
      const tokenResponse = await fetch('https://api.prokerala.com/v2/token', {  // Updated URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': process.env.PROKERALA_CLIENT_ID,
          'client_secret': process.env.PROKERALA_CLIENT_SECRET,
        }),
      });
  
      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;
  
      // Get horoscope - updated endpoint URL
      const today = new Date().toISOString().split('T')[0];
      const horoscopeResponse = await fetch(
        `https://api.prokerala.com/v2/horoscope/daily/${sign}?ayanamsa=1&datetime=${today}`, // Updated URL
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const horoscopeData = await horoscopeResponse.json();
      
      // Log response for debugging
      console.log('Horoscope Response:', horoscopeData);
  
      return Response.json(horoscopeData);
    } catch (error) {
      console.error('API Error:', error);
      return Response.json({ 
        error: 'Failed to fetch horoscope',
        details: error.message 
      }, { status: 500 });
    }
  }