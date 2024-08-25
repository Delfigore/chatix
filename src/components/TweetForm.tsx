import { useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase'
import { addTweet } from '@/store/slices/tweetSlice'
import { RootState } from '@/store/store'
import * as Avatar from '@radix-ui/react-avatar'
import { Image, Smile, MapPin, AlertCircle, Loader2 } from 'lucide-react'

const MAX_TWEET_LENGTH = 280

export default function TweetForm() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isLoading || content.length > MAX_TWEET_LENGTH) return

    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tweets')
        .insert({ content: content.trim(), user_id: user?.id })
        .select()
      if (error) throw error
      dispatch(addTweet(data[0]))
      setContent('')
    } catch (error) {
      console.error('Error creating tweet:', error)
      setError('Failed to post tweet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [content, isLoading, user, dispatch])

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value.slice(0, MAX_TWEET_LENGTH))
  }, [])

  const isSubmitDisabled = useMemo(() => (
    isLoading || !content.trim() || content.length > MAX_TWEET_LENGTH
  ), [isLoading, content])

  const characterCountClass = useMemo(() => {
    if (content.length > MAX_TWEET_LENGTH) return 'text-red-500'
    if (content.length > MAX_TWEET_LENGTH - 20) return 'text-yellow-500'
    return 'text-gray-500'
  }, [content.length])

  const submitButtonClass = useMemo(() => (
    isSubmitDisabled
      ? 'bg-primary/50 cursor-not-allowed'
      : 'bg-primary hover:bg-primary/90'
  ), [isSubmitDisabled])

  const userAvatar = useMemo(() => (
    <Avatar.Root className="bg-gray-200 inline-flex h-12 w-12 select-none items-center justify-center overflow-hidden rounded-full align-middle">
      <Avatar.Image
        className="h-full w-full rounded-full object-cover"
        src={user?.user_metadata.avatar_url || "https://github.com/shadcn.png"}
        alt={user?.user_metadata.full_name || "User avatar"}
      />
      <Avatar.Fallback className="text-gray-900 leading-1 flex h-full w-full items-center justify-center bg-gray-200 text-lg font-medium">
        {(user?.user_metadata.full_name || "User")[0].toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
  ), [user])

  return (
    <form onSubmit={handleSubmit} className="border-b border-gray-200 p-4">
      <div className="flex space-x-4">
        {userAvatar}
        <div className="flex-grow">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="What's happening?"
            className="w-full p-2 resize-none border-none focus:outline-none text-lg"
            rows={3}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors duration-200">
                <Image size={20} />
              </button>
              <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors duration-200">
                <Smile size={20} />
              </button>
              <button type="button" className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors duration-200">
                <MapPin size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${characterCountClass}`}>
                {content.length}/{MAX_TWEET_LENGTH}
              </span>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`px-4 py-2 rounded-full text-white font-bold transition-colors duration-200 ${submitButtonClass}`}
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  'Tweet'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {error && (
        <div className="mt-2 text-red-500 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          <span>{error}</span>
        </div>
      )}
    </form>
  )
}