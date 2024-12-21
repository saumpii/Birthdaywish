import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Update the connection check to use the correct environment variable
const dbUrl = process.env.POSTGRES_POSTGRES_URL || 
              process.env.POSTGRES_DATABASE_URL_UNPOOLED;

if (!dbUrl) {
  console.error('Database URL not configured correctly');
}

export async function POST(req) {
  try {
    const { username } = await req.json();
    console.log('Checking username:', username);

    // First check if the database is connected
    try {
      const { rows: dbCheck } = await sql`SELECT NOW();`;
      console.log('Database connected:', dbCheck[0]);
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      throw new Error('Database connection failed');
    }

    const { rows } = await sql`
      SELECT username 
      FROM rooms 
      WHERE username = ${username};
    `;
    
    console.log('Username check result:', rows);

    return NextResponse.json({ 
      isAvailable: rows.length === 0 
    });
  } catch (error) {
    console.error('Error in check-username:', error);
    return NextResponse.json({ 
      error: error.message,
      isAvailable: false 
    }, { 
      status: 500 
    });
  }
}