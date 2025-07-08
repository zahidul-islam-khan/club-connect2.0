import { db } from '@/lib/db'
import Link from 'next/link'

export default async function StatusPage() {
  // Get statistics
  const [clubs, users, events] = await Promise.all([
    db.club.count(),
    db.user.count(),
    db.event.count(),
  ])

  const pendingMemberships = await db.membership.count({
    where: { status: 'PENDING' }
  })

  const recentMemberships = await db.membership.findMany({
    where: { status: 'PENDING' },
    include: {
      user: { select: { name: true, studentId: true } },
      club: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Club Connect - System Status
          </h1>
          <p className="text-gray-600 mb-6">
            BRAC University Club Management System - Enhanced with Real-time Notifications & Email Integration
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  🏛️
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-blue-900">{clubs}</h3>
                  <p className="text-blue-600">Total Clubs</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  👥
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-900">{users}</h3>
                  <p className="text-green-600">Registered Users</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  ⏳
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-orange-900">{pendingMemberships}</h3>
                  <p className="text-orange-600">Pending Applications</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  🎉
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-purple-900">{events}</h3>
                  <p className="text-purple-600">Upcoming Events</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Implemented */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Features Implemented</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Real-time notification system for club leaders</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Email notifications for membership decisions</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Bulk membership approval/rejection</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>31 official BRACU clubs seeded</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Role-based dashboard (Student/Leader/Admin)</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Admin club management (edit/delete)</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Auto-refresh notifications every 30s</span>
                </div>
                <div className="flex items-center text-green-700">
                  <span className="mr-2">✅</span>
                  <span>Professional email templates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Pending Applications */}
          {recentMemberships.length > 0 && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Recent Membership Applications</h2>
              <div className="space-y-3">
                {recentMemberships.map((membership) => (
                  <div key={membership.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {membership.user.name || 'Unknown'} ({membership.user.studentId || 'No ID'})
                      </p>
                      <p className="text-sm text-gray-600">
                        Applied to join {membership.club.name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demo Accounts */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">🔑 Demo Accounts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Admin (OCA)</h3>
                <p className="text-sm text-gray-600 mb-2">Full system access</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  admin@bracu.ac.bd<br/>
                  admin123
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Club Leader</h3>
                <p className="text-sm text-gray-600 mb-2">Membership management</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  leader@bracu.ac.bd<br/>
                  leader123
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">Student</h3>
                <p className="text-sm text-gray-600 mb-2">Club discovery & join</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded">
                  student@bracu.ac.bd<br/>
                  student123
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-4 mt-8">
            <Link 
              href="/" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🏠 Go to Dashboard
            </Link>
            <Link 
              href="/clubs" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              🏛️ Browse Clubs
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔐 Sign In
            </Link>
            {pendingMemberships > 0 && (
              <Link 
                href="/club-leader/memberships" 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                ⏳ Review Applications ({pendingMemberships})
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
