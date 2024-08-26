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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({email: '', password: '', confirmPassword: ''})
  const router = useRouter()

  const validateForm = () => {
    let isValid = true
    const newErrors = {email: '', password: '', confirmPassword: ''}

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    } else if (!/\S+@\S+\.(com|ru|org|net|edu|gov)$/.test(email.toLowerCase())) {
      newErrors.email = 'Email must have a valid domain (e.g., .com, .ru, .org, .net, .edu, .gov)'
      isValid = false
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
      isValid = false
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      isValid = false
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSignup} className="w-full max-w-md space-y-4 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Sign Up</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-md font-semibold hover:bg-green-600 transition duration-200">
          Sign Up
        </button>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      </form>
    </div>
  )
}