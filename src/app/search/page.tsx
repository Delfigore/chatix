'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Tweet from '@/components/Tweet'
import { Search as SearchIcon } from 'lucide-react'

interface TweetType {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  likes: number;
  retweets: number;
  user: {
    username: string;
    avatar_url: string;
  };
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<TweetType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('tweets')
        .select(`
          *,
          user:profiles(username, avatar_url)
        `)
        .textSearch('content', searchTerm)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Error searching tweets:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Search Tweets</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tweets..."
            className="w-full p-3 pl-10 bg-gray-700 text-white placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
        >
          Search
        </button>
      </form>
      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      ) : (
        <div>
          {searchResults.map((tweet: TweetType) => (
            <Tweet key={tweet.id} tweet={tweet} />
          ))}
          {searchResults.length === 0 && searchTerm && (
            <p className="text-gray-400 text-center">No tweets found matching your search.</p>
          )}
        </div>
      )}
    </div>
  )
}