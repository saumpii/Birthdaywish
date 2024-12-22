// src/app/room/[username]/page.js
'use client';
import { useState, useEffect } from 'react';
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

  const handleDragStop = (e, data) => {
    onUpdate({
      ...note,
      position_x: data.x,
      position_y: data.y
    });
  };

  const handleContentUpdate = () => {
    setIsEditing(false);
    onUpdate({
      ...note,
      content
    });
  };

  return (
    <Draggable
      defaultPosition={{ x: note.position_x, y: note.position_y }}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div className={`absolute w-48 h-48 ${ROOM_THEMES[note.theme].noteStyle} rounded-lg shadow-xl cursor-move`}>
        <div className="p-2 h-full">
          {isEditing ? (
            <textarea
              className="w-full h-full p-2 bg-transparent resize-none focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onBlur={handleContentUpdate}
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className="w-full h-full p-2 overflow-auto"
            >
              {content}
            </div>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100"
          >
            ×
          </button>
        </div>
      </div>
    </Draggable>
  );
};

const InviteUsers = ({ isAdmin, roomId }) => {
    const [email, setEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [error, setError] = useState('');
  
    const handleInvite = async (e) => {
      e.preventDefault();
      setIsInviting(true);
      setError('');
  
      try {
        const response = await fetch('/api/rooms/invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomId,
            email: email.trim()
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to invite user');
        }
  
        setEmail('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsInviting(false);
      }
    };
  
    if (!isAdmin) return null;
  
    return (
      <div className="absolute bottom-8 left-8">
        <form onSubmit={handleInvite} className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to invite"
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            disabled={isInviting}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
          >
            {isInviting ? 'Inviting...' : 'Invite'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  };

export default function Room({ params }) {
    const router = useRouter();
    const [room, setRoom] = useState(null);
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
        const fetchRoom = async () => {
          try {
            setIsLoading(true);
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
          const initialPosition = {
            x: Math.floor(Math.random() * (window.innerWidth / 2)),
            y: Math.floor(Math.random() * 300)
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
            throw new Error('Failed to create note');
          }
    
          const newNote = await response.json();
          setNotes(prevNotes => [...prevNotes, newNote]);
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
    
          setNotes(prevNotes =>
            prevNotes.map(note =>
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
    
          setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
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
        <div className={`min-h-screen ${theme.background}`}>
          <div className="max-w-7xl mx-auto p-8">
            <h1 className={`text-center mb-12 ${theme.titleStyle}`}>
              Happy Birthday, {room?.room_name}! 🎉
            </h1>
            
            <div className="relative min-h-[600px] bg-white/30 backdrop-blur-sm rounded-xl shadow-xl p-8">
              {notes.map(note => (
                <Note
                  key={note.id}
                  note={note}
                  onUpdate={room?.can_edit ? handleUpdateNote : undefined}
                  onDelete={room?.can_edit ? handleDeleteNote : undefined}
                />
              ))}
              
              {room?.can_edit && (
                <button
                  onClick={handleAddNote}
                  className={`fixed bottom-8 right-8 ${theme.buttonStyle} text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2`}
                >
                  <span className="text-xl">+</span>
                  <span>Add Note</span>
                </button>
              )}
    
              <InviteUsers isAdmin={room?.is_admin} roomId={room?.id} />
            </div>
          </div>
        </div>
      );
    }