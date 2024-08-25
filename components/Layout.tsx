import Sidebar from './Sidebar'
import TrendingSection from './TrendingSection'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto flex">
        <Sidebar />
        <main className="flex-grow px-4 py-8 md:px-8">{children}</main>
        <TrendingSection />
      </div>
    </div>
  )
}