// src/app/api/check-username/route.js
import { NextResponse } from 'next/server';
import { checkUsername } from '@/lib/db';

export async function POST(req) {
  try {
    const { username } = await req.json();
    const result = await checkUsername(username);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// src/app/api/create-room/route.js
import { NextResponse } from 'next/server';
import { createRoom } from '@/lib/db';

export async function POST(req) {
  try {
    const roomData = await req.json();
    const room = await createRoom(roomData);
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// src/app/api/notes/route.js
import { NextResponse } from 'next/server';
import { createNote, updateNote, deleteNote } from '@/lib/db';

export async function POST(req) {
  try {
    const noteData = await req.json();
    const note = await createNote(noteData);
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const noteData = await req.json();
    const note = await updateNote(noteData);
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { noteId } = await req.json();
    await deleteNote(noteId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}