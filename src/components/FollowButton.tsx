import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase'
import { RootState } from '@/store/store'

interface FollowButtonProps {
  targetUserId: string
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)

  const checkFollowStatus = useCallback(async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('follows')
        .select()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single()
      if (error && error.code !== 'PGRST116') throw error
      setIsFollowing(!!data)
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }, [user, targetUserId])

  useEffect(() => {
    checkFollowStatus()
  }, [checkFollowStatus])

  const handleFollow = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      if (isFollowing) {
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: targetUserId })
      }
      setIsFollowing(!isFollowing)
    } catch (error) {
      console.error('Error updating follow status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
        isFollowing
          ? 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}