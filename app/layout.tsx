import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'

const inter = Inter({ subsets: ['latin', 'japanese'] })

export const metadata: Metadata = {
  title: '買うもの管理',
  description: 'Shopping Management Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}

