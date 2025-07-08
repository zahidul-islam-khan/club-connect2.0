import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema for validating club update data
const updateClubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  description: z.string().transform(val => val === '' ? null : val).nullable().optional(),
  department: z.string().min(1, 'Department is required'),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
  vision: z.string().transform(val => val === '' ? null : val).nullable().optional(),
  mission: z.string().transform(val => val === '' ? null : val).nullable().optional()
})

// PUT - Update club
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Received body:', body)

    const validatedData = updateClubSchema.parse(body)

    const existingClub = await db.club.findUnique({
      where: { id }
    })

    if (!existingClub) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    const updatedClub = await db.club.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        department: validatedData.department,
        status: validatedData.status,
        foundedYear: validatedData.foundedYear,
        vision: validatedData.vision,
        mission: validatedData.mission,
        updatedAt: new Date()
      },
      include: {
        leader: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            memberships: {
              where: {
                status: 'ACCEPTED'
              }
            },
            events: true
          }
        }
      }
    })

    const formattedClub = {
      id: updatedClub.id,
      name: updatedClub.name,
      description: updatedClub.description,
      department: updatedClub.department,
      status: updatedClub.status,
      foundedYear: updatedClub.foundedYear,
      vision: updatedClub.vision,
      mission: updatedClub.mission,
      memberCount: updatedClub._count.memberships,
      eventCount: updatedClub._count.events,
      leader: updatedClub.leader || { name: 'No Leader', email: '' }
    }

    return NextResponse.json(formattedClub)
  } catch (error) {
    console.error('Error updating club:', error)

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

// DELETE - Delete club
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const existingClub = await db.club.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            memberships: true,
            events: true
          }
        }
      }
    })

    if (!existingClub) {
      return NextResponse.json(
        { error: 'Club not found' },
        { status: 404 }
      )
    }

    if (existingClub._count.memberships > 0 || existingClub._count.events > 0) {
      return NextResponse.json(
        {
          error: 'Cannot delete club with existing memberships or events. Please remove all memberships and events first.'
        },
        { status: 400 }
      )
    }

    await db.club.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Club deleted successfully' })
  } catch (error) {
    console.error('Error deleting club:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

