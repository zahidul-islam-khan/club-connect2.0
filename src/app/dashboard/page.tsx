'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Calendar, Users, Clock, MapPin, Plus } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  user: {
    name: string
    email: string
    studentId: string | null
    department: string | null
    role: string
  }
  stats: {
    clubsJoined: number
    eventsAttending: number
    pendingApplications: number
    totalClubs?: number
    totalUsers?: number
    pendingClubApprovals?: number
    pendingMemberships?: number
  }
  recentEvents: Array<{
    id: string
    title: string
    venue: string
    startDate: string
    clubName: string
  }>
  myClubs: Array<{
    id: string
    name: string
    description: string
    memberCount: number
    role: string
  }>
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.email) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Fetching dashboard data...')
        const response = await fetch('/api/dashboard')
        console.log('📡 Dashboard API response:', response.status, response.statusText)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Dashboard data received:', data)
          setDashboardData(data)
        } else {
          const errorData = await response.text()
          console.error('❌ Failed to fetch dashboard data:', response.status, errorData)
        }
      } catch (error) {
        console.error('💥 Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

  if (!session?.user) {
    return (
      <div className="bracu-bg min-h-screen flex items-center justify-center">
        <div className="text-center relative z-10">
          <p className="text-gray-200">Please sign in to access your dashboard.</p>
          <Link href="/auth/signin" className="text-blue-300 hover:text-blue-200 mt-2 inline-block">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/images/bracu-campus.jpg')`,
          filter: 'blur(1px)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/images/bracu-campus.jpg')`,
          filter: 'blur(1px)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="text-center relative z-10">
          <p className="text-red-300 mb-4">Error loading dashboard data</p>
          <p className="text-gray-200 mb-4">Session: {session?.user?.email}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  // Render different dashboards based on user role
  if (dashboardData.user.role === 'ADMIN') {
    return <AdminDashboard dashboardData={dashboardData} />
  } else if (dashboardData.user.role === 'CLUB_LEADER') {
    return <ClubLeaderDashboard dashboardData={dashboardData} />
  } else {
    return <StudentDashboard dashboardData={dashboardData} />
  }
}

function AdminDashboard({ dashboardData }: { dashboardData: DashboardData }) {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/images/bracu-campus.jpg')`,
          filter: 'blur(1px)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            OCA Admin Dashboard
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Welcome back, {dashboardData.user.name} • Office of Co-Curricular Activities
          </p>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalClubs || 31}</div>
              <p className="text-xs text-muted-foreground">Active clubs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalUsers || 150}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.pendingClubApprovals || 5}</div>
              <p className="text-xs text-muted-foreground">Club applications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Scheduled events</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Club Management</CardTitle>
              <CardDescription>Manage all university clubs and their activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/admin/clubs">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage All Clubs
                  </Button>
                </Link>
                <Link href="/admin/club-approvals">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Club Applications
                  </Button>
                </Link>
                <Link href="/admin/memberships">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Membership Oversight
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Oversee all club events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/admin/events">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    All Events
                  </Button>
                </Link>
                <Link href="/admin/event-approvals">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2" />
                    Event Approvals
                  </Button>
                </Link>
                <Link href="/admin/budget">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Budget Management
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">New club application</h3>
                    <p className="text-xs text-gray-600">Photography Club submitted registration</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Event approved</h3>
                    <p className="text-xs text-gray-600">Computer Club&apos;s Programming Contest</p>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">Budget request</h3>
                    <p className="text-xs text-gray-600">Robotics Club requested ৳50,000</p>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClubLeaderDashboard({ dashboardData }: { dashboardData: DashboardData }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Club Leader Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {dashboardData.user.name}
            {dashboardData.user.studentId && ` • Student ID: ${dashboardData.user.studentId}`}
            {dashboardData.user.department && ` • ${dashboardData.user.department}`}
          </p>
        </div>

        {/* Club Leader Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Clubs</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.myClubs.length}</div>
              <p className="text-xs text-muted-foreground">Clubs you lead</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboardData.stats?.pendingMemberships || 3}
              </div>
              <p className="text-xs text-muted-foreground">Waiting for approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Created</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.myClubs.reduce((total, club) => total + club.memberCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Across all clubs</p>
            </CardContent>
          </Card>
        </div>

        {/* Rest of club leader dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pending Membership Applications - Priority Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Pending Membership Applications
                  </CardTitle>
                  <CardDescription>Students waiting for approval to join your clubs</CardDescription>
                </div>
                <Link href="/club-leader/memberships">
                  <Button size="sm">
                    View All ({dashboardData.stats?.pendingMemberships || 3})
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Sample pending applications - replace with real data */}
                <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Sarah Ahmed</h4>
                      <p className="text-xs text-gray-600">Wants to join Computer Programming Club</p>
                      <p className="text-xs text-gray-500 mt-1">Applied 2 hours ago • Student ID: 21101234</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm">Md. Rahman</h4>
                      <p className="text-xs text-gray-600">Wants to join Robotics Club</p>
                      <p className="text-xs text-gray-500 mt-1">Applied 5 hours ago • Student ID: 21101567</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
                
                {(dashboardData.stats?.pendingMemberships || 3) > 2 && (
                  <div className="text-center py-4">
                    <Link href="/club-leader/memberships">
                      <Button variant="outline" size="sm">
                        View {(dashboardData.stats?.pendingMemberships || 3) - 2} more applications
                      </Button>
                    </Link>
                  </div>
                )}
                
                {(dashboardData.stats?.pendingMemberships || 3) === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No pending membership applications</p>
                    <p className="text-xs">All caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions for Club Leaders */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your clubs and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/club-leader/memberships">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="h-4 w-4 mr-2 text-orange-600" />
                    Review Applications
                    {(dashboardData.stats?.pendingMemberships || 3) > 0 && (
                      <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                        {dashboardData.stats?.pendingMemberships || 3}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/club-leader/events/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Event
                  </Button>
                </Link>
                <Link href="/club-leader/members">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Members
                  </Button>
                </Link>
                <Link href="/club-leader/budget">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Budget Requests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Clubs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Clubs as Leader */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Clubs</CardTitle>
                  <CardDescription>Clubs you&apos;re leading</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.myClubs.map((club) => (
                  <div key={club.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{club.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{club.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {club.memberCount} members
                          </span>
                          <span className="text-blue-600 font-medium">{club.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Your latest club activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm">Programming Workshop</h4>
                  <p className="text-xs text-gray-600">Computer Club • Tomorrow at 2:00 PM</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm">Robot Building Session</h4>
                  <p className="text-xs text-gray-600">Robotics Club • Friday at 10:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StudentDashboard({ dashboardData }: { dashboardData: DashboardData }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {dashboardData.user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            {dashboardData.user.studentId && `Student ID: ${dashboardData.user.studentId}`}
            {dashboardData.user.department && ` • ${dashboardData.user.department}`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clubs Joined</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.clubsJoined}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Attending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.eventsAttending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.pendingApplications}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Clubs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Clubs</CardTitle>
                  <CardDescription>Clubs you&apos;re currently a member of</CardDescription>
                </div>
                <Link href="/clubs">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Discover More
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.myClubs.map((club) => (
                  <div key={club.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{club.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{club.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {club.memberCount} members
                          </span>
                          <span className="text-blue-600 font-medium">{club.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events you&apos;ve RSVP&apos;d to</CardDescription>
                </div>
                <Link href="/events">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-sm">{event.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">by {event.clubName}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to do</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/clubs">
                  <Button variant="outline" className="w-full justify-start">
                    <Building2 className="h-4 w-4 mr-2" />
                    Explore Clubs
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
