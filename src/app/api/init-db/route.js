// src/app/api/init-db/route.js (Add this if it doesn't exist)
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // First, try to add the theme column if it doesn't exist
    await sql`
      ALTER TABLE IF EXISTS notes 
      ADD COLUMN IF NOT EXISTS theme VARCHAR(50);
    `;

    // In case the table doesn't exist, create it with all columns
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        position_x INTEGER NOT NULL,
        position_y INTEGER NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        theme VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully'
    });
  } catch (error) {
    console.error('Database schema update error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}