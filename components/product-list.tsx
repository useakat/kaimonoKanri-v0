'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getProducts,
  updateStock,
  updatePurchaseStatus,
  deleteProduct,
  PurchaseStatus,
  type IProduct
} from '@/lib/api-client';

export function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<{
    purchaseStatus?: PurchaseStatus;
    lowStock?: boolean;
  }>({});

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts({ ...filter, search });
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, filter]);

  const handleUpdateStock = async (id: string, operation: 'increment' | 'decrement') => {
    try {
      await updateStock(id, operation);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: PurchaseStatus) => {
    try {
      await updatePurchaseStatus(id, status);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当にこの商品を削除しますか？')) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="search"
          placeholder="商品を検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant={filter.lowStock ? "default" : "outline"}
          onClick={() => setFilter(f => ({ ...f, lowStock: !f.lowStock }))}
        >
          在庫少
        </Button>
        <Button
          variant={filter.purchaseStatus === '要購入' ? "default" : "outline"}
          onClick={() => setFilter(f => ({
            ...f,
            purchaseStatus: f.purchaseStatus === '要購入' ? undefined : '要購入'
          }))}
        >
          要購入のみ
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)] rounded-md border">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full text-center">読み込み中...</div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center">商品が見つかりません</div>
          ) : (
            products.map((product) => (
              <Card key={product._id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{product.productName}</h3>
                    <p className="text-sm text-gray-500">{product.stockDisplay}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    削除
                  </Button>
                </div>

                {product.image && (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStock(product._id, 'decrement')}
                  >
                    -1
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStock(product._id, 'increment')}
                  >
                    +1
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={product.purchaseStatus === '在庫あり' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(product._id, '在庫あり')}
                  >
                    在庫あり
                  </Button>
                  <Button
                    size="sm"
                    variant={product.purchaseStatus === '要購入' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(product._id, '要購入')}
                  >
                    要購入
                  </Button>
                  <Button
                    size="sm"
                    variant={product.purchaseStatus === '注文済み' ? 'default' : 'outline'}
                    onClick={() => handleUpdateStatus(product._id, '注文済み')}
                  >
                    注文済み
                  </Button>
                </div>

                {product.orderUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(product.orderUrl, '_blank')}
                  >
                    注文ページへ
                  </Button>
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
