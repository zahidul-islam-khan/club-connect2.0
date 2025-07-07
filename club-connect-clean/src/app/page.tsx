'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Shield, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const { data: session } = useSession()

  if (session) {
    // Redirect authenticated users to appropriate dashboard
    const getDashboardLink = () => {
      switch (session.user.role) {
        case 'ADMIN':
          return '/admin'
        case 'CLUB_LEADER':
          return '/dashboard'
        default:
          return '/dashboard'
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {session.user.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Ready to explore Club Connect?
            </p>
            <Link href={getDashboardLink()}>
              <Button size="lg" className="text-lg px-8 py-3">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Club Connect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The centralized platform for BRAC University clubs and societies. 
            Discover clubs, manage memberships, organize events, and build connections.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need to manage university clubs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Student Portal</CardTitle>
                <CardDescription>
                  Discover and join clubs that match your interests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• Browse active clubs and societies</li>
                  <li>• Apply for club membership</li>
                  <li>• RSVP to events</li>
                  <li>• Manage your profile</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Club Management</CardTitle>
                <CardDescription>
                  Powerful tools for club leaders and executives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• Manage club profile and information</li>
                  <li>• Handle membership applications</li>
                  <li>• Create and organize events</li>
                  <li>• Send notifications to members</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Admin Panel</CardTitle>
                <CardDescription>
                  Complete oversight for OCA administrators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li>• Oversee all users and clubs</li>
                  <li>• Approve club registrations</li>
                  <li>• Review event proposals</li>
                  <li>• Manage budget requests</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="py-16 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Active Clubs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600">Students Connected</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">200+</div>
              <div className="text-gray-600">Events Organized</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">Club Connect</span>
          </div>
          <p className="text-gray-400">
            BRAC University Office of Co-Curricular Activities
          </p>
        </div>
      </footer>
    </div>
  )
}
