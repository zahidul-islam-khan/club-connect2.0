import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Attempting to fetch clubs and update status for debugging...');

    // Step 1: Update all clubs to be ACTIVE
    const updateResult = await db.club.updateMany({
      where: {
        // Update all clubs, regardless of current status
      },
      data: {
        status: 'ACTIVE',
      },
    });

    console.log(`${updateResult.count} clubs updated to ACTIVE status.`);

    // Step 2: Fetch all clubs to verify
    const clubs = await db.club.findMany({});
    console.log(`Found ${clubs.length} clubs in the database after update.`);
    
    const clubCount = clubs.length;
    
    return NextResponse.json({ 
      message: 'Debug and fix process completed.',
      updatedClubCount: updateResult.count,
      totalClubCountAfterUpdate: clubCount,
      clubs: clubs.map(c => ({ name: c.name, status: c.status })), // Return some data to verify
    });

  } catch (error) {
    console.error('Error in debug-and-fix club route:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to run debug and fix process.', details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred.' }, { status: 500 });
  }
}
