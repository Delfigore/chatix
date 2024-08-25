'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState } from '@/store/store'
import { clearUser } from '@/store/slices/authSlice'
import { supabase } from '@/lib/supabase'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Avatar from '@radix-ui/react-avatar'
import { Bell, Home, User, LogOut, Search, MessageCircle, Bookmark, Hash } from 'lucide-react'
import { useMemo, useCallback } from 'react'

export default function Navigation() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    dispatch(clearUser())
    router.push('/')
  }, [dispatch, router])

  const navLinks = useMemo(() => [
    { href: '/feed', icon: <Home size={24} />, label: 'Home' },
    { href: '/search', icon: <Search size={24} />, label: 'Explore' },
    { href: '/notifications', icon: <Bell size={24} />, label: 'Notifications' },
    { href: '/messages', icon: <MessageCircle size={24} />, label: 'Messages' },
    { href: '/bookmarks', icon: <Bookmark size={24} />, label: 'Bookmarks' },
    ...(user ? [{ href: `/profile/${user.id}`, icon: <User size={24} />, label: 'Profile' }] : []),
  ], [user])

  const userAvatar = useMemo(() => (
    <Avatar.Root className="bg-gray-300 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle">
      <Avatar.Image
        className="h-full w-full rounded-full object-cover"
        src={user?.user_metadata.avatar_url || "https://github.com/shadcn.png"}
        alt={user?.user_metadata.full_name || "User avatar"}
      />
      <Avatar.Fallback className="text-gray-900 leading-1 flex h-full w-full items-center justify-center bg-gray-300 text-base font-medium" delayMs={600}>
        {(user?.user_metadata.full_name || "User")[0].toUpperCase()}
      </Avatar.Fallback>
    </Avatar.Root>
  ), [user])

  return (
    <nav className="flex flex-col h-full">
      <div className="p-4">
        <Link href="/" className="text-primary hover:text-primary/80 transition-colors duration-200">
          <Hash size={28} />
        </Link>
      </div>
      <div className="flex-1">
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} icon={link.icon}>{link.label}</NavLink>
        ))}
      </div>
      <div className="p-4">
        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
              {userAvatar}
              <span className="font-bold text-sm">{user.user_metadata.full_name || "User"}</span>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="min-w-[220px] bg-white rounded-lg p-2 shadow-lg">
                <DropdownMenu.Item className="text-sm text-gray-700 px-2 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center space-x-2 transition-colors duration-200">
                  <User size={16} />
                  <Link href={`/profile/${user.id}`}>Profile</Link>
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                <DropdownMenu.Item className="text-sm text-red-500 px-2 py-2 cursor-pointer hover:bg-gray-100 rounded flex items-center space-x-2 transition-colors duration-200" onSelect={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : (
          <div className="space-y-2">
            <Link href="/login" className="block w-full text-center bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors duration-200">
              Login
            </Link>
            <Link href="/signup" className="block w-full text-center bg-white text-primary border border-primary px-4 py-2 rounded-full font-bold hover:bg-gray-50 transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

const NavLink = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Link href={href} className="flex items-center space-x-4 px-4 py-3 text-xl font-bold text-gray-900 hover:bg-gray-200 rounded-full transition-colors duration-200">
    {icon}
    <span>{children}</span>
  </Link>
)