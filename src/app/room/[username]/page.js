// src/app/room/[username]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import { ROOM_THEMES } from '@/app/components/RoomThemes'

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

export default function Room({ params }) {
  const { data: session } = useSession();
  const [room, setRoom] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${params.username}`);
        const data = await response.json();
        setRoom(data);
        
        // Fetch notes
        const notesResponse = await fetch(`/api/notes/${data.id}`);
        const notesData = await notesResponse.json();
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [params.username]);

  const addNote = async () => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room.id,
          content: '',
          position_x: Math.random() * 500,
          position_y: Math.random() * 300,
          authorEmail: session?.user?.email,
          theme: room.theme
        })
      });

      const newNote = await response.json();
      setNotes([...notes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (updatedNote) => {
    try {
      await fetch(`/api/notes/${updatedNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote)
      });

      setNotes(notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE'
      });

      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const theme = ROOM_THEMES[room.theme];

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className={`text-center mb-12 ${theme.titleStyle}`}>
          Happy Birthday, {room.room_name}! 🎉
        </h1>
        
        <div className="relative min-h-[600px] bg-white/30 backdrop-blur-sm rounded-xl shadow-xl p-8">
          {notes.map(note => (
            <Note
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
          
          <button
            onClick={addNote}
            className={`fixed bottom-8 right-8 ${theme.buttonStyle} text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform`}
          >
            + Add Note
          </button>
        </div>
      </div>
    </div>
  );
}