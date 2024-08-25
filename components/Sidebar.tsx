import Link from 'next/link'
import { Home, Bell, Mail, User } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 p-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-8">Chatix</h1>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Home />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/notifications" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Bell />
              <span>Notifications</span>
            </Link>
          </li>
          <li>
            <Link href="/messages" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <Mail />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-blue-500">
              <User />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}