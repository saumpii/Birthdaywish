// src/app/api/rooms/invite/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    const session = await getServerSession();
    const { roomId, email } = await req.json();

    // Check if user is admin
    const { rows: [room] } = await sql`
      SELECT admin_email FROM rooms WHERE id = ${roomId}
    `;

    if (!room || room.admin_email !== session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Add new member
    await sql`
      INSERT INTO room_members (room_id, email)
      VALUES (${roomId}, ${email})
      ON CONFLICT (room_id, email) DO NOTHING
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json(
      { error: 'Failed to invite user' },
      { status: 500 }
    );
  }
}