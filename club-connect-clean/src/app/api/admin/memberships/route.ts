import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clubId = searchParams.get('clubId')
    const search = searchParams.get('search')

    // Build filter conditions
    const whereConditions: any = {}
    
    if (status && status !== 'all') {
      whereConditions.status = status.toUpperCase()
    }
    
    if (clubId) {
      whereConditions.clubId = clubId
    }

    if (search) {
      whereConditions.OR = [
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            studentId: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    // Get memberships with related data
    const memberships = await db.membership.findMany({
      where: whereConditions,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
            department: true,
            phone: true
          }
        },
        club: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Get summary statistics
    const stats = await db.membership.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    // Format stats for easier use
    const formattedStats = {
      total: memberships.length,
      active: stats.find((s: any) => s.status === 'ACCEPTED')?._count.id || 0,
      pending: stats.find((s: any) => s.status === 'PENDING')?._count.id || 0,
      rejected: stats.find((s: any) => s.status === 'REJECTED')?._count.id || 0
    }

    // Get clubs for filter dropdown
    const clubs = await db.club.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      memberships,
      stats: formattedStats,
      clubs
    })

  } catch (error) {
    console.error('Error fetching admin memberships:', error)
    return NextResponse.json(
      { error: 'Failed to fetch memberships' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    console.log('PATCH /api/admin/memberships called')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session ? { role: session.user.role, email: session.user.email } : 'No session')
    
    if (!session || session.user.role !== 'ADMIN') {
      console.log('Unauthorized access attempt')
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Request body:', body)
    const { membershipId, action } = body

    if (!membershipId || !action) {
      return NextResponse.json(
        { error: 'Membership ID and action are required' },
        { status: 400 }
      )
    }

    // Validate action
    if (!['approve', 'reject', 'remove'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be approve, reject, or remove' },
        { status: 400 }
      )
    }

    // Get the membership
    console.log('Looking for membership with ID:', membershipId)
    const membership = await db.membership.findUnique({
      where: { id: membershipId },
      include: {
        user: true,
        club: true
      }
    })
    console.log('Found membership:', membership ? { id: membership.id, status: membership.status } : 'Not found')

    if (!membership) {
      console.log('Membership not found')
      return NextResponse.json(
        { error: 'Membership not found' },
        { status: 404 }
      )
    }

    let updatedMembership

    if (action === 'remove') {
      // Delete the membership
      await db.membership.delete({
        where: { id: membershipId }
      })
      
      return NextResponse.json({
        message: 'Membership removed successfully'
      })
    } else {
      // Update membership status
      const newStatus = action === 'approve' ? 'ACCEPTED' : 'REJECTED'
      
      updatedMembership = await db.membership.update({
        where: { id: membershipId },
        data: {
          status: newStatus,
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
              department: true
            }
          },
          club: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      // Create notification
      await db.notification.create({
        data: {
          type: 'MEMBERSHIP_UPDATE',
          title: `Membership ${action === 'approve' ? 'Approved' : 'Rejected'}`,
          message: `Your membership application to ${membership.club.name} has been ${action === 'approve' ? 'approved' : 'rejected'} by admin.`,
          recipients: membership.userId, // Store the single user ID
        }
      })
    }

    return NextResponse.json({
      message: `Membership ${action}d successfully`,
      membership: updatedMembership
    })

  } catch (error) {
    console.error('Error updating membership:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return NextResponse.json(
      { error: 'Failed to update membership', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
