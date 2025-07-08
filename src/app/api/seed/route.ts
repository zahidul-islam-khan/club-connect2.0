import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Full list of BRAC University clubs
const bracuClubs = [
    { name: "Aeronautics and Space Exploration Club (BASEC)", department: "Aerospace" },
    { name: "Art and Photography Society (BUAPS)", department: "Arts" },
    { name: "BRAC University Adventure Club (BUAC)", department: "Adventure" },
    { name: "BRAC University Business and Economics Forum (BUBEF)", department: "Business & Economics" },
    { name: "BRAC University Chess Club (BUCHC)", department: "Sports" },
    { name: "BRAC University Communication and Language Club (BUCLC)", department: "Language & Communication" },
    { name: "BRAC University Computer Club (BUCC)", department: "Technology" },
    { name: "BRAC University Cultural Club (BUCuC)", department: "Cultural" },
    { name: "BRAC University Debating Club (BUDC)", department: "Debate" },
    { name: "BRAC University Drama and Theatre Forum (BUDTF)", department: "Performing Arts" },
    { name: "BRAC University Entrepreneurship Development Forum (BUEDF)", department: "Entrepreneurship" },
    { name: "BRAC University Film Club (BUFC)", department: "Film" },
    { name: "BRAC University Finance Society (BUFS)", department: "Finance" },
    { name: "BRAC University Global Affairs Forum (BUGAF)", department: "Global Affairs" },
    { name: "BRAC University Heritage Forum (BUHF)", department: "Heritage" },
    { name: "BRAC University Hoovez (Dance Club)", department: "Performing Arts" },
    { name: "BRAC University International Association of Business Communicators (IABC)", department: "Business Communication" },
    { name: "BRAC University Law Society (BULS)", department: "Law" },
    { name: "BRAC University Medical Club (BUMC)", department: "Health" },
    { name: "BRAC University Mongol Tori (Robotics Club)", department: "Technology" },
    { name: "BRAC University Moot Court Society (BUMCS)", department: "Law" },
    { name: "BRAC University Natural Sciences Club (BUNSC)", department: "Science" },
    { name: "BRAC University Pharma Society (BUPS)", department: "Pharmacy" },
    { name: "BRAC University Social Development Forum (BUSDF)", department: "Social Development" },
    { name: "BRAC University Community Service Club (BUCSC)", department: "Community Service" },
    { name: "BRAC University Cricket Club", department: "Sports" },
    { name: "BRAC University Football Club", department: "Sports" },
    { name: "BRAC University Indoor Games Club", department: "Sports" },
    { name: "BRAC University Investment Club", department: "Finance" },
    { name: "BRAC University Marketing Association (BUMA)", department: "Marketing" },
    { name: "BRAC University Media and Journalism Forum", department: "Media" },
    { name: "BRAC University Mons Pervius Club (Mountaineering)", department: "Adventure" },
    { name: "BRAC University Music Club", department: "Music" },
    { name: "BRAC University Reading Society", department: "Literature" },
    { name: "BRAC University Robotics Club", department: "Technology" },
    { name: "BRAC University Students Against Violence Everywhere (SAVE)", department: "Social Awareness" },
    { name: "BRAC University Tourism Club", department: "Tourism" },
    { name: "BRAC University Yoga and Wellness Club", department: "Wellness" },
    { name: "First Aid Society of BRAC University (FASBU)", department: "Health" },
    { name: "Her Campus at BRAC University", department: "Media" },
    { name: "IEEE BRAC University Student Branch", department: "Engineering" },
    { name: "Monon", department: "Mental Health" },
    { name: "Negotiation Club of BRAC University", department: "Negotiation" },
    { name: "Network of Women in Business (NOWB)", department: "Business" },
    { name: "Passport (International Student Association)", department: "International Students" },
    { name: "Platform for Law and Human Rights", department: "Law & Human Rights" },
    { name: "RS-VIVE", department: "Social Awareness" },
    { name: "Society for Promotion of Bangladesh Art and Culture (SPBAC)", department: "Art & Culture" },
    { name: "Teach It", department: "Education" },
    { name: "The Storytellers", department: "Literature" },
    { name: "BRAC University Quantum Computing Club (BUQCC)", department: "Technology" },
    { name: "BRAC University Ethics and Integrity Club (BUEIC)", department: "Ethics" }
];

export async function GET() {
  try {
    console.log("Starting database seeding process...");

    const firstUser = await db.user.findFirst();

    if (!firstUser) {
      return NextResponse.json(
        { error: "Cannot seed clubs. No users found in the database to assign as a leader. Please create a user first." },
        { status: 400 }
      );
    }
    
    console.log(`Found user ${firstUser.email} to assign as a default club leader.`);

    const clubsToCreate = bracuClubs.map(club => ({
      name: club.name,
      description: `Official club for ${club.name}. Department: ${club.department || 'General'}.`,
      department: club.department || 'General',
      status: "ACTIVE", // Use string literal directly
      leaderId: firstUser.id,
    }));

    // Delete existing clubs to ensure a clean slate and prevent duplicates
    await db.club.deleteMany({});
    console.log("Cleared existing clubs from the database.");

    await db.club.createMany({
      data: clubsToCreate,
    });

    const finalClubCount = await db.club.count();
    console.log(`Seeding complete. Total clubs in database: ${finalClubCount}`);

    return NextResponse.json({
      message: "Database seeded successfully!",
      clubCount: finalClubCount,
    });

  } catch (error) {
    console.error("Error during database seeding:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to seed database.", details: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "An unknown error occurred during seeding." }, { status: 500 });
  }
}
