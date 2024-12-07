'use client'

import Image from 'next/image'
import { Minus, Plus, Pencil, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Product = {
  id: string
  name: string
  image: string
  stock: number
  minStock: number
  category: string
}

const products: Product[] = [
  {
    id: '1',
    name: '生協サラダ',
    image: '/placeholder.svg',
    stock: 4,
    minStock: 4,
    category: '生協',
  },
  {
    id: '2',
    name: '焼き魚',
    image: '/placeholder.svg',
    stock: 1,
    minStock: 2,
    category: '生協',
  },
  {
    id: '3',
    name: 'Vセブン',
    image: '/placeholder.svg',
    stock: 3,
    minStock: 1,
    category: '生協',
  },
  // Add more products as needed
]

export function ProductList() {
  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <Card key={product.id} className="p-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-md border">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p
                className={cn(
                  'text-sm',
                  product.stock < product.minStock ? 'text-red-500' : 'text-muted-foreground'
                )}
              >
                在庫数 {product.stock} (余裕 {product.stock - product.minStock})
              </p>
              <div className="text-xs text-muted-foreground">{product.category}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

