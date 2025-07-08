'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react'

interface Club {
  id: string
  name: string
}

interface Event {
  id: string
  title: string
  description: string | null
  venue: string | null
  startDate: string
  endDate: string
  capacity: number | null
  status: string
  clubName: string
}

export default function ClubLeaderEventsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [clubs, setClubs] = useState<Club[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
    capacity: '',
    isPublic: true,
    requirements: '',
    clubId: ''
  })

  // Redirect if not a club leader
  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== 'CLUB_LEADER') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  // Fetch user's clubs
  useEffect(() => {
    async function fetchClubs() {
      try {
        // Get user details with their leading clubs
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          // The dashboard API should return user info with leading clubs
          if (data.user?.leadingClubs) {
            setClubs(data.user.leadingClubs)
            if (data.user.leadingClubs.length > 0) {
              setFormData(prev => ({ ...prev, clubId: data.user.leadingClubs[0].id }))
            }
          } else {
            // Fallback: fetch all clubs and filter
            const clubsResponse = await fetch('/api/all-clubs')
            if (clubsResponse.ok) {
              const clubsData = await clubsResponse.json()
              const userClubs = clubsData.clubs.filter((club: any) => 
                club.leaderId === session?.user?.id
              )
              setClubs(userClubs)
              if (userClubs.length > 0) {
                setFormData(prev => ({ ...prev, clubId: userClubs[0].id }))
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching clubs:', error)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.id) {
      fetchClubs()
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Basic validation
    if (!formData.title || !formData.venue || !formData.startDate || !formData.endDate || !formData.clubId) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Validate dates
    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)
    const now = new Date()

    if (startDate < now) {
      setError('Event start date cannot be in the past')
      setIsSubmitting(false)
      return
    }

    if (endDate <= startDate) {
      setError('Event end date must be after start date')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          capacity: formData.capacity ? parseInt(formData.capacity) : null
        })
      })

      const data = await response.json()

      if (response.ok) {
        alert('Event created successfully and submitted for approval!')
        // Reset form
        setFormData({
          title: '',
          description: '',
          venue: '',
          startDate: '',
          endDate: '',
          capacity: '',
          isPublic: true,
          requirements: '',
          clubId: clubs[0]?.id || ''
        })
        setShowCreateForm(false)
      } else {
        setError(data.error || 'Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
      setError('An error occurred while creating the event')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session || session.user.role !== 'CLUB_LEADER') {
    return null
  }

  if (clubs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Event Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>No Clubs Found</CardTitle>
            <CardDescription>
              You need to be assigned as a leader of a club to create events.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Event</span>
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Create an event for one of your clubs. Events require admin approval before becoming public.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clubId">Club *</Label>
                  <select
                    id="clubId"
                    name="clubId"
                    value={formData.clubId}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Photography Workshop"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  name="venue"
                  type="text"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., BRACU Auditorium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date & Time *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date & Time *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity (optional)</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                    min="1"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isPublic">Public Event</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (optional)</Label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or prerequisites..."
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>
              Events you've created for your clubs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Event listing functionality coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
