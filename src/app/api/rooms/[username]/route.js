// src/app/api/rooms/[username]/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    const username = params.username;

    // Get room details with permissions
    const { rows } = await sql`
      SELECT 
        r.*,
        r.admin_email = ${session?.user?.email} as is_admin,
        EXISTS (
          SELECT 1 
          FROM room_members rm 
          WHERE rm.room_id = r.id 
          AND rm.email = ${session?.user?.email}
        ) as can_edit,
        array_agg(DISTINCT rm.email) as invited_members
      FROM rooms r
      LEFT JOIN room_members rm ON r.id = rm.room_id
      WHERE r.username = ${username}
      GROUP BY r.id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json(
      { error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}