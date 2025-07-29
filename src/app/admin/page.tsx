
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard for now
    router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-4xl font-bold mb-6 text-primary drop-shadow">Admin Dashboard</h1>
      <div className="mb-6">
        <Link href="/admin/notifications">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition">Notify Students</button>
        </Link>
      </div>
      {/* ...other dashboard content... */}
    </div>
  )
}
