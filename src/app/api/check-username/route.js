// src/app/api/check-username/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { username } = await req.json();

    // Check if rooms table exists and create if it doesn't
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

    // Now check for the username
    const { rows } = await sql`
      SELECT username FROM rooms WHERE username = ${username}
    `;

    return NextResponse.json({ 
      isAvailable: rows.length === 0 
    });
  } catch (error) {
    console.error('Database operation failed:', error);
    return NextResponse.json({ 
      error: error.message,
      details: {
        type: error.name,
        code: error.code
      }
    }, { 
      status: 500 
    });
  }
}