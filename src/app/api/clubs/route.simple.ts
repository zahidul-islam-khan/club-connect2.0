import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const clubs = await db.club.findMany({
      where: { status: 'ACTIVE' },
      include: {
        leader: {
          select: { name: true, email: true }
        },
        _count: {
          select: { 
            memberships: { where: { status: 'ACCEPTED' } },
            events: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    const clubsData = clubs.map((club) => {
      let activities = [];
      try {
        activities = club.activities ? JSON.parse(club.activities) : [];
      } catch (e) {
        activities = typeof club.activities === 'string' ? club.activities.split(', ') : [];
      }

      return {
        id: club.id,
        name: club.name,
        description: club.description,
        category: club.category,
        department: club.department,
        status: club.status,
        logoUrl: club.logoUrl,
        website: club.website,
        email: club.email,
        phone: club.phone,
        advisor: club.advisor,
        foundedYear: club.foundedYear,
        vision: club.vision,
        mission: club.mission,
        activities: activities,
        leaderId: club.leaderId,
        leader: club.leader,
        memberCount: club._count.memberships,
        eventCount: club._count.events,
        membershipStatus: null,
      };
    });

    return NextResponse.json({ 
      clubs: clubsData,
      count: clubsData.length
    });
  } catch (error) {
    console.error('Clubs API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
