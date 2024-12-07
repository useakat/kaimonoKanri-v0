'use client'

import * as Tabs from '@radix-ui/react-tabs'
import InventoryList from '../components/InventoryList'
import PurchaseList from '../components/PurchaseList'
import UserSettings from '../components/UserSettings'

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">購入予定物品在庫管理</h1>
      <Tabs.Root defaultValue="inventory">
        <Tabs.List className="flex border-b border-gray-200">
          <Tabs.Trigger 
            value="inventory"
            className="px-4 py-2 -mb-px text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-gray-800 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            在庫一覧
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="purchase"
            className="px-4 py-2 -mb-px text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-gray-800 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            要購入商品
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="settings"
            className="px-4 py-2 -mb-px text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-gray-800 hover:border-gray-300 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            ユーザー設定
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="inventory" className="py-4">
          <InventoryList />
        </Tabs.Content>
        <Tabs.Content value="purchase" className="py-4">
          <PurchaseList />
        </Tabs.Content>
        <Tabs.Content value="settings" className="py-4">
          <UserSettings />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
