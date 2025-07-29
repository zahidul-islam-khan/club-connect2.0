const { PrismaClient } = require('@prisma/client');

async function debugClubMembers(clubId) {
  const prisma = new PrismaClient();
  try {
    if (!clubId) {
      console.error('Please provide a clubId as an argument.');
      process.exit(1);
    }
    const club = await prisma.club.findUnique({ where: { id: clubId } });
    if (!club) {
      console.error('No club found with id:', clubId);
      process.exit(1);
    }
    console.log(`\n🔎 Club: ${club.name} (ID: ${club.id})`);
    const memberships = await prisma.membership.findMany({
      where: { clubId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (memberships.length === 0) {
      console.log('No memberships found for this club.');
    } else {
      memberships.forEach(m => {
        console.log(`- ${m.user.name || ''} <${m.user.email}> | Status: ${m.status} | UserId: ${m.userId}`);
      });
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

const clubId = process.argv[2];
debugClubMembers(clubId);
