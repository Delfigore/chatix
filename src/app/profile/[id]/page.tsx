'use client';

import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { RootState } from '@/store/store'
import Tweet from '@/components/Tweet'
import FollowButton from '@/components/FollowButton'
import * as Avatar from '@radix-ui/react-avatar'
import * as Tabs from '@radix-ui/react-tabs'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [tweets, setTweets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector((state: RootState) => state.auth)
  const params = useParams();
  const id = params?.id as string || '';

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', id)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }, [id])

  const fetchTweets = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .eq('user_id', id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setTweets(data || [])
    } catch (error) {
      console.error('Error fetching tweets:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProfile()
    fetchTweets()
  }, [fetchProfile, fetchTweets])

  if (!profile) return <div>Loading profile...</div>

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <Avatar.Root className="bg-blackA3 inline-flex h-20 w-20 select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <Avatar.Image
              className="h-full w-full rounded-full object-cover"
              src={profile.avatar_url || "https://github.com/shadcn.png"}
              alt={`${profile.username}'s avatar`}
            />
            <Avatar.Fallback className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-2xl font-medium">
              {profile.username?.[0]?.toUpperCase()}
            </Avatar.Fallback>
          </Avatar.Root>
          <div>
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            <p className="text-gray-600">@{profile.username}</p>
          </div>
        </div>
        {user && user.id !== id && (
          <div className="mt-4">
            <FollowButton targetUserId={id} />
          </div>
        )}
      </div>

      <Tabs.Root defaultValue="tweets" className="bg-white rounded-lg shadow">
        <Tabs.List className="flex border-b">
          <Tabs.Trigger value="tweets" className="flex-1 py-2 px-4 text-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Tweets
          </Tabs.Trigger>
          <Tabs.Trigger value="likes" className="flex-1 py-2 px-4 text-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Likes
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tweets" className="p-4">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : (
            tweets.map((tweet: any) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))
          )}
        </Tabs.Content>
        <Tabs.Content value="likes" className="p-4">
          <p>Liked tweets will be displayed here.</p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
