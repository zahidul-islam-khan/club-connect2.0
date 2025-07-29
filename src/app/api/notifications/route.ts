import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface NotificationItem {
  id: string
  type: 'membership_application' | 'event_reminder' | 'general'
  title: string
  message: string
  href?: string
  createdAt: string
  read: boolean
  metadata?: any
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let notifications: NotificationItem[] = []

    // Admin notifications (for all users)
    const adminNotifications = await db.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    notifications = adminNotifications.map((n: any) => ({
      id: n.id,
      type: 'general' as const,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt?.toISOString() || new Date().toISOString(),
      read: false,
      metadata: {}
    }))

    // Club leader notifications (pending memberships)
    if (user.role === 'CLUB_LEADER') {
      const leaderClubs = await db.membership.findMany({
        where: {
          userId: session.user.id,
          role: 'LEADER',
          status: 'ACCEPTED'
        },
        select: { clubId: true }
      })
      const clubIds = leaderClubs.map((m: any) => m.clubId)
      if (clubIds.length > 0) {
        const pendingMemberships = await db.membership.findMany({
          where: {
            clubId: { in: clubIds },
            status: 'PENDING'
          },
          include: {
            user: {
              select: { name: true, studentId: true, department: true }
            },
            club: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        })
        notifications = [
          ...pendingMemberships.map((membership: any) => ({
            id: membership.id,
            type: 'membership_application' as const,
            title: 'New Membership Application',
            message: `${membership.user.name} (${membership.user.studentId}) wants to join ${membership.club.name}`,
            href: '/club-leader/memberships',
            createdAt: membership.createdAt?.toISOString() || new Date().toISOString(),
            read: false,
            metadata: {
              userId: membership.userId,
              clubId: membership.clubId,
              studentName: membership.user.name,
              clubName: membership.club.name
            }
          })),
          ...notifications
        ]
      }
    }

    return NextResponse.json({
      notifications,
      unreadCount: notifications.filter((n: NotificationItem) => !n.read).length
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Mark notification as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notificationId, markAllRead } = await request.json()

    if (markAllRead) {
      // For now, we don't have a notifications table with read status
      // This would be where you'd mark all notifications as read
      return NextResponse.json({ success: true })
    }

    if (notificationId) {
      // Mark specific notification as read
      // This would update the notification read status in the database
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}
