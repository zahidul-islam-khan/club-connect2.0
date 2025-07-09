const { PrismaClient } = require('@prisma/client')

async function debugUserIssue() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Debugging user authentication issue...')
    
    // Check if we have users in the database
    const totalUsers = await prisma.user.count()
    console.log(`📊 Total users in database: ${totalUsers}`)
    
    // Check demo users
    const demoUsers = await prisma.user.findMany({
      where: {
        email: {
          in: ['admin@bracu.ac.bd', 'leader@bracu.ac.bd', 'student@bracu.ac.bd']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    
    console.log('\n👥 Demo users:')
    demoUsers.forEach(user => {
      console.log(`- ${user.email}: ID=${user.id}, Role=${user.role}`)
    })
    
    // Check memberships
    const memberships = await prisma.membership.findMany({
      select: {
        id: true,
        status: true,
        userId: true,
        clubId: true,
        user: {
          select: { email: true }
        },
        club: {
          select: { name: true }
        }
      }
    })
    
    console.log(`\n🔗 Total memberships: ${memberships.length}`)
    memberships.forEach(membership => {
      console.log(`- ${membership.user.email} -> ${membership.club.name} (${membership.status})`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugUserIssue()
