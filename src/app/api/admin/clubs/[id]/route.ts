import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateClubStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
});

// Using 'any' as a final workaround for a persistent Next.js build error.
export async function PUT(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    const body = await req.json();
    const { status } = updateClubStatusSchema.parse(body);

    const updatedClub = await db.club.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedClub);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating club status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Using 'any' as a final workaround for a persistent Next.js build error.
export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = params;

  try {
    await db.club.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Club deleted successfully' });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

