// src/app/api/rooms/[username]/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    const username = params.username;
    const userEmail = session?.user?.email;

    // Get room details
    const { rows } = await sql`
      SELECT 
        r.*,
        CASE 
          WHEN r.admin_email = ${userEmail} THEN true
          ELSE false
        END as is_admin,
        CASE 
          WHEN r.admin_email = ${userEmail} THEN true
          WHEN EXISTS (
            SELECT 1 
            FROM room_members rm 
            WHERE rm.room_id = r.id 
            AND rm.email = ${userEmail}
          ) THEN true
          ELSE false
        END as can_edit
      FROM rooms r
      WHERE r.username = ${username}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // If user is not logged in, return room data with view-only permissions
    const roomData = rows[0];
    if (!session) {
      roomData.is_admin = false;
      roomData.can_edit = false;
    }

    return NextResponse.json(roomData);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}