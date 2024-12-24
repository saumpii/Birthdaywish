'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import QRCodeGenerator from '../components/QRCodeGenerator';

export default function CreateRoom() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    roomName: '',
    theme: 'theme1'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          adminEmail: session?.user?.email
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
              <label className="block text-sm font-medium mb-1">
                Room URL Name
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="unique-room-name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Birthday Person's Name
              </label>
              <input
                type="text"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Choose Theme
              </label>
              <select
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="theme1">Colorful Party</option>
                <option value="theme2">Elegant Celebration</option>
                <option value="theme3">Fun Fiesta</option>
                <option value="theme4">Starry Night</option>
              </select>
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