// src/app/horoscope/page.js
'use client';
import { useState } from 'react';

const HoroscopePage = () => {
  const [date, setDate] = useState('');
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getZodiacSign = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
    return "pisces";
  };

  const getAccessToken = async () => {
    try {
      const response = await fetch('https://api.prokerala.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': process.env.NEXT_PUBLIC_PROKERALA_CLIENT_ID,
          'client_secret': process.env.NEXT_PUBLIC_PROKERALA_CLIENT_SECRET,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get access token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  };

  const fetchHoroscope = async (sign, token) => {
    const today = new Date().toISOString().split('T')[0];
    const url = new URL('https://api.prokerala.com/v2/astrology/daily-horoscope');
    url.searchParams.append('sign', sign);
    url.searchParams.append('datetime', today);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch horoscope');
    }

    return response.json();
  };

  // src/app/horoscope/page.js
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const sign = getZodiacSign(date);
      
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sign })
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch horoscope');
      }
  
      const data = await response.json();
      console.log('Received data:', data); // Debug log
  
      if (data.error) {
        throw new Error(data.error);
      }
  
      if (!data.data) {
        throw new Error('Invalid response format');
      }
  
      setHoroscope({
        sign: sign,
        prediction: data.data.prediction || 'Prediction not available',
        date: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        lucky_number: data.data.lucky_number || 'N/A',
        lucky_color: data.data.lucky_color || 'N/A',
        mood: data.data.mood || 'N/A'
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Unable to fetch your horoscope. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6 space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-600">
        Know Your Daily Horoscope
      </h1>

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl text-purple-600 mb-4">Enter your birth date</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-4 text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white text-xl py-4 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Getting Horoscope...' : 'Get Horoscope'}
          </button>
        </form>
      </div>

      {error && (
        <div className="max-w-md mx-auto bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {horoscope && !error && (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-4xl font-bold text-purple-600 capitalize mb-4">
            {horoscope.sign}
          </h2>
          <div className="space-y-6">
            <p className="text-sm text-purple-500">
              {horoscope.date}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              {horoscope.prediction}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-purple-600 font-semibold">Lucky Number</h3>
                <p>{horoscope.lucky_number}</p>
              </div>
              <div>
                <h3 className="text-purple-600 font-semibold">Lucky Color</h3>
                <p>{horoscope.lucky_color}</p>
              </div>
              <div>
                <h3 className="text-purple-600 font-semibold">Mood</h3>
                <p>{horoscope.mood}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HoroscopePage;