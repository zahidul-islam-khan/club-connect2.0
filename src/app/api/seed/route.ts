import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A list of official BRAC University clubs with all required fields
const bracuClubs = [
  { name: 'BRAC University Art and Photography Society', category: 'Arts & Culture', department: 'All', description: 'A hub for creative minds to express themselves through various art forms and photography.', status: 'ACTIVE', vision: 'To be a leading platform for artistic expression.', mission: 'To foster creativity and collaboration.', activities: 'Workshops, Exhibitions, Photo-walks' },
  { name: 'BRAC University Film Club', category: 'Arts & Culture', department: 'All', description: 'Dedicated to the appreciation and creation of films, hosting screenings, workshops, and competitions.', status: 'ACTIVE', vision: 'To cultivate a vibrant film culture.', mission: 'To educate and inspire filmmakers.', activities: 'Screenings, Workshops, Film Festivals' },
  { name: 'BRAC University Cultural Club', category: 'Arts & Culture', department: 'All', description: 'Promotes and preserves the rich cultural heritage of Bangladesh through various events and performances.', status: 'ACTIVE', vision: 'To be the cultural heart of the university.', mission: 'To celebrate diversity through cultural expression.', activities: 'Cultural Shows, Music Festivals, Dance Workshops' },
  { name: 'BRAC University Debating Club', category: 'Public Speaking', department: 'All', description: 'A platform for students to hone their debating and public speaking skills.', status: 'ACTIVE', vision: 'To develop world-class debaters.', mission: 'To promote critical thinking and articulate expression.', activities: 'Debate Competitions, Workshops, Public Speaking Sessions' },
  { name: 'BRAC University Business and Economics Forum', category: 'Academic', department: 'BBS', description: 'Fosters discussion and learning on business, economics, and entrepreneurship.', status: 'ACTIVE', vision: 'To bridge the gap between academia and industry.', mission: 'To empower future business leaders.', activities: 'Seminars, Case Competitions, Industry Talks' },
  { name: 'AIESEC in BRAC University', category: 'Leadership', department: 'All', description: 'A global platform for young people to explore and develop their leadership potential.', status: 'ACTIVE', vision: 'To achieve peace and fulfillment of humankind\'s potential.', mission: 'To provide leadership development opportunities.', activities: 'Internships, Volunteering, Leadership Conferences' },
  { name: 'BRAC University Computer Club (BUCC)', category: 'Academic', department: 'CSE', description: 'A community for tech enthusiasts to learn, innovate, and collaborate on computing projects.', status: 'ACTIVE', vision: 'To be a center of technological innovation.', mission: 'To foster a passion for computing.', activities: 'Hackathons, Workshops, Tech Talks' },
  { name: 'BRAC University Pharma Society', category: 'Academic', department: 'Pharmacy', description: 'Engages students in pharmaceutical sciences through seminars, workshops, and industry visits.', status: 'ACTIVE', vision: 'To advance pharmaceutical knowledge.', mission: 'To connect students with the pharma industry.', activities: 'Seminars, Pharmacy Fairs, Industry Visits' },
  { name: 'BRAC University Law Society', category: 'Academic', department: 'Law', description: 'Promotes legal education and awareness through moot courts, seminars, and legal aid clinics.', status: 'ACTIVE', vision: 'To uphold the principles of justice and law.', mission: 'To provide practical legal training.', activities: 'Moot Courts, Seminars, Legal Aid' },
  { name: 'IEEE BRAC University Student Branch', category: 'Academic', department: 'EEE', description: 'A branch of the global IEEE organization, focusing on advancing technology for humanity.', status: 'ACTIVE', vision: 'To be a leading student branch of IEEE.', mission: 'To promote technical knowledge and professional development.', activities: 'Tech Fests, Workshops, Seminars' },
  { name: 'BRAC University Entrepreneurship Development Forum', category: 'Business', department: 'BBS', description: 'Inspires and supports student entrepreneurs through mentorship, workshops, and networking events.', status: 'ACTIVE', vision: 'To create a thriving entrepreneurial ecosystem.', mission: 'To nurture the next generation of entrepreneurs.', activities: 'Business Plan Competitions, Startup Talks, Mentorship Programs' },
  { name: 'BRAC University Global Affairs Forum', category: 'Social & Global', department: 'All', description: 'A forum for discussing international relations, diplomacy, and global issues.', status: 'ACTIVE', vision: 'To foster global citizenship.', mission: 'To promote understanding of international affairs.', activities: 'Model UN, Policy Debates, Ambassador Talks' },
  { name: 'BRAC University Adventure Club', category: 'Sports & Recreation', department: 'All', description: 'Organizes adventurous and recreational activities like hiking, trekking, and cycling.', status: 'ACTIVE', vision: 'To promote a spirit of adventure.', mission: 'To explore the great outdoors.', activities: 'Hiking, Camping, Cycling Tours' },
  { name: 'BRAC University Indoor Games Club', category: 'Sports & Recreation', department: 'All', description: 'Promotes indoor sports and games, organizing tournaments and practice sessions.', status: 'ACTIVE', vision: 'To be the hub for indoor sports enthusiasts.', mission: 'To encourage sportsmanship and healthy competition.', activities: 'Chess Tournaments, Table Tennis, Carrom' },
  { name: 'BRAC University Community Service Club', category: 'Social & Global', department: 'All', description: 'Dedicated to making a positive impact on society through various community service initiatives.', status: 'ACTIVE', vision: 'To build a compassionate and engaged community.', mission: 'To serve the underprivileged.', activities: 'Donation Drives, Awareness Campaigns, Volunteer Work' },
  { name: 'BRAC University Earth and Environment Forum', category: 'Social & Global', department: 'All', description: 'Raises awareness about environmental issues and promotes sustainable practices.', status: 'ACTIVE', vision: 'To create a sustainable future.', mission: 'To protect and preserve our planet.', activities: 'Tree Plantation, Clean-up Drives, Seminars' },
  { name: 'BRAC University International Association', category: 'Social & Global', department: 'All', description: 'A platform for international students and for promoting cultural exchange.', status: 'ACTIVE', vision: 'To foster a global community.', mission: 'To celebrate cultural diversity.', activities: 'Cultural Nights, Food Festivals, Language Exchange' },
  { name: 'BRAC University Robotics Club', category: 'Technology', department: 'CSE/EEE', description: 'A place for students to design, build, and program robots for competitions and projects.', status: 'ACTIVE', vision: 'To be at the forefront of robotics.', mission: 'To inspire innovation in robotics.', activities: 'Robotics Competitions, Workshops, Project Showcases' },
  { name: 'BRAC University Natural Sciences Club', category: 'Academic', department: 'MNS', description: 'Fosters interest in the natural sciences through talks, field trips, and experiments.', status: 'ACTIVE', vision: 'To explore the wonders of science.', mission: 'To promote scientific inquiry.', activities: 'Science Fairs, Field Trips, Lab Visits' },
  { name: 'BRAC University English Literary Club', category: 'Arts & Culture', department: 'ENH', description: 'A society for lovers of English literature to discuss books, poetry, and creative writing.', status: 'ACTIVE', vision: 'To celebrate the power of literature.', mission: 'To foster a love for reading and writing.', activities: 'Book Clubs, Poetry Slams, Creative Writing Workshops' }
];


