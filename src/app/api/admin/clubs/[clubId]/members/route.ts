import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/clubs/[clubId]/members
export async function GET(req: Request, context: { params: { clubId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await params as per Next.js 14+ API route requirements
  const { clubId } = context.params;
  if (!clubId) {
    return NextResponse.json({ error: 'Missing clubId' }, { status: 400 });
  }

  // Debug logging
  console.log('API /admin/clubs/[clubId]/members called with clubId:', clubId);

  // Fetch accepted members of the club
  const memberships = await db.membership.findMany({
    where: {
      clubId,
      status: 'ACCEPTED',
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const members = memberships.map((m) => m.user);
  console.log('Found members:', members);
  return NextResponse.json({ members });
}
