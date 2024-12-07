'use client'

import { useState, useEffect } from 'react'
import * as Toast from '@radix-ui/react-toast'
import axios from 'axios'

export default function PurchaseList() {
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
      const response = await axios.get('/api/items?purchaseFlag=要購入')
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">購入リンク</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any) => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={item.purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    購入ページへ
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => updatePurchaseFlag(item._id, '注文済み')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    注文済みに変更
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
