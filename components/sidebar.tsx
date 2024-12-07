'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Home, Package, Info, MessageSquare, AppWindowIcon as Apps } from 'lucide-react'

const sidebarNavItems = [
  {
    title: '商品一覧',
    icon: Home,
    href: '/',
  },
  {
    title: '要購入',
    icon: Package,
    href: '/to-purchase',
    badge: 2,
  },
  {
    title: '在庫あり',
    icon: Package,
    href: '/in-stock',
    badge: 10,
  },
  {
    title: 'About',
    icon: Info,
    href: '/about',
  },
  {
    title: 'Feedback',
    icon: MessageSquare,
    href: '/feedback',
  },
  {
    title: 'App Gallery',
    icon: Apps,
    href: '/app-gallery',
  },
]

export function Sidebar() {
  return (
    <div className="hidden border-r bg-background md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xl font-semibold">MENU</h2>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="space-y-1 p-2">
                {sidebarNavItems.map((item, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

