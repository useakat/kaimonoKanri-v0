'use client'

import { Box, Heading, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import InventoryList from './components/InventoryList'
import PurchaseList from './components/PurchaseList'
import UserSettings from './components/UserSettings'

export default function Home() {
  return (
    <Box maxWidth="1200px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" marginBottom={6}>購入予定物品在庫管理</Heading>
      <Tabs>
        <TabList>
          <Tab>在庫一覧</Tab>
          <Tab>要購入商品</Tab>
          <Tab>ユーザー設定</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <InventoryList />
          </TabPanel>
          <TabPanel>
            <PurchaseList />
          </TabPanel>
          <TabPanel>
            <UserSettings />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

