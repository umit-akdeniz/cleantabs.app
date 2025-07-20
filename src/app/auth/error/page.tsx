export const dynamic = 'force-dynamic';

'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          
          <div className="mb-4">
            <p className="text-gray-600">An error occurred during authentication:</p>
            <p className="text-red-500 font-mono text-sm mt-2 p-2 bg-red-50 rounded">
              {error || 'Unknown error'}
            </p>
          </div>

          <div className="space-y-2">
            <Link 
              href="/auth/signin"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            
            <Link 
              href="/"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
            >
              Go Home
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>If this error persists, please contact support.</p>
            <p className="mt-2">Error details for debugging:</p>
            <pre className="mt-1 text-left bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}