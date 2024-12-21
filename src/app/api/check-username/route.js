// src/app/api/check-username/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    // Verify we have at least one of the required connection strings
    if (!process.env.POSTGRES_URL && !process.env.POSTGRES_URL_NON_POOLING) {
      throw new Error('Database connection configuration is missing');
    }

    const { username } = await req.json();
    
    // Test connection first
    await sql`SELECT 1`;

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