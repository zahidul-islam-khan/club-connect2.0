'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Clock, Search, Filter } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  venue: string
  startDate: string
  endDate: string
  capacity?: number
  attendeeCount: number
  requirements?: string
  club: {
    id: string
    name: string
    logo?: string
  }
  userRsvpStatus?: string | null
  spotsRemaining?: number | null
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/events?search=${searchTerm}&time=upcoming`)
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events)
          setFilteredEvents(data.events)
        } else {
          console.error('Failed to fetch events')
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchTerm])

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.club.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'All') {
      if (statusFilter === 'My Events') {
        filtered = filtered.filter(event => event.userRsvpStatus === 'ATTENDING')
      }
    }

    setFilteredEvents(filtered)
  }, [searchTerm, statusFilter, events])

  const handleRSVP = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'rsvp' })
      })
      
      if (response.ok) {
        // Refresh events data
        const eventsResponse = await fetch(`/api/events?search=${searchTerm}&time=upcoming`)
        if (eventsResponse.ok) {
          const data = await eventsResponse.json()
          setEvents(data.events)
        }
      }
    } catch (error) {
      console.error('Error handling RSVP:', error)
    }
  }

  const handleCancelRSVP = async (eventId: string) => {
    try {
      const response = await fetch('/api/events/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, action: 'cancel' })
      })
      
      if (response.ok) {
        // Refresh events data
        const eventsResponse = await fetch(`/api/events?search=${searchTerm}&time=upcoming`)
        if (eventsResponse.ok) {
          const data = await eventsResponse.json()
          setEvents(data.events)
        }
      }
    } catch (error) {
      console.error('Error canceling RSVP:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="bracu-bg min-h-screen flex items-center justify-center relative">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('/images/bracu-campus.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {/* Frosted glass container */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-2xl border border-white/20 transition-all duration-300 hover:bg-white/15">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Events</h1>
              <p className="mt-2 text-gray-200 drop-shadow">
                Discover and participate in exciting events hosted by university clubs
              </p>
            </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events, clubs, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm"
            >
              <option value="All">All Events</option>
              <option value="My Events">My Events</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="mt-1">by {event.club.name}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {event.userRsvpStatus && (
                      <Badge variant="outline" className="text-xs">
                        RSVP&apos;d
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendeeCount} attending
                      {event.capacity && ` / ${event.capacity} capacity`}
                    </span>
                  </div>
                </div>

                {/* Requirements */}
                {event.requirements && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {event.requirements}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="mt-auto">
                  {/* All events from API are approved, so always show RSVP options */}
                  {event.userRsvpStatus === 'ATTENDING' ? (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleCancelRSVP(event.id)}
                      >
                        Cancel RSVP
                      </Button>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => handleRSVP(event.id)}
                        disabled={event.capacity ? event.attendeeCount >= event.capacity : false}
                      >
                        {event.capacity && event.attendeeCount >= event.capacity 
                          ? 'Event Full' 
                          : 'RSVP to Event'
                        }
                      </Button>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No events found</h3>
            <p className="text-gray-200">
              Try adjusting your search terms or filters to find events that interest you.
            </p>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}
