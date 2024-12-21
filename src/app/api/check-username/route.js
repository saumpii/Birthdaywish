// src/app/api/check-username/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const { username } = await req.json();
    
    const { rows } = await sql`
      SELECT username FROM rooms 
      WHERE username = ${username}
    `;
    
    return NextResponse.json({ 
      isAvailable: rows.length === 0 
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json(
      { error: 'Failed to check username' },
      { status: 500 }
    );
  }
}