// src/app/api/rooms/invite/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';

export async function POST(req) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, email } = await req.json();

    // Check if user is admin
    const { rows: adminCheck } = await sql`
      SELECT admin_email FROM rooms WHERE id = ${roomId}
    `;

    if (!adminCheck.length || adminCheck[0].admin_email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if member already exists
    const { rows: existingMember } = await sql`
      SELECT * FROM room_members 
      WHERE room_id = ${roomId} AND email = ${email}
    `;

    if (existingMember.length > 0) {
      return NextResponse.json({ error: 'User already invited' }, { status: 400 });
    }

    // Add new member
    await sql`
      INSERT INTO room_members (room_id, email)
      VALUES (${roomId}, ${email})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inviting user:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to invite user' 
    }, { 
      status: 500 
    });
  }
}