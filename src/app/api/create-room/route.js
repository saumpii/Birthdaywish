import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    if (!process.env.POSTGRES_URL) {
      throw new Error('Database configuration missing');
    }

    const { username, roomName, theme, adminEmail, invitedEmails } = await req.json();
    console.log('Creating room:', { username, roomName, theme, adminEmail });

    // Create room
    const { rows: [room] } = await sql`
      INSERT INTO rooms (username, room_name, theme, admin_email)
      VALUES (${username}, ${roomName}, ${theme}, ${adminEmail})
      RETURNING *
    `;

    // Add invited members
    if (invitedEmails && invitedEmails.length > 0) {
      await Promise.all(invitedEmails.map(email => 
        sql`
          INSERT INTO room_members (room_id, email)
          VALUES (${room.id}, ${email})
        `
      ));
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}