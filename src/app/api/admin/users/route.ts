import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import type { UserRole } from '@/types';

// Only allow admins
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      studentId: true,
    },
    orderBy: { name: 'asc' },
  });
  // Ensure role is typed as UserRole
  return NextResponse.json(users.map(u => ({ ...u, role: u.role as UserRole })));
}
