// src/app/room/[username]/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';

const ROOM_THEMES = {
  'theme1': {
    name: 'Colorful Party',
    background: 'bg-gradient-to-br from-pink-300 via-purple-200 to-indigo-300',
    titleStyle: 'text-5xl font-bold text-purple-600',
    noteStyle: 'bg-pink-100',
    buttonStyle: 'bg-purple-500 hover:bg-purple-600'
  },
  'theme2': {
    name: 'Elegant Celebration',
    background: 'bg-gradient-to-br from-rose-200 via-red-100 to-orange-200',
    titleStyle: 'text-5xl font-bold text-rose-600',
    noteStyle: 'bg-rose-50',
    buttonStyle: 'bg-rose-500 hover:bg-rose-600'
  },
  'theme3': {
    name: 'Fun Fiesta',
    background: 'bg-gradient-to-br from-yellow-200 via-green-100 to-blue-200',
    titleStyle: 'text-5xl font-bold text-emerald-600',
    noteStyle: 'bg-yellow-50',
    buttonStyle: 'bg-emerald-500 hover:bg-emerald-600'
  },
  'theme4': {
    name: 'Starry Night',
    background: 'bg-gradient-to-br from-indigo-300 via-blue-200 to-purple-300',
    titleStyle: 'text-5xl font-bold text-indigo-600',
    noteStyle: 'bg-blue-50',
    buttonStyle: 'bg-indigo-500 hover:bg-indigo-600'
  }
};

const Note = ({ note, onUpdate, onDelete }) => {
  const [content, setContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const nodeRef = useRef(null);

  return (
    <Draggable
  defaultPosition={{ x: Math.floor(note.position_x), y: Math.floor(note.position_y) }}
  onStop={(e, data) => onUpdate && onUpdate({
    ...note,
    position_x: Math.floor(data.x),
    position_y: Math.floor(data.y)
  })}
  bounds=".overflow-y-auto" // Restrict to scrollable container
  disabled={!onUpdate}
  handle=".drag-handle"
  nodeRef={nodeRef}
>
      <div ref={nodeRef} className={`absolute w-40 md:w-48 ${note.theme ? ROOM_THEMES[note.theme].noteStyle : 'bg-yellow-100'} rounded-lg shadow-lg`}>
        <div className="drag-handle h-6 bg-gray-100/50 rounded-t-lg" />
        <div className="relative p-3">
          {isEditing ? (
            <textarea
              className="w-full h-24 md:h-32 p-2 bg-transparent resize-none focus:outline-none border rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={() => {
                setIsEditing(false);
                if (content !== note.content && onUpdate) {
                  onUpdate({ ...note, content });
                }
              }}
              autoFocus
            />
          ) : (
            <div
              onClick={() => onUpdate && setIsEditing(true)}
              className={`w-full h-24 md:h-32 p-2 ${onUpdate ? 'cursor-text' : 'cursor-default'} overflow-auto text-sm md:text-base`}
            >
              {content}
            </div>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center text-red-500 opacity-0 hover:opacity-100 transition-opacity rounded-full hover:bg-red-100"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </Draggable>
  );
};

const InviteUsers = ({ isAdmin, roomId }) => {
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/rooms/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          email: email.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to invite user');
      }

      setSuccess(`Successfully invited ${email}`);
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsInviting(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <form onSubmit={handleInvite} className="flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter email"
        className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500 w-full max-w-[200px] text-sm"
        required
      />
      <button
        type="submit"
        disabled={isInviting}
        className="bg-purple-500 text-white px-3 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 whitespace-nowrap text-sm flex-shrink-0"
      >
        {isInviting ? '...' : 'Invite'}
      </button>
    </div>
    {(error || success) && (
      <div className="absolute top-full left-0 mt-1">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        {success && <p className="text-green-500 text-xs">{success}</p>}
      </div>
    )}
  </form>
  );
};

export default function Room({ params }) {
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const adjustNotePositionsForMobile = (notes) => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return notes;
  
    const mobileNotes = [...notes];
    const containerWidth = Math.floor(window.innerWidth - 100); // Account for padding
  
    mobileNotes.forEach(note => {
      if (note.position_x > containerWidth) {
        // If note is beyond screen width, bring it into view
        note.position_x = Math.floor(Math.random() * (containerWidth - 200));
      }
    });
  
    return mobileNotes;
  };

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector('.inset-0');
      if (container) {
        container.style.overflowY = window.innerWidth <= 768 ? 'auto' : 'hidden';
      }
    };
  
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/rooms/${params.username}`);

        if (!response.ok) {
          throw new Error(response.status === 404 ? 'Room not found' : 'Failed to fetch room');
        }

        const data = await response.json();
        setRoom(data);

        if (data.id) {
          const notesResponse = await fetch(`/api/notes/${data.id}`);
          if (!notesResponse.ok) {
            throw new Error('Failed to fetch notes');
          }
          const notesData = await notesResponse.json();
          setNotes(notesData);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [params.username]);

  const handleAddNote = async () => {
    if (!room?.id || !room.can_edit) return;

    try {
      const container = document.querySelector('.overflow-y-auto');
      const containerRect = container.getBoundingClientRect();
      
      const initialPosition = {
        x: Math.floor(Math.random() * (containerRect.width - 200)), // Keep within container width
        y: Math.floor(Math.random() * (containerRect.height - 200)) // Keep within container height
      };

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          content: '',
          position_x: initialPosition.x,
          position_y: initialPosition.y,
          theme: room.theme
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create note');
      }

      const newNote = await response.json();
      setNotes(prevNotes => [...prevNotes, newNote]);

      // Scroll to the new note
      container.scrollTo({
        top: Math.max(0, initialPosition.y - 100),
        behavior: 'smooth'
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const theme = ROOM_THEMES[room?.theme || 'theme1'];

  return (
    <div className={`${theme.background} min-h-screen pt-16`}>
    {/* Fixed Header */}
    <div className="fixed top-16 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-sm p-4 z-40">
      <h1 className={`text-xl md:text-3xl font-bold text-center ${theme.titleStyle}`}>
        Happy Birthday, {room?.room_name}! 🎉
      </h1>
    </div>

    {/* Main Content Area */}
    <div className="p-4 h-[calc(100vh-180px)]">
      {/* Notes Container */}
      <div 
        className="bg-white/30 backdrop-blur-sm rounded-xl shadow-xl p-4 md:p-8 relative h-full"
      >
        {/* Scrollable Area - only on mobile */}
        <div 
          className={`absolute inset-0 p-4 ${
            window.innerWidth <= 768 ? 'overflow-y-auto' : 'overflow-hidden'
          }`}
        >
          {adjustNotePositionsForMobile(notes).map((note) => (
            <Note
              key={note.id}
              note={note}
              onUpdate={room?.can_edit ? handleUpdateNote : undefined}
              onDelete={room?.can_edit ? handleDeleteNote : undefined}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Fixed Bottom Controls Bar */}
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg p-4 z-40">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        {room?.is_admin && (
          <div className="flex-shrink-0 max-w-[60%] md:max-w-none">
            <InviteUsers isAdmin={true} roomId={room.id} />
          </div>
        )}
        
        {room?.can_edit && (
          <div className="flex-shrink-0 ml-auto">
            <button
              onClick={handleAddNote}
              className={`${theme.buttonStyle} text-white w-12 h-12 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center justify-center`}
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}