// src/app/api/notes/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { roomId, content, positionX, positionY, authorEmail } = await req.json();
    
    const { rows: [note] } = await sql`
      INSERT INTO notes (room_id, content, position_x, position_y, author_email)
      VALUES (${roomId}, ${content}, ${positionX}, ${positionY}, ${authorEmail})
      RETURNING *
    `;

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { noteId, content } = await req.json();
    
    const { rows: [note] } = await sql`
      UPDATE notes 
      SET content = ${content},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${noteId}
      RETURNING *
    `;

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update note' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { noteId } = await req.json();
    
    await sql`
      DELETE FROM notes 
      WHERE id = ${noteId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete note' },
      { status: 500 }
    );
  }
}