'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, Search, Edit, Trash2, Plus, X } from 'lucide-react'

interface Club {
  id: string
  name: string
  description: string
  department: string
  status: string
  foundedYear: number
  memberCount: number
  eventCount: number
  leader: {
    name: string
    email: string
  }
}

export default function AdminClubsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>([])
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    department: '',
    status: '',
    foundedYear: '',
    vision: '',
    mission: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not an admin
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

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
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchClubs()
    }
  }, [session])

  useEffect(() => {
    let filtered = clubs

    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.department.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredClubs(filtered)
  }, [searchTerm, clubs])

  const handleEditClub = (club: Club) => {
    setEditingClub(club)
    setEditForm({
      name: club.name,
      description: club.description || '',
      department: club.department,
      status: club.status || 'ACTIVE',
      foundedYear: club.foundedYear?.toString() || '',
      vision: '',
      mission: ''
    })
  }

  const handleCloseEdit = () => {
    setEditingClub(null)
    setEditForm({
      name: '',
      description: '',
      department: '',
      status: '',
      foundedYear: '',
      vision: '',
      mission: ''
    })
  }

  const handleUpdateClub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingClub) return

    setIsSubmitting(true)

    // Basic validation
    if (!editForm.name || !editForm.department || !editForm.status) {
        alert('Please fill in all required fields.')
        setIsSubmitting(false)
        return
    }

    try {
        const response = await fetch(`/api/admin/clubs/${editingClub.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...editForm,
                foundedYear: editForm.foundedYear ? parseInt(editForm.foundedYear, 10) : null
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to update club')
        }

        const updatedClub = await response.json()

        setClubs(prevClubs =>
            prevClubs.map(c => (c.id === updatedClub.id ? { ...c, ...updatedClub } : c))
        )
        setEditingClub(null)
    } catch (error) {
        console.error('Error updating club:', error)
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
        setIsSubmitting(false)
    }
}

  const handleDeleteClub = async (clubId: string, clubName: string) => {
    if (!window.confirm(`Are you sure you want to delete the club "${clubName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/clubs/${clubId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData: { error: string } = await response.json()
        throw new Error(errorData.error || 'Failed to delete club')
      }

      setClubs(prevClubs => prevClubs.filter(c => c.id !== clubId))
    } catch (error) {
      console.error('Error deleting club:', error)
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/images/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading clubs...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/images/background.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay for content readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Club Management</h1>
            <p className="mt-2 text-gray-200 drop-shadow">
              Manage all university clubs and their status
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Club
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clubs by name, description, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clubs</p>
                    <p className="text-2xl font-bold">{clubs.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clubs</p>
                    <p className="text-2xl font-bold">
                      {clubs.filter(club => club.status === 'ACTIVE').length}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold">
                      {clubs.reduce((total, club) => total + club.memberCount, 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">
                      {new Set(clubs.map(club => club.department)).size}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Clubs Table */}
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle>All Clubs</CardTitle>
            <CardDescription>
              Showing {filteredClubs.length} of {clubs.length} clubs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredClubs.map((club) => (
                <div key={club.id} className="border rounded-lg p-6 bg-white/80 backdrop-blur">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{club.name}</h3>
                        <Badge 
                          variant={club.status === 'ACTIVE' ? 'default' : 'secondary'}
                        >
                          {club.status}
                        </Badge>
                        <Badge variant="outline">
                          {club.department}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{club.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Leader:</span> {club.leader.name}
                        </div>
                        <div>
                          <span className="font-medium">Members:</span> {club.memberCount}
                        </div>
                        <div>
                          <span className="font-medium">Events:</span> {club.eventCount}
                        </div>
                        <div>
                          <span className="font-medium">Founded:</span> {club.foundedYear}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClub(club)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => handleDeleteClub(club.id, club.name)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12 bg-white/90 backdrop-blur rounded-lg">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clubs found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms to find the clubs you&apos;re looking for.
            </p>
          </div>
        )}

        {/* Edit Club Modal */}
        {editingClub && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleUpdateClub}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Edit Club</h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCloseEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Club Name</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter club name"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter club description"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-department">Department/Category</Label>
                        <select
                          id="edit-department"
                          value={editForm.department}
                          onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="">Select category</option>
                          <option value="Academic">Academic</option>
                          <option value="Extra-Curricular">Extra-Curricular</option>
                          <option value="Sports">Sports</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="edit-status">Status</Label>
                        <select
                          id="edit-status"
                          value={editForm.status}
                          onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        >
                          <option value="PENDING">Pending</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="SUSPENDED">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="edit-foundedYear">Founded Year</Label>
                      <Input
                        id="edit-foundedYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={editForm.foundedYear}
                        onChange={(e) => setEditForm(prev => ({ ...prev, foundedYear: e.target.value }))}
                        placeholder="Enter founded year"
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-vision">Vision</Label>
                      <textarea
                        id="edit-vision"
                        value={editForm.vision}
                        onChange={(e) => setEditForm(prev => ({ ...prev, vision: e.target.value }))}
                        placeholder="Enter club vision"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-mission">Mission</Label>
                      <textarea
                        id="edit-mission"
                        value={editForm.mission}
                        onChange={(e) => setEditForm(prev => ({ ...prev, mission: e.target.value }))}
                        placeholder="Enter club mission"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseEdit}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !editForm.name.trim() || !editForm.department}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
