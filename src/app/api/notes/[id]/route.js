// src/app/api/notes/[id]/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request, { params }) {
  try {
    const { rows } = await sql`
      SELECT * FROM notes 
      WHERE room_id = ${params.id} 
      ORDER BY created_at ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { content, position_x, position_y } = await request.json();
    
    const { rows: [note] } = await sql`
      UPDATE notes 
      SET content = ${content},
          position_x = ${position_x},
          position_y = ${position_y},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `;
    
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await sql`DELETE FROM notes WHERE id = ${params.id}`;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}