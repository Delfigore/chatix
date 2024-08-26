'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { supabase } from '@/lib/supabase'
import { setTweets } from '@/store/slices/tweetSlice'
import TweetForm from '@/components/TweetForm'
import TweetList from '@/components/TweetList'

export default function FeedPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const fetchTweets = async () => {
      const { data, error } = await supabase
        .from('tweets')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching tweets:', error)
      } else {
        dispatch(setTweets(data))
      }
    }

    fetchTweets()
  }, [dispatch])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tweet Feed</h1>
      {user ? <TweetForm /> : <p className="mb-4">Log in to post tweets.</p>}
      <TweetList />
    </div>
  )
}