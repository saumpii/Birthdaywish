// src/app/api/notes/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { roomId, content, position_x, position_y, theme = 'theme1' } = await req.json();
    
    const { rows: [note] } = await sql`
      INSERT INTO notes (
        room_id, 
        content, 
        position_x, 
        position_y, 
        author_email,
        theme
      ) 
      VALUES (
        ${roomId}, 
        ${content || ''}, 
        ${position_x}, 
        ${position_y}, 
        'anonymous',
        ${theme}
      )
      RETURNING *
    `;

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}