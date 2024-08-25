import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { Suspense, lazy } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

const Navigation = dynamic(() => import('@/components/Navigation'), {
  loading: () => <p>Loading...</p>,
})

const TrendingSection = dynamic(() => import('@/components/TrendingSection'), {
  loading: () => <p>Loading trending...</p>,
})

export const metadata = {
  title: 'Chatix',
  description: 'A modern Twitter-like application',
}

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen" aria-label="Loading">
      <Image src="/logo.jpg" alt="Logo" width={100} height={100} priority />
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
            <div className="flex min-h-screen">
              {/* Left sidebar */}
              <aside className="w-64 border-r border-gray-200" aria-label="Sidebar navigation">
                <div className="fixed h-screen p-4">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold">Chatix</h1>
                  </div>
                  <Suspense fallback={<p>Loading navigation...</p>}>
                    <Navigation />
                  </Suspense>
                </div>
              </aside>

              {/* Main content */}
              <main className="flex-1 border-r border-gray-200">
                <div className="max-w-2xl mx-auto px-4 py-4">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </div>
              </main>

              {/* Right sidebar */}
              <aside className="w-80 p-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search Chatix"
                    className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
