'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { ResizeHandle } from './resizer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  path: string;
  icon?: string;
}

const menuItems: MenuItem[] = [
  {
    name: '商品一覧',
    path: '/',
    icon: '📦'
  },
  {
    name: '要購入商品',
    path: '/?status=要購入',
    icon: '🛒'
  },
  {
    name: '在庫少商品',
    path: '/?lowStock=true',
    icon: '⚠️'
  },
  {
    name: '注文済み商品',
    path: '/?status=注文済み',
    icon: '✅'
  }
];

export function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' && !searchParams.has('status') && !searchParams.has('lowStock');
    }
    const pathParams = new URLSearchParams(path.split('?')[1]);
    for (const [key, value] of pathParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <PanelGroup direction="horizontal" className="h-screen">
      <Panel defaultSize={20} minSize={15} maxSize={40}>
        <div className="h-full border-r">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">メニュー</h2>
              <div className="space-y-1">
                <ScrollArea className="h-[calc(100vh-8rem)]">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`
                        flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
                        ${isActive(item.path)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      {item.name}
                    </Link>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </Panel>
      
      <ResizeHandle />
      
      <Panel minSize={60}>
        <div className="h-full">
          {children}
        </div>
      </Panel>
    </PanelGroup>
  );
}
