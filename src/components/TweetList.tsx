'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

export default function TweetList() {
  const tweets = useSelector((state: RootState) => state.tweets.tweets)

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="border p-4 rounded">
          <p>{tweet.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>{new Date(tweet.created_at).toLocaleString()}</span>
            <span className="ml-4">Likes: {tweet.likes}</span>
            <span className="ml-4">Retweets: {tweet.retweets}</span>
          </div>
        </div>
      ))}
    </div>
  )
}