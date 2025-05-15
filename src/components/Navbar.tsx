'use client'

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link'

export default function Navbar() {
  const { isLogged } = useAuth();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center bg-gray-800 text-white px-6 py-4 shadow-md h-16">
      <div className="text-xl font-bold">
        <Link href="/">Home</Link>
      </div>
      <div className="space-x-4">        
        {isLogged ? (<>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/applications" className="hover:underline">Applications</Link>
          <Link href="/logout" className="hover:underline">Logout</Link>
          </>
        ) : <>
          <Link href="/register" className="hover:underline">Register</Link>
          <Link href="/login" className="hover:underline">Login</Link>
        </>}
      </div>
    </nav>
  )
}
