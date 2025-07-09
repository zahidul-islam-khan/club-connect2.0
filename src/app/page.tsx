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
      <div className="hero min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="hero-content text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h1 className="text-5xl font-bold mb-4">
              Welcome back, {session.user.name || 'User'}!
            </h1>
            <p className="py-6 text-lg text-gray-600">
              Ready to explore Club Connect and manage your university clubs?
            </p>
            <Link href={getDashboardLink()}>
              <Button size="lg" className="btn btn-primary text-lg">
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="hero-content text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-5xl font-bold mb-6">Welcome to Club Connect</h1>
          <p className="py-6 text-lg text-gray-600 max-w-2xl mx-auto">
            The comprehensive club management system for BRAC University. 
            Join clubs, manage events, and build your university community with ease!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/auth/signin">
              <Button size="lg" className="btn btn-primary text-lg">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="btn btn-outline text-lg">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
          >
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h2 className="card-title">Join Clubs</h2>
                <p>Discover and join university clubs that match your interests</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <Calendar className="h-12 w-12 text-secondary mb-4" />
                <h2 className="card-title">Manage Events</h2>
                <p>Create, organize and participate in exciting club events</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <Shield className="h-12 w-12 text-accent mb-4" />
                <h2 className="card-title">Admin Control</h2>
                <p>Comprehensive oversight and management for university staff</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
