'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/auth-js'
import { User as ReduxUser } from '@/store/slices/authSlice'

export interface User extends SupabaseUser {
  // Add any additional properties you need
}

const transformUser = (user: User | null): ReduxUser | null => {
  if (!user) return null;
  return {
    ...user,
    email: user.email || '', // Provide a default value if email is undefined
    // Add any other required fields that might be optional in User
  };
};

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      setMessage('Please check your email for the confirmation link.')
    } catch (error) {
      console.error('Error signing up:', error)
      setMessage('Error signing up. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
          Sign Up
        </button>
        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  )
}