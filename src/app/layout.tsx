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

export const metadata = {
  title: 'Twitter Clone',
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
      <body className={`${inter.className} bg-extra-extra-light-gray min-h-screen`}>
        <Providers>
          <ErrorBoundary>
            <div className="flex min-h-screen">
              <aside className="w-64 border-r border-extra-light-gray" aria-label="Sidebar navigation">
                <div className="fixed h-screen p-4">
                  <div className="mb-4">
                    <Image src="/logo.jpg" alt="Logo" width={50} height={50} priority />
                  </div>
                  <Suspense fallback={<p>Loading navigation...</p>}>
                    <Navigation />
                  </Suspense>
                </div>
              </aside>
              <main className="flex-1 ml-64">
                <div className="max-w-2xl mx-auto mt-4 px-4 py-8">
                  <Suspense fallback={<Loading />}>
                    {children}
                  </Suspense>
                </div>
              </main>
            </div>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
