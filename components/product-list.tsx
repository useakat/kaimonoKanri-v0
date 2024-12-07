'use client';

import { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  getProducts,
  updateStock,
  deleteProduct,
  PurchaseStatus,
  PurchaseLocation,
  type IProduct
} from '../lib/api-client';
import { EditProductForm } from './edit-product-form';

interface ProductListProps {
  initialFilters?: {
    purchaseStatus?: PurchaseStatus;
    purchaseLocation?: PurchaseLocation;
    lowStock?: boolean;
  };
  search?: string;
}

export function ProductList({ initialFilters, search = '' }: ProductListProps) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    purchaseStatus?: PurchaseStatus;
    purchaseLocation?: PurchaseLocation;
    lowStock?: boolean;
  }>(initialFilters || {});
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

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

  useEffect(() => {
    if (initialFilters) {
      setFilter(initialFilters);
    }
  }, [initialFilters]);

  const handleUpdateStock = async (id: string, operation: 'increment' | 'decrement') => {
    try {
      await updateStock(id, operation);
      fetchProducts();
    } catch (error) {
      console.error('Failed to update stock:', error);
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

  const getStatusColor = (status: PurchaseStatus) => {
    switch (status) {
      case '在庫あり':
        return 'bg-green-100 text-green-800';
      case '要購入':
        return 'bg-red-100 text-red-800';
      case '注文済み':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">読み込み中...</div>
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-8">商品が見つかりません</div>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold">{product.productName}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{product.stockDisplay}</p>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStock(product._id, 'decrement')}
                        className="h-6 w-6 p-0 text-lg font-medium"
                      >
                        -
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStock(product._id, 'increment')}
                        className="h-6 w-6 p-0 text-lg font-medium"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  {product.purchaseLocation && (
                    <p className="text-sm text-gray-500">購入先: {product.purchaseLocation}</p>
                  )}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.purchaseStatus)}`}>
                    {product.purchaseStatus}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    編集
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    削除
                  </Button>
                </div>
              </div>

              {product.image && (
                <img
                  src={product.image}
                  alt={product.productName}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}

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

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={fetchProducts}
        />
      )}
    </div>
  );
}
