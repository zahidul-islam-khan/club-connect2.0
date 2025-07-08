import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userEmail, clubName } = await request.json()

    // Find the user
    const user = await db.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find the club
    const club = await db.club.findUnique({
      where: { name: clubName }
    })

    if (!club) {
      return NextResponse.json({ error: 'Club not found' }, { status: 404 })
    }

    // Update user role to CLUB_LEADER
    await db.user.update({
      where: { id: user.id },
      data: { role: 'CLUB_LEADER' }
    })

    // Assign user as club leader
    await db.club.update({
      where: { id: club.id },
      data: { leaderId: user.id }
    })

    return NextResponse.json({ 
      message: `Successfully assigned ${userEmail} as leader of ${clubName}`,
      user: { id: user.id, email: user.email, role: 'CLUB_LEADER' },
      club: { id: club.id, name: club.name }
    })

  } catch (error) {
    console.error('Error assigning club leader:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
