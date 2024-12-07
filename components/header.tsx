'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/user-button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">買うもの管理</span>
          </a>
        </div>
        <div className="flex flex-1 items-center space-x-2">
          <div className="w-full max-w-xl flex items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search 商品一覧"
                className="w-full pl-8"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <UserButton />
        </div>
      </div>
    </header>
  )
}

