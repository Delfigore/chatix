import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Suspense, lazy } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

const Navigation = dynamic(() => import('@/components/Navigation'), {
  loading: () => <p>Loading navigation...</p>,
})

const TrendingSection = dynamic(() => import('@/components/TrendingSection'), {
  loading: () => <p>Loading trending...</p>,
})

const SearchBar = dynamic(() => import('@/components/SearchBar'), {
  loading: () => <p>Loading search...</p>,
})

export const metadata = {
  title: 'Chatix',
  description: 'A modern Twitter-like application',
}

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen" aria-label="Loading">
      <Image src="/logo.jpg" alt="Chatix Logo" width={100} height={100} priority />
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} bg-white min-h-screen`}>
        <Providers>
          <ErrorBoundary>
            <div className="flex flex-col md:flex-row min-h-screen">
              {/* Left sidebar */}
              <aside className="w-full md:w-64 border-b md:border-r border-gray-200" aria-label="Sidebar navigation">
                <div className="md:fixed md:h-screen p-4">
                  <div className="mb-4">
                    <Link href="/feed" className="inline-block">
                      <h1 className="text-2xl font-bold hover:text-blue-500 transition-colors duration-200">Chatix</h1>
                    </Link>
                  </div>
                  <Suspense fallback={<p>Loading navigation...</p>}>
                    <Navigation />
                  </Suspense>
                </div>
              </aside>

              {/* Main content */}
              <main className="flex-1 border-b md:border-r border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </div>
              </main>

              {/* Right sidebar */}
              <aside className="w-full md:w-80 p-4">
                <div className="mb-4">
                  <Suspense fallback={<p>Loading search...</p>}>
                    <SearchBar />
                  </Suspense>
                </div>
                <Suspense fallback={<p>Loading trending...</p>}>
                  <TrendingSection />
                </Suspense>
              </aside>
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
