'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Users, Calendar, Shield } from 'lucide-react'

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
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-5xl font-bold mb-4 text-center">
              Welcome back, {session.user.name || 'User'}!
            </h1>
            <p className="py-6 text-lg text-gray-600 text-center">
              Ready to explore Club Connect and manage your university clubs?
            </p>
            <div className="flex justify-center">
              <Link href={getDashboardLink()}>
                <Button size="lg" className="text-lg px-8 py-3">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-6 text-center">Welcome to Club Connect</h1>
          <p className="py-6 text-lg text-gray-600 max-w-2xl mx-auto text-center">
            The comprehensive club management system for BRAC University. 
            Join clubs, manage events, and build your university community with ease!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/auth/signin">
              <Button size="lg" className="text-lg px-8 py-3">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            <div className="card bg-white shadow-xl">
              <div className="card-body items-center text-center p-6">
                <Users className="h-12 w-12 text-blue-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Join Clubs</h2>
                <p className="text-gray-600 text-center">Discover and join university clubs that match your interests</p>
              </div>
            </div>
            
            <div className="card bg-white shadow-xl">
              <div className="card-body items-center text-center p-6">
                <Calendar className="h-12 w-12 text-purple-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Manage Events</h2>
                <p className="text-gray-600 text-center">Create, organize and participate in exciting club events</p>
              </div>
            </div>
            
            <div className="card bg-white shadow-xl">
              <div className="card-body items-center text-center p-6">
                <Shield className="h-12 w-12 text-orange-600 mb-4" />
                <h2 className="text-xl font-bold mb-2">Admin Control</h2>
                <p className="text-gray-600 text-center">Comprehensive oversight and management for university staff</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