export async function GET() {
  try {
    console.log('🌱 Starting to seed database...');

    // 1. Create or find a placeholder club leader
    const leader = await prisma.user.upsert({
      where: { email: 'club-admin@bracu.ac.bd' },
      update: {},
      create: {
        email: 'club-admin@bracu.ac.bd',
        name: 'Club Administrator',
        role: 'CLUB_LEADER', // Use string literal
      },
    });
    console.log(`👤 Found or created club leader: ${leader.name} (${leader.id})`);

    // 2. Add leaderId to all clubs
    const clubsWithLeader = bracuClubs.map(club => ({
      ...club,
      leaderId: leader.id,
    }));

    // Using a transaction to ensure all or nothing gets written
    await prisma.$transaction(async (tx) => {
      // Clear existing club data to avoid duplicates
      await tx.club.deleteMany({});
      console.log('🗑️ Cleared existing club data.');

      // Create new club records
      await tx.club.createMany({
        data: clubsWithLeader,
        // skipDuplicates is not supported on PostgreSQL
      });
    });

    console.log('✅ Successfully seeded database with BRAC University Clubs.');
    return NextResponse.json({ message: 'Seeding successful!' });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('❌ Error seeding database:', errorMessage);
    return NextResponse.json({ message: 'Seeding failed.', error: errorMessage }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
