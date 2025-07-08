import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const statusParam = searchParams.get('status') || 'APPROVED'
    const status = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(statusParam)
      ? statusParam as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
      : 'APPROVED' as const
    const timeFilter = searchParams.get('time') || 'upcoming'

    // Get user data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's event RSVPs
    const userRsvps = await db.eventRsvp.findMany({
      where: { userId: user.id },
      select: { eventId: true, status: true }
    })

    const rsvpMap = new Map(
      userRsvps.map((rsvp: any) => [rsvp.eventId, rsvp.status])
    )

    // Build time filter condition
    const now = new Date()
    let timeCondition = {}
    
    if (timeFilter === 'upcoming') {
      timeCondition = { startDate: { gte: now } }
    } else if (timeFilter === 'past') {
      timeCondition = { endDate: { lt: now } }
    }

    // Get events with search filtering
    const events = await db.event.findMany({
      where: {
        status,
        isPublic: true,
        ...timeCondition,
        ...(search && {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
            { venue: { contains: search } }
          ]
        })
      },
      include: {
        club: {
          select: { 
            name: true, 
            id: true
          }
        },
        _count: {
          select: { 
            rsvps: { where: { status: 'ATTENDING' } }
          }
        }
      },
      orderBy: { startDate: 'asc' }
    })

    const eventsWithRsvp = events.map((event: any) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      venue: event.venue,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      capacity: event.capacity,
      requirements: event.requirements,
      club: event.club,
      attendeeCount: event._count.rsvps,
      userRsvpStatus: rsvpMap.get(event.id) || null,
      spotsRemaining: event.capacity ? 
        Math.max(0, event.capacity - event._count.rsvps) : null
    }))

    return NextResponse.json({ events: eventsWithRsvp })
  } catch (error) {
    console.error('Events API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/events: Creating new event");
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data and verify they are a club leader
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        role: true,
        leadingClubs: {
          select: { id: true, name: true }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.role !== 'CLUB_LEADER' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only club leaders can create events' }, { status: 403 })
    }

    // Parse request data
    const data = await request.json();
    const { 
      title, 
      description, 
      venue, 
      startDate, 
      endDate, 
      capacity, 
      isPublic = true,
      requirements,
      clubId 
    } = data;

    // Validate required fields
    if (!title || !venue || !startDate || !endDate || !clubId) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, venue, startDate, endDate, clubId' 
      }, { status: 400 })
    }

    // Verify the user is the leader of the specified club
    const isLeaderOfClub = user.leadingClubs.some(club => club.id === clubId);
    if (!isLeaderOfClub && user.role !== 'ADMIN') {
      return NextResponse.json({ 
        error: 'You can only create events for clubs you lead' 
      }, { status: 403 })
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return NextResponse.json({ 
        error: 'Event start date cannot be in the past' 
      }, { status: 400 })
    }

    if (end <= start) {
      return NextResponse.json({ 
        error: 'Event end date must be after start date' 
      }, { status: 400 })
    }

    // Create the event
    const event = await db.event.create({
      data: {
        title,
        description: description || null,
        date: start, // Primary date field
        venue: venue || null,
        startDate: start,
        endDate: end,
        capacity: capacity ? parseInt(capacity.toString()) : null,
        isPublic: Boolean(isPublic),
        requirements: requirements || null,
        status: 'PENDING', // Events need admin approval
        clubId
      },
      include: {
        club: {
          select: { name: true }
        }
      }
    });

    console.log(`Event "${title}" created successfully for club ${event.club.name}`);

    return NextResponse.json({ 
      message: 'Event created successfully and submitted for approval',
      event: {
        id: event.id,
        title: event.title,
        venue: event.venue,
        startDate: event.startDate?.toISOString(),
        endDate: event.endDate?.toISOString(),
        status: event.status,
        clubName: event.club.name
      }
    });

  } catch (error) {
    console.error('Create event API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
