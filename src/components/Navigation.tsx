'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import NotificationBell from './NotificationBell'
import { 
  Users, 
  Calendar, 
  Settings, 
  LogOut, 
  Home,
  Building2,
  Shield,
  Clock,
  User
} from 'lucide-react'

export default function Navigation() {
  const { data: session } = useSession()

  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/clubs', label: 'Discover Clubs', icon: Building2 },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const clubLeaderLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/club-leader/memberships', label: 'Applications', icon: Clock },
    { href: '/club-leader/events', label: 'Manage Events', icon: Calendar },
    { href: '/clubs', label: 'Discover Clubs', icon: Building2 },
    { href: '/events', label: 'All Events', icon: Calendar },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield },
    { href: '/admin/clubs', label: 'Clubs', icon: Building2 },
    { href: '/admin/events', label: 'Events', icon: Calendar },
    { href: '/admin/memberships', label: 'Memberships', icon: Users },
    { href: '/admin/budget', label: 'Budget Requests', icon: Settings },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  const getNavLinks = () => {
    if (!session) return []
    
    switch (session.user.role) {
      case 'STUDENT':
        return studentLinks
      case 'CLUB_LEADER':
        return clubLeaderLinks
      case 'ADMIN':
        return adminLinks
      default:
        return studentLinks
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Club Connect</span>
            </Link>
          </div>

          {session && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex space-x-4">
                {getNavLinks().map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
              </div>

              <div className="flex items-center space-x-2">
                <NotificationBell />
                <span className="text-sm text-gray-700">
                  {session.user.name || session.user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          )}

          {!session && (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
