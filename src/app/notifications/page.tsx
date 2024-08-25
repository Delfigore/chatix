'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '@/lib/supabase'
import { RootState } from '@/store/store'
import * as Avatar from '@radix-ui/react-avatar'
import { Heart, Repeat, MessageCircle, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'like' | 'retweet' | 'follow' | 'mention'
  created_at: string
  actor: {
    username: string
    avatar_url: string
  }
  tweet?: {
    id: string
    content: string
  }
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useSelector((state: RootState) => state.auth)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:profiles!actor_id(username, avatar_url),
          tweet:tweets(id, content)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to load notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const subscribeToNotifications = useCallback(() => {
    if (!user) return
    const channel = supabase
      .channel(`user_notifications:${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload) => {
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchNotifications])

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const unsubscribe = subscribeToNotifications()
      return unsubscribe
    }
  }, [user, fetchNotifications, subscribeToNotifications])

  const renderNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={16} className="text-red-400" />
      case 'retweet':
        return <Repeat size={16} className="text-green-400" />
      case 'follow':
        return <Avatar.Root className="bg-blue-400 inline-flex h-4 w-4 items-center justify-center rounded-full" />
      case 'mention':
        return <MessageCircle size={16} className="text-blue-400" />
      default:
        return null
    }
  }

  const renderNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:underline">
              {notification.actor.username}
            </Link>{' '}
            liked your tweet
          </span>
        )
      case 'retweet':
        return (
          <span>
            <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:underline">
              {notification.actor.username}
            </Link>{' '}
            retweeted your tweet
          </span>
        )
      case 'follow':
        return (
          <span>
            <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:underline">
              {notification.actor.username}
            </Link>{' '}
            followed you
          </span>
        )
      case 'mention':
        return (
          <span>
            <Link href={`/profile/${notification.actor.username}`} className="font-semibold hover:underline">
              {notification.actor.username}
            </Link>{' '}
            mentioned you in a tweet
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={fetchNotifications}
          disabled={isLoading}
          className="flex items-center text-primary hover:underline disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500">
          <AlertCircle className="h-8 w-8 mb-2" />
          <p>{error}</p>
          <button
            onClick={fetchNotifications}
            className="mt-4 flex items-center text-primary hover:underline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </button>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg p-4 flex items-start space-x-3 shadow">
              <div className="flex-shrink-0">
                {renderNotificationIcon(notification.type)}
              </div>
              <div className="flex-grow">
                <p className="text-gray-900">{renderNotificationContent(notification)}</p>
                {notification.tweet && (
                  <Link href={`/tweet/${notification.tweet.id}`} className="text-gray-600 text-sm hover:underline">
                    {notification.tweet.content.length > 50
                      ? `${notification.tweet.content.substring(0, 50)}...`
                      : notification.tweet.content}
                  </Link>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">You have no notifications.</p>
      )}
    </div>
  )
}