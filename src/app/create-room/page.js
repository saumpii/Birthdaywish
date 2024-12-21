// src/app/create-room/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ROOM_THEMES = [
  { id: 'theme1', name: 'Colorful Party', background: 'bg-gradient-to-r from-pink-200 to-purple-200' },
  { id: 'theme2', name: 'Confetti Fun', background: 'bg-gradient-to-r from-yellow-200 to-orange-200' },
  { id: 'theme3', name: 'Birthday Balloons', background: 'bg-gradient-to-r from-blue-200 to-indigo-200' },
  { id: 'theme4', name: 'Cake & Gifts', background: 'bg-gradient-to-r from-green-200 to-teal-200' },
];

export default function CreateRoom() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    roomName: '',
    theme: 'theme1',
    invitedEmails: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // If loading or redirecting, show loading state
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 pt-20 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if username is unique
      const checkResponse = await fetch('/api/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username }),
      });

      const checkData = await checkResponse.json();
      if (!checkData.isAvailable) {
        setError('This username is already taken. Please choose another one.');
        setIsLoading(false);
        return;
      }

      // Create room
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adminEmail: session?.user?.email,
          invitedEmails: formData.invitedEmails.split(',').map(email => email.trim())
        }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/room/${formData.username}`);
      } else {
        setError(data.error || 'Failed to create room');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Create a Birthday Room</h1>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Choose a Username for Room URL
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="username"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Your room will be available at: /room/{formData.username || 'username'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Birthday Room Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Theme
              </label>
              <div className="grid grid-cols-2 gap-4">
                {ROOM_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    className={`${theme.background} p-4 rounded-lg cursor-pointer transition-all ${
                      formData.theme === theme.id ? 'ring-2 ring-purple-500 scale-105' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                  >
                    {theme.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invite People (Email Addresses)
              </label>
              <textarea
                value={formData.invitedEmails}
                onChange={(e) => setFormData({ ...formData, invitedEmails: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 h-32"
                placeholder="Enter email addresses separated by commas"
              />
              <p className="mt-1 text-sm text-gray-500">
                Only invited people will be able to access this room
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg text-lg font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating Room...' : 'Create Room 🎉'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}