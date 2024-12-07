'use client'

import { useState, useEffect } from 'react'
import { Box, Table, Thead, Tbody, Tr, Th, Td, Link, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'

export default function PurchaseList() {
  const [items, setItems] = useState([])
  const toast = useToast()

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items?purchaseFlag=要購入')
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
            <Th>商品名</Th>
            <Th>購入リンク</Th>
            <Th>アクション</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item._id}>
              <Td>{item.name}</Td>
              <Td>
                <Link href={item.purchaseUrl} isExternal color="blue.500">
                  購入ページへ
                </Link>
              </Td>
              <Td>
                <Button onClick={() => updatePurchaseFlag(item._id, '注文済み')}>
                  注文済みに変更
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

