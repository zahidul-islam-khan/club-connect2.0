import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { sendNotificationEmail } from '@/lib/email';

const NotifySchema = z.object({
  title: z.string().min(3),
  message: z.string().min(3),
  recipients: z.enum(['ALL_USERS', 'CLUB_LEADERS', 'ALL']),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const parse = NotifySchema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  const { title, message, recipients } = parse.data;

  // Determine recipient emails
  let users = [];
  if (recipients === 'ALL_USERS') {
    users = await db.user.findMany({ where: { }, select: { email: true } });
  } else if (recipients === 'CLUB_LEADERS') {
    users = await db.user.findMany({ where: { role: 'CLUB_LEADER' }, select: { email: true } });
  } else {
    users = await db.user.findMany({ select: { email: true } });
  }
  const emails = users.map(u => u.email).filter(Boolean);

  // Store notification
  await db.notification.create({
    data: {
      title,
      message,
      type: recipients,
      recipients: recipients,
    },
  });

  // Send emails (async, don't block response)
  sendNotificationEmail(emails, title, message).catch(() => {});

  return NextResponse.json({ success: true, count: emails.length });
}
