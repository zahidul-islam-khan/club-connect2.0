import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail, emailTemplates } from '@/lib/email'
import { z } from 'zod'

// Schema for membership approval actions
const membershipActionSchema = z.object({
  membershipIds: z.array(z.string()).min(1, 'At least one membership ID is required'),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional()
})

// GET - Get pending memberships for club leader's clubs
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let memberships = []

    if (user.role === 'ADMIN') {
      // Admin can see all pending memberships
      memberships = await db.membership.findMany({
        where: {
          status: 'PENDING'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true,
              semester: true
            }
          },
          club: {
            select: {
              id: true,
              name: true,
              department: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else if (user.role === 'CLUB_LEADER') {
      // Club leader can only see memberships for their clubs
      memberships = await db.membership.findMany({
        where: {
          status: 'PENDING',
          club: {
            leaderId: user.id
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true,
              semester: true
            }
          },
          club: {
            select: {
              id: true,
              name: true,
              department: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      return NextResponse.json({ error: 'Access denied. Club leader role required.' }, { status: 403 })
    }

    return NextResponse.json({ memberships })
  } catch (error) {
    console.error('Error fetching pending memberships:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Bulk approve/reject memberships
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user data
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!['CLUB_LEADER', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Access denied. Club leader role required.' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = membershipActionSchema.parse(body)

    // Verify user has permission to modify these memberships
    const memberships = await db.membership.findMany({
      where: {
        id: { in: validatedData.membershipIds },
        status: 'PENDING',
        ...(user.role === 'CLUB_LEADER' && {
          club: {
            leaderId: user.id
          }
        })
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        club: {
          select: { name: true }
        }
      }
    })

    if (memberships.length !== validatedData.membershipIds.length) {
      return NextResponse.json(
        { error: 'Some memberships not found or access denied' },
        { status: 404 }
      )
    }

    // Update membership statuses
    const newStatus = validatedData.action === 'approve' ? 'ACCEPTED' : 'REJECTED'
    const joinedAt = validatedData.action === 'approve' ? new Date() : null

    const updatedMemberships = await db.membership.updateMany({
      where: {
        id: { in: validatedData.membershipIds }
      },
      data: {
        status: newStatus,
        joinedAt: joinedAt,
        updatedAt: new Date()
      }
    })

    // Send email notifications to users about approval/rejection
    try {
      for (const membership of memberships) {
        if (validatedData.action === 'approve') {
          await sendEmail({
            to: membership.user.email,
            subject: `🎉 Welcome to ${membership.club.name}!`,
            html: emailTemplates.membershipApproved(membership.user.name, membership.club.name)
          })
        } else {
          await sendEmail({
            to: membership.user.email,
            subject: `Update on your ${membership.club.name} application`,
            html: emailTemplates.membershipRejected(membership.user.name, membership.club.name)
          })
        }
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: `Successfully ${validatedData.action}d ${updatedMemberships.count} membership(s)`,
      count: updatedMemberships.count,
      memberships: memberships.map((m: any) => ({
        id: m.id,
        userName: m.user.name,
        userEmail: m.user.email,
        clubName: m.club.name,
        newStatus
      }))
    })
  } catch (error) {
    console.error('Error processing membership actions:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
