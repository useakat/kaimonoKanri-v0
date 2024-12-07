'use client'

import { useState, useEffect } from 'react'
import { Box, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react'
import axios from 'axios'

export default function UserSettings() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const fetchUserSettings = async () => {
    try {
      const response = await axios.get('/api/user')
      setName(response.data.name)
      setEmail(response.data.email)
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ユーザー設定の取得に失敗しました',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  const updateUserSettings = async (e) => {
    e.preventDefault()
    try {
      await axios.put('/api/user', { name, email })
      toast({
        title: '成功',
        description: 'ユーザー設定を更新しました',
        status: 'success',
        duration: 9000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'エラー',
        description: 'ユーザー設定の更新に失敗しました',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }

  return (
    <Box>
      <form onSubmit={updateUserSettings}>
        <FormControl>
          <FormLabel>名前</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>メールアドレス</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <Button mt={4} colorScheme="blue" type="submit">
          設定を保存
        </Button>
      </form>
    </Box>
  )
}

