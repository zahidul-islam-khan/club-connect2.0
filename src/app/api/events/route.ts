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
