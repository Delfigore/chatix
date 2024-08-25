import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase'
import { RootState } from '@/store/store'
import * as Avatar from '@radix-ui/react-avatar'
import { Heart, MessageCircle, Repeat, Share2 } from 'lucide-react'
import Link from 'next/link'
import { debounce } from 'lodash'

interface TweetProps {
  tweet: {
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
}

export default function Tweet({ tweet }: TweetProps) {
  const [likes, setLikes] = useState(tweet.likes)
  const [retweets, setRetweets] = useState(tweet.retweets)
  const [isLiked, setIsLiked] = useState(false)
  const [isRetweeted, setIsRetweeted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLike = useCallback(async () => {
    if (!user) return
    try {
      setError(null)
      const newLikes = isLiked ? likes - 1 : likes + 1
      setLikes(newLikes)
      setIsLiked(!isLiked)

      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id })
      } else {
        await supabase
          .from('likes')
          .insert({ user_id: user.id, tweet_id: tweet.id })
      }
    } catch (error) {
      console.error('Error liking tweet:', error)
      setError('Failed to like tweet. Please try again.')
      setLikes(likes)
      setIsLiked(isLiked)
    }
  }, [user, isLiked, likes, tweet.id])

  const handleRetweet = useCallback(async () => {
    if (!user) return
    try {
      setError(null)
      const newRetweets = isRetweeted ? retweets - 1 : retweets + 1
      setRetweets(newRetweets)
      setIsRetweeted(!isRetweeted)

      if (isRetweeted) {
        await supabase
          .from('retweets')
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id })
      } else {
        await supabase
          .from('retweets')
          .insert({ user_id: user.id, tweet_id: tweet.id })
      }
    } catch (error) {
      console.error('Error retweeting:', error)
      setError('Failed to retweet. Please try again.')
      setRetweets(retweets)
      setIsRetweeted(isRetweeted)
    }
  }, [user, isRetweeted, retweets, tweet.id])

  const debouncedLike = debounce(handleLike, 300)
  const debouncedRetweet = debounce(handleRetweet, 300)

  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex space-x-3">
        <Avatar.Root className="bg-gray-200 inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
          <Avatar.Image
            className="h-full w-full rounded-full object-cover"
            src={tweet.user.avatar_url || "https://github.com/shadcn.png"}
            alt={tweet.user.username || "User avatar"}
          />
          <Avatar.Fallback className="text-gray-900 leading-1 flex h-full w-full items-center justify-center bg-gray-200 text-lg font-medium">
            {tweet.user.username[0].toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex-grow">
          <div className="flex items-center mb-1">
            <Link href={`/profile/${tweet.user_id}`} className="font-bold text-gray-900 hover:underline mr-2">
              {tweet.user.username}
            </Link>
            <span className="text-gray-500 text-sm">
              · {new Date(tweet.created_at).toLocaleDateString()} 
            </span>
          </div>
          <p className="text-gray-900 mb-2">{tweet.content}</p>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex items-center justify-between text-gray-500">
            <button 
              className="flex items-center space-x-1 group"
              aria-label="Reply to tweet"
            >
              <div className="p-2 rounded-full group-hover:bg-primary group-hover:bg-opacity-10 transition-colors duration-200">
                <MessageCircle size={18} className="group-hover:text-primary" />
              </div>
            </button>
            <button 
              className={`flex items-center space-x-1 group ${isRetweeted ? 'text-green-500' : ''}`}
              onClick={debouncedRetweet}
              aria-label={isRetweeted ? "Undo retweet" : "Retweet"}
            >
              <div className={`p-2 rounded-full ${isRetweeted ? 'bg-green-500 bg-opacity-10' : 'group-hover:bg-green-500 group-hover:bg-opacity-10'} transition-colors duration-200`}>
                <Repeat size={18} className={isRetweeted ? 'text-green-500' : 'group-hover:text-green-500'} />
              </div>
              <span>{retweets}</span>
            </button>
            <button 
              className={`flex items-center space-x-1 group ${isLiked ? 'text-red-500' : ''}`}
              onClick={debouncedLike}
              aria-label={isLiked ? "Unlike tweet" : "Like tweet"}
            >
              <div className={`p-2 rounded-full ${isLiked ? 'bg-red-500 bg-opacity-10' : 'group-hover:bg-red-500 group-hover:bg-opacity-10'} transition-colors duration-200`}>
                <Heart size={18} className={isLiked ? 'text-red-500' : 'group-hover:text-red-500'} />
              </div>
              <span>{likes}</span>
            </button>
            <button 
              className="flex items-center space-x-1 group"
              aria-label="Share tweet"
            >
              <div className="p-2 rounded-full group-hover:bg-primary group-hover:bg-opacity-10 transition-colors duration-200">
                <Share2 size={18} className="group-hover:text-primary" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}