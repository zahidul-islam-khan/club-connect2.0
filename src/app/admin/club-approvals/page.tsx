'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Search, Clock, MapPin } from 'lucide-react'

interface Club {
  id: string
  name: string
  description: string
  category: string
  department: string
  status: string
  memberCount: number
  leader?: {
    name: string
    email: string
  }
  createdAt: string
}

export default function ClubApprovalsPage() {
  const { data: session } = useSession()
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [processingClubId, setProcessingClubId] = useState<string | null>(null)

  useEffect(() => {
    const fetchPendingClubs = async () => {
      try {
        setLoading(true)
        // Since we don't have a status field for clubs yet, we'll show all clubs for now
        // In a real implementation, you'd filter by status: 'PENDING'
        const response = await fetch('/api/clubs')
        
        if (!response.ok) {
          throw new Error('Failed to fetch clubs')
        }
        
        const data = await response.json()
        // For now, let's simulate pending clubs by showing all clubs
        // In a real implementation, you'd filter by clubs.status === 'PENDING'
        const allClubs = data.clubs || []
        setClubs(allClubs)
        setFilteredClubs(allClubs)
      } catch (error) {
        console.error('Error fetching clubs:', error)
        setClubs([])
        setFilteredClubs([])
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPendingClubs()
    }
  }, [session])

  useEffect(() => {
    let filtered = clubs

    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredClubs(filtered)
  }, [searchTerm, clubs])

  const handleClubAction = async (clubId: string, action: 'approve' | 'reject') => {
    try {
      setProcessingClubId(clubId)
      
      // For now, we'll just simulate the approval process
      // In a real implementation, you'd make an API call to approve/reject the club
      console.log(`${action}ing club ${clubId}`)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove the processed club from the list
      setClubs(prevClubs => prevClubs.filter(club => club.id !== clubId))
      
      alert(`Club ${action}d successfully!`)
      
    } catch (error) {
      console.error(`Error ${action}ing club:`, error)
      alert(`Failed to ${action} club. Please try again.`)
    } finally {
      setProcessingClubId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending club applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Club Application Approvals</h1>
          <p className="mt-2 text-gray-600">
            Review and approve pending club registration applications
          </p>
        </div>

        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search pending club applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                    <p className="text-2xl font-bold">{clubs.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold">
                      {clubs.reduce((total, club) => total + (club.memberCount || 0), 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Search Results</p>
                    <p className="text-2xl font-bold">{filteredClubs.length}</p>
                  </div>
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notice */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <p className="text-blue-800">
                <strong>Note:</strong> This is a demonstration page. In the current system, all clubs are automatically approved. 
                To implement proper club approval workflows, you would need to add a 'status' field to the Club model in the database.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Clubs List */}
        <Card>
          <CardHeader>
            <CardTitle>Club Applications for Review</CardTitle>
            <CardDescription>
              Showing {filteredClubs.length} of {clubs.length} club applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClubs.slice(0, 5).map((club) => (
                <div key={club.id} className="border rounded-lg p-6 bg-orange-50 border-orange-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{club.name}</h3>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          PENDING REVIEW
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{club.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">Category:</span> {club.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium">Department:</span> {club.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">Members:</span> {club.memberCount || 0}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span> {new Date(club.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {club.leader && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-700">Proposed Leader:</p>
                          <p className="text-sm text-gray-600">{club.leader.name} ({club.leader.email})</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleClubAction(club.id, 'approve')}
                        disabled={processingClubId === club.id}
                      >
                        {processingClubId === club.id ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleClubAction(club.id, 'reject')}
                        disabled={processingClubId === club.id}
                      >
                        {processingClubId === club.id ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
            <p className="text-gray-600">
              {clubs.length === 0 
                ? "All club applications have been reviewed. Great job!"
                : "Try adjusting your search terms to find the applications you're looking for."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
