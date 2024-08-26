'use client'

import { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { supabase } from '@/lib/supabase'
import { addTweet, updateTweet, removeTweet } from '@/store/slices/tweetSlice'
import Tweet from './Tweet'
import { Tweet as TweetType } from '@/types'

export default function TweetList() {
  const tweets = useSelector((state: RootState) => state.tweets.tweets)
  const dispatch = useDispatch()

  const handleRealTimeChanges = useCallback((payload: any) => {
    if (payload.eventType === 'INSERT') {
      const sanitizedTweet = {
        ...payload.new,
        content: sanitizeContent(payload.new.content)
      }
      dispatch(addTweet(sanitizedTweet))
    } else if (payload.eventType === 'UPDATE') {
      const sanitizedTweet = {
        ...payload.new,
        content: sanitizeContent(payload.new.content)
      }
      dispatch(updateTweet(sanitizedTweet))
    } else if (payload.eventType === 'DELETE') {
      if (typeof payload.old.id === 'string' && payload.old.id.trim() !== '') {
        dispatch(removeTweet(payload.old.id))
      }
    }
  }, [dispatch])

  useEffect(() => {
    const channel = supabase.channel('public:tweets')

    channel
      .on('broadcast', { event: '*' }, handleRealTimeChanges)
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [handleRealTimeChanges])

  // Function to sanitize content (basic example)
  const sanitizeContent = (content: string): string => {
    // Remove potential XSS vectors
    return content.replace(/<[^>]*>/g, '')
  }

  return (
    <ul className="space-y-4">
      {tweets.map((tweet) => (
        <li key={tweet.id}>
          <Tweet tweet={tweet} />
        </li>
      ))}
    </ul>
  )
}