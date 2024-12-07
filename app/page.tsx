'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ProductList } from '../components/product-list';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { createProduct, type PurchaseLocation } from '../lib/api-client';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showNewForm, setShowNewForm] = useState(false);
  const [search, setSearch] = useState('');
  const [newProduct, setNewProduct] = useState({
    productName: '',
    orderUrl: '',
    barcode: '',
    stockQuantity: 0,
    minimumStock: 0,
  });

  const status = searchParams.get('status');
  const lowStock = searchParams.get('lowStock') === 'true';
  const location = searchParams.get('location') as PurchaseLocation | null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setNewProduct({
        productName: '',
        orderUrl: '',
        barcode: '',
        stockQuantity: 0,
        minimumStock: 0,
      });
      setShowNewForm(false);
      // ProductList will automatically refresh due to its useEffect
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('商品の作成に失敗しました');
    }
  };

  const updateFilter = (key: string, value: string | null) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value === null) {
      current.delete(key);
    } else {
      current.set(key, value);
    }
    
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`${window.location.pathname}${query}`);
  };

  const toggleLocation = (loc: PurchaseLocation) => {
    updateFilter('location', location === loc ? null : loc);
  };

  return (
    <div className="h-full p-4 overflow-auto">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {status === '要購入' ? '要購入商品' :
             status === '注文済み' ? '注文済み商品' :
             lowStock ? '在庫少商品' :
             location === '生協' ? '生協で購入する商品' :
             location === '週末買い物' ? '週末買い物リスト' :
             location === 'ネット' ? 'ネットで購入する商品' :
             '商品一覧'}
          </h1>
          <Button onClick={() => setShowNewForm(!showNewForm)}>
            {showNewForm ? '閉じる' : '新規商品追加'}
          </Button>
        </div>

        <div className="mb-4">
          <Input
            type="search"
            placeholder="商品を検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-[300px]"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={status === '要購入' ? "default" : "outline"}
            onClick={() => updateFilter('status', status === '要購入' ? null : '要購入')}
            size="sm"
          >
            要購入のみ
          </Button>
          <Button
            variant={lowStock ? "default" : "outline"}
            onClick={() => updateFilter('lowStock', lowStock ? null : 'true')}
            size="sm"
          >
            在庫少
          </Button>
          <div className="h-6 w-px bg-gray-200" />
          <Button
            variant={location === '生協' ? "default" : "outline"}
            onClick={() => toggleLocation('生協')}
            size="sm"
          >
            生協
          </Button>
          <Button
            variant={location === '週末買い物' ? "default" : "outline"}
            onClick={() => toggleLocation('週末買い物')}
            size="sm"
          >
            週末買い物
          </Button>
          <Button
            variant={location === 'ネット' ? "default" : "outline"}
            onClick={() => toggleLocation('ネット')}
            size="sm"
          >
            ネット
          </Button>
        </div>

        {showNewForm && (
          <Card className="mb-6 p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">商品名 *</label>
                <Input
                  required
                  value={newProduct.productName}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="商品名を入力"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">注文URL</label>
                <Input
                  type="url"
                  value={newProduct.orderUrl}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, orderUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">バーコード</label>
                <Input
                  value={newProduct.barcode}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, barcode: e.target.value }))}
                  placeholder="バーコードを入力"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">在庫数</label>
                  <Input
                    type="number"
                    min="0"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">適正在庫下限</label>
                  <Input
                    type="number"
                    min="0"
                    value={newProduct.minimumStock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, minimumStock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                商品を追加
              </Button>
            </form>
          </Card>
        )}

        <ProductList
          initialFilters={{
            purchaseStatus: status as any,
            purchaseLocation: location as any,
            lowStock
          }}
          search={search}
        />
      </div>
    </div>
  );
}
