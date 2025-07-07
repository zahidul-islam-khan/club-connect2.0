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
    const status = searchParams.get('status') || 'ACTIVE'

    // Get user data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's current memberships
    const userMemberships = await db.membership.findMany({
      where: { userId: user.id },
      select: { clubId: true, status: true }
    })

    const membershipMap = new Map(
      userMemberships.map((m: any) => [m.clubId, m.status])
    )

    // Get clubs with search filtering
    const clubs = await db.club.findMany({
      where: {
        status,
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
            { department: { contains: search } }
          ]
        })
      },
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
    })

    const clubsWithMembership = clubs.map((club: any) => {
      // Parse activities from JSON string
      let activities: string[] = []
      try {
        activities = club.activities ? JSON.parse(club.activities) : []
      } catch (e) {
        activities = []
      }

      return {
        id: club.id,
        name: club.name,
        description: club.description,
        logo: club.logo,
        department: club.department,
        foundedYear: club.foundedYear,
        vision: club.vision,
        mission: club.mission,
        activities,
        leader: club.leader,
        memberCount: club._count.memberships,
        eventCount: club._count.events,
        membershipStatus: membershipMap.get(club.id) || null,
        website: club.website,
        email: club.email
      }
    })

    return NextResponse.json({ clubs: clubsWithMembership })
  } catch (error) {
    console.error('Clubs API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
