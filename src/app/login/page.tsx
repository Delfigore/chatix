'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { setUser, transformSupabaseUser } from '@/store/slices/authSlice'
import GoogleAuthButton from '@/components/GoogleAuthButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({email: '', password: '', general: ''})
  const dispatch = useDispatch()
  const router = useRouter()

  const validateForm = () => {
    let isValid = true
    const newErrors = {email: '', password: '', general: ''}

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    } else if (!/\S+@\S+\.(com|ru|org|net|edu|gov)$/.test(email.toLowerCase())) {
      newErrors.email = 'Email must have a valid domain (e.g., .com, .ru, .org, .net, .edu, .gov, .io, .me, .ua)'
      isValid = false
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.user) {
        const transformedUser = transformSupabaseUser(data.user)
        dispatch(setUser(transformedUser))
        router.push('/feed')
      }
    } catch (error) {
      console.error('Error logging in:', error)
      setErrors(prev => ({...prev, general: 'Invalid email or password. Please try again.'}))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Login to Twitter Clone</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
          {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 transition duration-200">
            Login
          </button>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleAuthButton />
          </div>
        </div>
      </div>
    </div>
  )
}