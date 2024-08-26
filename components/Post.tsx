import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'
import { MessageSquare, Repeat2, Heart, Share } from 'lucide-react'

interface PostProps {
  user: {
    name: string
    username: string
  }
  content: string
  timestamp: string
}

export default function Post({ user, content, timestamp }: PostProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">{user.name}</span>
            <span className="text-gray-500">{user.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">{timestamp}</span>
          </div>
          <p className="mt-2">{content}</p>
          <div className="mt-4 flex justify-between text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <MessageSquare size={20} />
              <span>Reply</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <Repeat2 size={20} />
              <span>Repost</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <Heart size={20} />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <Share size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
