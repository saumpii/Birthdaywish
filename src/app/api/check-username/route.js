// src/app/api/check-username/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { username } = await req.json();
    console.log('Checking username:', username);

    // Check if the rooms table exists
    const { rows: tables } = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'rooms'
      );
    `;

    console.log('Tables check:', tables);

    if (!tables[0].exists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE IF NOT EXISTS rooms (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          room_name VARCHAR(255) NOT NULL,
          theme VARCHAR(50) NOT NULL,
          admin_email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('Created rooms table');
    }

    // Check for existing username
    const { rows } = await sql`
      SELECT username 
      FROM rooms 
      WHERE username = ${username};
    `;
    
    console.log('Query result:', rows);

    const isAvailable = rows.length === 0;
    console.log('Username available:', isAvailable);

    return NextResponse.json({ isAvailable });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: error.message, isAvailable: true },
      { status: 200 }
    );
  }
}