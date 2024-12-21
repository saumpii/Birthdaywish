// src/app/api/test-connection/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Log environment variables (securely)
    console.log('Environment check:', {
      hasMainUrl: !!process.env.POSTGRES_POSTGRES_URL,
      hasUnpooledUrl: !!process.env.POSTGRES_DATABASE_URL_UNPOOLED,
      hasPrismaUrl: !!process.env.POSTGRES_POSTGRES_PRISMA_URL
    });

    // Test the connection
    const testResult = await sql`SELECT NOW();`;
    console.log('Connection test result:', testResult);

    return NextResponse.json({
      success: true,
      timestamp: testResult.rows[0].now,
      connection: 'Successfully connected to database'
    });
  } catch (error) {
    console.error('Detailed connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    }, { status: 500 });
  }
}