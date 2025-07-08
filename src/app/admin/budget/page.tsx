'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Building2 } from 'lucide-react'

export default function AdminBudgetPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading budget data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="mt-2 text-gray-600">
            Manage club budget requests and financial allocations
          </p>
        </div>

        {/* Budget Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold">৳5,00,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Allocated</p>
                  <p className="text-2xl font-bold">৳3,25,000</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold">৳1,75,000</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Budget Requests */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Budget Requests</CardTitle>
            <CardDescription>Latest budget requests from clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Sample Budget Request */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Programming Contest Prizes</h3>
                      <Badge variant="secondary">PENDING</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Budget for prizes and certificates for the annual programming contest
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Computer Club (BUCC)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ৳25,000
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Budget Request */}
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Cultural Event Expenses</h3>
                      <Badge variant="secondary">PENDING</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Venue decoration, sound system, and refreshments for cultural night
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Cultural Club (BUCuC)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ৳40,000
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Approved Request */}
              <div className="border rounded-lg p-4 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Robotics Workshop Equipment</h3>
                      <Badge className="bg-green-600">APPROVED</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Arduino kits and sensors for robotics workshop
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        Robotics Club (ROBU)
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ৳30,000
                      </span>
                      <span>Approved 2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Category</CardTitle>
            <CardDescription>How the budget is distributed across different activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Events & Activities</h3>
                  <p className="text-sm text-gray-600">Competitions, workshops, cultural events</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">৳2,00,000</p>
                  <p className="text-sm text-gray-500">40% of total budget</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Equipment & Supplies</h3>
                  <p className="text-sm text-gray-600">Lab equipment, materials, tools</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">৳1,50,000</p>
                  <p className="text-sm text-gray-500">30% of total budget</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Training & Development</h3>
                  <p className="text-sm text-gray-600">Workshops, training sessions, guest speakers</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">৳1,00,000</p>
                  <p className="text-sm text-gray-500">20% of total budget</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Emergency Fund</h3>
                  <p className="text-sm text-gray-600">Reserved for urgent requests</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">৳50,000</p>
                  <p className="text-sm text-gray-500">10% of total budget</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
