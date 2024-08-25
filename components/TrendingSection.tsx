import { Search } from 'lucide-react'

export default function TrendingSection() {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 p-4 bg-white shadow-md">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Chatix"
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Trending</h2>
        <ul className="space-y-4">
          <li>
            <a href="#" className="text-blue-500 hover:underline">#ChatixLaunch</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">#TechNews</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">#WebDev</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">#AI</a>
          </li>
          <li>
            <a href="#" className="text-blue-500 hover:underline">#Innovation</a>
          </li>
        </ul>
      </div>
    </aside>
  )
}