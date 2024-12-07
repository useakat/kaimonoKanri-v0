'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { IProduct, PurchaseLocation, updateProduct } from '../lib/api-client';

interface EditProductFormProps {
  product: IProduct;
  onClose: () => void;
  onUpdate: () => void;
}

export function EditProductForm({ product, onClose, onUpdate }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    productName: product.productName,
    orderUrl: product.orderUrl || '',
    barcode: product.barcode || '',
    description: product.description || '',
    purchaseLocation: product.purchaseLocation as PurchaseLocation | '',
    minimumStock: product.minimumStock,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateData: Partial<IProduct> = {
        productName: formData.productName,
        orderUrl: formData.orderUrl || undefined,
        barcode: formData.barcode || undefined,
        description: formData.description || undefined,
        purchaseLocation: (formData.purchaseLocation || undefined) as PurchaseLocation | undefined,
        minimumStock: formData.minimumStock,
      };
      await updateProduct(product._id, updateData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">商品を編集</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">商品名</label>
            <Input
              value={formData.productName}
              onChange={(e) => setFormData(prev => ({ ...prev, productName: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">注文URL</label>
            <Input
              value={formData.orderUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, orderUrl: e.target.value }))}
              type="url"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">バーコード</label>
            <Input
              value={formData.barcode}
              onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">説明</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">購入場所</label>
            <select
              value={formData.purchaseLocation}
              onChange={(e) => setFormData(prev => ({ ...prev, purchaseLocation: e.target.value as PurchaseLocation | '' }))}
              className="w-full border rounded-md p-2"
            >
              <option value="">選択してください</option>
              <option value="生協">生協</option>
              <option value="週末買い物">週末買い物</option>
              <option value="ネット">ネット</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">最小在庫数</label>
            <Input
              type="number"
              value={formData.minimumStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: parseInt(e.target.value) }))}
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit">
              保存
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
