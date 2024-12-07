'use client'

import { useState, useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'
import axios from 'axios'

export default function UserSettings() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'error' })

  useEffect(() => {
    fetchUserSettings()
  }, [])

  const showToast = (title: string, description: string, type: 'error' | 'success') => {
    setToastMessage({ title, description, type })
    setOpen(true)
  }

  const fetchUserSettings = async () => {
    try {
      const response = await axios.get('/api/user')
      setName(response.data.name)
      setEmail(response.data.email)
    } catch (error) {
      showToast('エラー', 'ユーザー設定の取得に失敗しました', 'error')
    }
  }

  const updateUserSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.put('/api/user', { name, email })
      showToast('成功', 'ユーザー設定を更新しました', 'success')
    } catch (error) {
      showToast('エラー', 'ユーザー設定の更新に失敗しました', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={updateUserSettings} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          設定を保存
        </button>
      </form>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className={`${
            toastMessage.type === 'error' ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'
          } border rounded-lg shadow-lg p-4 fixed bottom-4 right-4`}
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className={`font-medium ${
            toastMessage.type === 'error' ? 'text-red-800' : 'text-green-800'
          }`}>
            {toastMessage.title}
          </Toast.Title>
          <Toast.Description className={`mt-1 ${
            toastMessage.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}>
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </div>
  )
}
