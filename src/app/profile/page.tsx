
'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Building2 } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div className="flex justify-center items-center h-screen">Access Denied. Please sign in.</div>
  }

  const user = session?.user

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">Your personal and account details.</p>
        </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user?.name}</CardTitle>
              <p className="text-gray-500">{user?.email}</p>
              <Badge className="mt-2">{user?.role}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Student ID</h3>
                <p>{user?.studentId || 'Not Provided'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Department</h3>
                <p>{user?.department || 'Not Provided'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Semester</h3>
                <p>{user?.semester || 'Not Provided'}</p>
            </div>
            <div>
                <h3 className="font-semibold">Phone</h3>
                <p>{user?.phone || 'Not Provided'}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
