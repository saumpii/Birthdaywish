// src/app/api/create-room/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { username, roomName, theme, adminEmail, invitedEmails } = await req.json();
    console.log('Creating room with data:', { username, roomName, theme, adminEmail });

    // Check if username is taken first
    const { rows: existingRows } = await sql`
      SELECT username FROM rooms WHERE username = ${username}
    `;

    if (existingRows.length > 0) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create room
    const { rows: [room] } = await sql`
      INSERT INTO rooms (username, room_name, theme, admin_email)
      VALUES (${username}, ${roomName}, ${theme}, ${adminEmail})
      RETURNING *
    `;

    // Create room_members table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS room_members (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add invited members
    if (invitedEmails && invitedEmails.length > 0) {
      for (const email of invitedEmails) {
        await sql`
          INSERT INTO room_members (room_id, email)
          VALUES (${room.id}, ${email})
        `;
      }
    }

    console.log('Room created successfully:', room);
    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}