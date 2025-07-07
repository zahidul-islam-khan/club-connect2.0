'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Search, 
  Check, 
  X, 
  Clock, 
  Mail, 
  GraduationCap,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'

interface PendingMembership {
  id: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    studentId: string
    department: string
    semester: string
  }
  club: {
    id: string
    name: string
    department: string
  }
}

export default function ClubLeaderMembershipsPage() {
  const { data: session } = useSession()
  const [memberships, setMemberships] = useState<PendingMembership[]>([])
  const [filteredMemberships, setFilteredMemberships] = useState<PendingMembership[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedMemberships, setSelectedMemberships] = useState<Set<string>>(new Set())
  const [processing, setProcessing] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null)

  useEffect(() => {
    const fetchPendingMemberships = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/club-leader/memberships')
        
        if (!response.ok) {
          throw new Error('Failed to fetch memberships')
        }
        
        const data = await response.json()
        setMemberships(data.memberships)
        setFilteredMemberships(data.memberships)
      } catch (error) {
        console.error('Error fetching memberships:', error)
        showNotification('error', 'Failed to load membership applications')
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPendingMemberships()
    }
  }, [session])

  useEffect(() => {
    let filtered = memberships

    if (searchTerm) {
      filtered = filtered.filter(membership =>
        membership.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membership.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membership.user.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        membership.club.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMemberships(filtered)
  }, [searchTerm, memberships])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSelectMembership = (membershipId: string) => {
    const newSelected = new Set(selectedMemberships)
    if (newSelected.has(membershipId)) {
      newSelected.delete(membershipId)
    } else {
      newSelected.add(membershipId)
    }
    setSelectedMemberships(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedMemberships.size === filteredMemberships.length) {
      setSelectedMemberships(new Set())
    } else {
      setSelectedMemberships(new Set(filteredMemberships.map(m => m.id)))
    }
  }

  const handleBulkAction = async (action: 'approve' | 'reject') => {
    if (selectedMemberships.size === 0) {
      showNotification('error', 'Please select at least one membership to process')
      return
    }

    setProcessing(true)
    try {
      const response = await fetch('/api/club-leader/memberships', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipIds: Array.from(selectedMemberships),
          action: action
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process memberships')
      }

      const result = await response.json()
      
      // Remove processed memberships from the list
      setMemberships(prev => 
        prev.filter(m => !selectedMemberships.has(m.id))
      )
      setSelectedMemberships(new Set())
      
      showNotification('success', result.message)
    } catch (error) {
      console.error('Error processing memberships:', error)
      showNotification('error', error instanceof Error ? error.message : 'Failed to process memberships')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading membership applications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Membership Applications</h1>
          <p className="mt-2 text-gray-600">
            Review and approve student applications to join your clubs
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-md flex items-center gap-2 ${
            notification.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {notification.message}
          </div>
        )}

        {/* Search and Bulk Actions */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, email, student ID, or club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSelectAll}
                disabled={filteredMemberships.length === 0}
              >
                {selectedMemberships.size === filteredMemberships.length ? 'Deselect All' : 'Select All'}
              </Button>
              
              <Button
                onClick={() => handleBulkAction('approve')}
                disabled={selectedMemberships.size === 0 || processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve ({selectedMemberships.size})
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleBulkAction('reject')}
                disabled={selectedMemberships.size === 0 || processing}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject ({selectedMemberships.size})
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                  <p className="text-2xl font-bold">{memberships.length}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Selected</p>
                  <p className="text-2xl font-bold">{selectedMemberships.size}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Clubs</p>
                  <p className="text-2xl font-bold">
                    {new Set(memberships.map(m => m.club.id)).size}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredMemberships.length})</CardTitle>
            <CardDescription>
              Students waiting for approval to join clubs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredMemberships.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {memberships.length === 0 ? 'No pending applications' : 'No applications match your search'}
                </h3>
                <p className="text-gray-600">
                  {memberships.length === 0 
                    ? 'All caught up! No students are waiting for approval at the moment.'
                    : 'Try adjusting your search terms to find specific applications.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMemberships.map((membership) => (
                  <div 
                    key={membership.id} 
                    className={`border rounded-lg p-6 transition-colors ${
                      selectedMemberships.has(membership.id) 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedMemberships.has(membership.id)}
                          onChange={() => handleSelectMembership(membership.id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold">{membership.user.name}</h3>
                            <Badge variant="outline" className="text-orange-600">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{membership.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span>{membership.user.studentId}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4" />
                              <span>{membership.user.department}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{membership.user.semester}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <span className="font-medium">Applying to:</span> {membership.club.name}
                                <Badge variant="secondary" className="ml-2">
                                  {membership.club.department}
                                </Badge>
                              </div>
                              <div className="text-gray-500">
                                Applied {formatDate(membership.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMemberships(new Set([membership.id]))
                            handleBulkAction('approve')
                          }}
                          disabled={processing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMemberships(new Set([membership.id]))
                            handleBulkAction('reject')
                          }}
                          disabled={processing}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
