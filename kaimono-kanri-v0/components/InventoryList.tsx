'use client'

import { useState, useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'
import axios from 'axios'

export default function InventoryList() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', description: '', type: 'error' })

  useEffect(() => {
    fetchItems()
  }, [])

  const showToast = (title: string, description: string, type: 'error' | 'success') => {
    setToastMessage({ title, description, type })
    setOpen(true)
  }

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/items')
      setItems(response.data)
    } catch (error) {
      showToast('エラー', '商品の取得に失敗しました', 'error')
    }
  }

  const updatePurchaseFlag = async (itemId: string, newFlag: string) => {
    try {
      await axios.put(`/api/items/${itemId}`, { purchaseFlag: newFlag })
      fetchItems()
    } catch (error) {
      showToast('エラー', '購入フラグの更新に失敗しました', 'error')
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">画像</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">在庫数</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">適正在庫下限</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">購入フラグ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.minStock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.purchaseFlag}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => updatePurchaseFlag(item._id, item.purchaseFlag === '在庫あり' ? '要購入' : '在庫あり')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {item.purchaseFlag === '在庫あり' ? '要購入に変更' : '在庫ありに変更'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
