import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Attempting to fetch clubs from database for debugging...');
    const clubs = await db.club.findMany({
      // No filters, just get all of them
    });
    console.log(`Found ${clubs.length} clubs in the database.`);
    
    const clubCount = await db.club.count();
    
    return NextResponse.json({ 
      message: 'Debug data fetched successfully.',
      clubCount: clubCount,
      clubs: clubs 
    });
  } catch (error) {
    console.error('Error fetching debug club data:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch debug data.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}
