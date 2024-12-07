import { ProductList } from '@/components/product-list'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">商品一覧</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
      <ProductList />
    </div>
  )
}

