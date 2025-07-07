import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { clubId, action } = await request.json()

    if (!clubId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user data with more details
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        studentId: true, 
        department: true 
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'join') {
      // Check if already a member
      const existingMembership = await db.membership.findUnique({
        where: { 
          userId_clubId: {
            userId: user.id,
            clubId: clubId
          }
        }
      })

      if (existingMembership) {
        return NextResponse.json({ 
          error: 'Already applied or member of this club' 
        }, { status: 400 })
      }

      // Get club details and leader info
      const club = await db.club.findUnique({
        where: { id: clubId },
        include: {
          leader: {
            select: { name: true, email: true }
          }
        }
      })

      if (!club) {
        return NextResponse.json({ error: 'Club not found' }, { status: 404 })
      }

      // Create new membership application
      const membership = await db.membership.create({
        data: {
          userId: user.id,
          clubId: clubId,
          role: 'MEMBER',
          status: 'PENDING'
        }
      })

      // Send notification email to club leader
      try {
        if (club.leader?.email) {
          await sendEmail({
            to: club.leader.email,
            subject: `New Membership Application for ${club.name}`,
            html: emailTemplates.clubLeaderNotification(
              club.leader.name,
              user.name,
              user.studentId || 'N/A',
              club.name,
              user.department || 'N/A'
            )
          })
        }
      } catch (emailError) {
        console.error('Failed to send club leader notification:', emailError)
        // Don't fail the request if email fails
      }

      return NextResponse.json({ 
        message: 'Application submitted successfully',
        membership 
      })
    } else if (action === 'leave') {
      // Remove membership
      await db.membership.delete({
        where: { 
          userId_clubId: {
            userId: user.id,
            clubId: clubId
          }
        }
      })

      return NextResponse.json({ message: 'Left club successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Memberships API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
