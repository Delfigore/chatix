'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { setUser } from '@/store/slices/authSlice'
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
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      const transformedUser = transformUser(data.user as User)
      dispatch(setUser(transformedUser))
      router.push('/feed')
    } catch (error) {
      console.error('Error signing up:', error)
      alert('Error signing up. Please try again.')
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
      </form>
    </div>
  )
}