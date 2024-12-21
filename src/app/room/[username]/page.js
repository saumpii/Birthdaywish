// src/app/room/[username]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

const Note = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);

  return (
    <div
      className="absolute"
      style={{
        left: note.x,
        top: note.y,
        transform: `rotate(${Math.random() * 6 - 3}deg)`
      }}
    >
      <div className="w-48 h-48 bg-yellow-100 p-4 rounded shadow-lg cursor-move">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onUpdate({ ...note, content });
            }}
            className="w-full h-full bg-transparent resize-none focus:outline-none"
            autoFocus
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="w-full h-full overflow-auto"
          >
            {content}
          </div>
        )}
        <button
          onClick={() => onDelete(note.id)}
          className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default function Room() {
  const { username } = useParams();
  const { data: session, status } = useSession();
  const [room, setRoom] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch room data and notes
    // This would be replaced with actual API calls
    setRoom({
      theme: 'theme1',
      name: 'Birthday Room',
      adminEmail: 'admin@example.com'
    });
    setNotes([]);
    setIsLoading(false);
  }, [username]);

  const addNote = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newNote = {
      id: Date.now(),
      content: '',
      x,
      y,
      author: session?.user?.email
    };

    setNotes([...notes, newNote]);
  };

  const updateNote = (updatedNote) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen pt-16 ${room?.theme}`}>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">{room?.name}</h1>
        
        <div
          onClick={addNote}
          className="relative min-h-[600px] bg-white/50 rounded-lg shadow-lg p-8"
        >
          {notes.map(note => (
            <Note
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
          
          <div className="absolute bottom-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addNote({
                  clientX: window.innerWidth / 2,
                  clientY: window.innerHeight / 2,
                  currentTarget: e.currentTarget.parentElement.parentElement
                });
              }}
              className="bg-purple-500 text-white p-4 rounded-full shadow-lg hover:bg-purple-600 transition-colors"
            >
              + Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}