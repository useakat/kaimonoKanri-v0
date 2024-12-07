'use client'

import { useState, useEffect } from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Image, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'

export default function InventoryList() {
  const [items, setItems] = useState([])
  const toast = useToast()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items')
      setItems(response.data)
    } catch (error) {
      toast({
        title: 'エラー',
        description: '商品の取得に失敗しました',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const updatePurchaseFlag = async (itemId, newFlag) => {
    try {
      await axios.put(`/api/items/${itemId}`, { purchaseFlag: newFlag })
      fetchItems()
    } catch (error) {
      toast({
        title: 'エラー',
        description: '購入フラグの更新に失敗しました',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>画像</Th>
            <Th>商品名</Th>
            <Th>在庫数</Th>
            <Th>適正在庫下限</Th>
            <Th>購入フラグ</Th>
            <Th>アクション</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item._id}>
              <Td><Image src={item.image} alt={item.name} boxSize="50px" objectFit="cover" /></Td>
              <Td>{item.name}</Td>
              <Td>{item.stock}</Td>
              <Td>{item.minStock}</Td>
              <Td>{item.purchaseFlag}</Td>
              <Td>
                <Button onClick={() => updatePurchaseFlag(item._id, item.purchaseFlag === '在庫あり' ? '要購入' : '在庫あり')}>
                  {item.purchaseFlag === '在庫あり' ? '要購入に変更' : '在庫ありに変更'}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

