// src/app/api/test-connection/route.js
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  
  try {
    // Log all available database-related environment variables
    const envVars = {
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasPoolingUrl: !!process.env.POSTGRES_URL_NON_POOLING,
      hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
      postgresHost: !!process.env.POSTGRES_HOST,
      postgresUser: !!process.env.POSTGRES_USER,
      postgresPassword: !!process.env.POSTGRES_PASSWORD,
      postgresDatabase: !!process.env.POSTGRES_DATABASE,
    };

    console.log('Available environment variables:', envVars);

    // Test the connection
    const { rows } = await sql`SELECT current_timestamp;`;

    return NextResponse.json({
      success: true,
      timestamp: rows[0].current_timestamp,
      environmentCheck: envVars
    });
  } catch (error) {
    console.error('Connection error details:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      type: error.name,
      availableVars: {
        hasPostgresUrl: !!process.env.POSTGRES_URL,
        hasPoolingUrl: !!process.env.POSTGRES_URL_NON_POOLING
      }
    }, { status: 500 });
  }
}