import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { supabase } from '@/lib/supabase'
import { updateTweet } from '@/store/slices/tweetSlice'
import { Heart, MessageCircle, Repeat } from 'lucide-react'
import * as Avatar from '@radix-ui/react-avatar'
import { Tweet as TweetType, TwitterCloneError, SupabaseResponse } from '@/types'

interface TweetProps {
  tweet: TweetType
}

export default function Tweet({ tweet }: TweetProps) {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const [isLiking, setIsLiking] = useState(false)
  const [isRetweeting, setIsRetweeting] = useState(false)

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      const response: SupabaseResponse<TweetType> = await supabase
        .from('tweets')
        .update({ likes: tweet.likes + 1 })
        .eq('id', tweet.id)
        .select()
        .single()
      
      if (response.error) {
        throw new TwitterCloneError(response.error.message, response.error.code)
      }
      
      if (response.data) {
        dispatch(updateTweet(response.data))
      }
    } catch (error) {
      if (error instanceof TwitterCloneError) {
        console.error(`Error liking tweet: ${error.message} (Code: ${error.code})`)
      } else {
        console.error('Unexpected error liking tweet:', error)
      }
    } finally {
      setIsLiking(false)
    }
  }

  const handleRetweet = async () => {
    if (isRetweeting) return
    setIsRetweeting(true)
    try {
      const response: SupabaseResponse<TweetType> = await supabase
        .from('tweets')
        .update({ retweets: tweet.retweets + 1 })
        .eq('id', tweet.id)
        .select()
        .single()
      
      if (response.error) {
        throw new TwitterCloneError(response.error.message, response.error.code)
      }
      
      if (response.data) {
        dispatch(updateTweet(response.data))
      }
    } catch (error) {
      if (error instanceof TwitterCloneError) {
        console.error(`Error retweeting: ${error.message} (Code: ${error.code})`)
      } else {
        console.error('Unexpected error retweeting:', error)
      }
    } finally {
      setIsRetweeting(false)
    }
  }

  const renderMedia = () => {
    if (tweet.image_url) {
      return (
        <img src={tweet.image_url} alt="Tweet image" className="mt-2 rounded-lg max-h-96 w-full object-cover" />
      )
    }
    if (tweet.youtube_url) {
      const videoId = new URL(tweet.youtube_url).searchParams.get('v')
      return (
        <iframe
          className="mt-2 rounded-lg w-full aspect-video"
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    }
    if (tweet.twitch_url) {
      const channelName = new URL(tweet.twitch_url).pathname.split('/')[1]
      return (
        <iframe
          className="mt-2 rounded-lg w-full aspect-video"
          src={`https://player.twitch.tv/?channel=${channelName}&parent=${window.location.hostname}`}
          allowFullScreen
        ></iframe>
      )
    }
    if (tweet.link_url) {
      return (
        <a
          href={tweet.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block text-blue-500 hover:underline"
        >
          {tweet.link_url}
        </a>
      )
    }
    return null
  }

  return (
    <div className="border p-4 rounded">
      <div className="flex items-start space-x-3">
        <Avatar.Root className="bg-gray-200 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle">
          <Avatar.Image
            className="h-full w-full rounded-full object-cover"
            src={user?.user_metadata.avatar_url || "https://github.com/shadcn.png"}
            alt={`Avatar of ${user?.user_metadata.full_name || "User"}`}
          />
          <Avatar.Fallback className="text-gray-900 leading-1 flex h-full w-full items-center justify-center bg-gray-200 text-sm font-medium">
            {(user?.user_metadata.full_name || "User")[0].toUpperCase()}
          </Avatar.Fallback>
        </Avatar.Root>
        <div className="flex-grow">
          <p className="font-semibold">{user?.user_metadata.full_name || "User"}</p>
          <p>{tweet.content}</p>
          {renderMedia()}
          <div className="mt-2 text-sm text-gray-500">
            <span>{new Date(tweet.created_at).toLocaleString()}</span>
          </div>
          <div className="mt-2 flex space-x-4">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
              disabled={isLiking}
            >
              <Heart size={18} />
              <span>{tweet.likes}</span>
            </button>
            <button
              onClick={handleRetweet}
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
              disabled={isRetweeting}
            >
              <Repeat size={18} />
              <span>{tweet.retweets}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
              <MessageCircle size={18} />
              <span>Reply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}