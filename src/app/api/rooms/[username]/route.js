import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request, { params }) {
  try {
    const username = params.username;

    // Get room details
    const { rows } = await sql`
      SELECT r.*, 
             array_agg(rm.email) as invited_members
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