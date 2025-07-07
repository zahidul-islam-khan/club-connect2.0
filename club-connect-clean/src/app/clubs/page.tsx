'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Globe, Mail, Search, Calendar, UserPlus, CheckCircle, Filter, Phone } from 'lucide-react'

interface Club {
  id: string
  name: string
  description: string
  department: string
  foundedYear: number
  memberCount: number
  eventCount: number
  activities: string[]
  email: string
  website?: string
  membershipStatus?: string | null
  leader: {
    name: string
    email: string
  }
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [joiningClub, setJoiningClub] = useState<string | null>(null)

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/clubs')
        
        if (!response.ok) {
          throw new Error('Failed to fetch clubs')
        }
        
        const data = await response.json()
        setClubs(data.clubs)
        setFilteredClubs(data.clubs)
      } catch (error) {
        console.error('Error fetching clubs:', error)
        // You could set an error state here if needed
      } finally {
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  useEffect(() => {
    let filtered = clubs

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.activities.some(activity => 
          activity.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(club => club.department === selectedCategory)
    }

    // Filter by department (for backwards compatibility)
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(club => club.department === selectedDepartment)
    }

    setFilteredClubs(filtered)
  }, [searchTerm, selectedDepartment, selectedCategory, clubs])

  const departments = ['All', ...Array.from(new Set(clubs.map(club => club.department)))]

  const handleJoinClub = async (clubId: string) => {
    try {
      setJoiningClub(clubId)
      const response = await fetch('/api/memberships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          clubId,
          action: 'join' 
        }),
      })

      if (response.ok) {
        // Update the club's membership status locally
        setClubs(prevClubs =>
          prevClubs.map(club =>
            club.id === clubId
              ? { ...club, membershipStatus: 'PENDING' }
              : club
          )
        )
        setFilteredClubs(prevClubs =>
          prevClubs.map(club =>
            club.id === clubId
              ? { ...club, membershipStatus: 'PENDING' }
              : club
          )
        )
        alert('Application submitted successfully!')
      } else {
        const errorData = await response.json()
        console.error('Failed to join club:', errorData.error)
        alert(errorData.error || 'Failed to join club')
      }
    } catch (error) {
      console.error('Error joining club:', error)
      alert('An error occurred while trying to join the club')
    } finally {
      setJoiningClub(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Clubs</h1>
          <p className="mt-2 text-gray-600">
            Find and join clubs that match your interests and passions
          </p>
          {!loading && (
            <p className="mt-1 text-sm text-gray-500">
              Showing {filteredClubs.length} of {clubs.length} clubs
            </p>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clubs, activities, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
              >
                <option value="All">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Extra-Curricular">Extra-Curricular</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{club.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {club.department}
                      </Badge>
                    </div>
                  </div>
                  {club.membershipStatus && (
                    <Badge variant={club.membershipStatus === 'ACCEPTED' ? 'default' : 'secondary'}>
                      {club.membershipStatus === 'ACCEPTED' ? 'Joined' : 'Pending'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {club.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {club.memberCount} members
                  </span>
                  <span>Est. {club.foundedYear}</span>
                </div>

                {/* Activities */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-700 mb-2">Activities:</p>
                  <div className="flex flex-wrap gap-1">
                    {club.activities.slice(0, 3).map((activity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                    {club.activities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{club.activities.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{club.email}</span>
                  </div>
                  {club.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{club.website}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {club.membershipStatus ? (
                    <Button variant="outline" className="w-full" disabled>
                      {club.membershipStatus === 'ACCEPTED' ? 'Already Joined' : 'Application Pending'}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleJoinClub(club.id)}
                      disabled={joiningClub === club.id}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      {joiningClub === club.id ? 'Applying...' : 'Apply to Join'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find clubs that match your interests.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
