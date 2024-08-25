'use client'

import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { setTweets } from '@/store/slices/tweetSlice'
import { RootState } from '@/store/store'
import TweetForm from '@/components/TweetForm'
import Tweet from '@/components/Tweet'
import { AlertCircle, RefreshCcw, Loader2 } from 'lucide-react'

interface TweetData {
  id: string
  content: string
  user_id: string
  created_at: string
  likes: number
  retweets: number
  user: {
    username: string
    avatar_url: string
  }
}

export default function Feed() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const tweets = useSelector((state: RootState) => state.tweets.tweets)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const fetchTweets = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      dispatch(setTweets(data as TweetData[]))
    } catch (error) {
      console.error('Error fetching tweets:', error)
      setError('Failed to load tweets. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [dispatch])

  const subscribeToTweets = useCallback(() => {
    supabase
      .channel('public:tweets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tweets' }, (payload) => {
        fetchTweets()
      })
      .subscribe()
  }, [fetchTweets])

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login')
    } else if (isAuthenticated === true) {
      fetchTweets()
      subscribeToTweets()
    }
    setIsCheckingAuth(false)
    return () => {
      supabase.removeAllChannels()
    }
  }, [isAuthenticated, router, fetchTweets, subscribeToTweets])

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 bg-white bg-opacity-70 backdrop-blur-md border-b border-gray-200">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </header>
      <main>
        <TweetForm />
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{error}</p>
            <button
              onClick={fetchTweets}
              className="mt-4 flex items-center text-blue-500 hover:underline"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try again
            </button>
          </div>
        ) : tweets.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-gray-500">
            No tweets yet. Be the first to tweet!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tweets.map((tweet: TweetData) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}