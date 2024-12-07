export interface IProduct {
  _id: string;
  productName: string;
  image?: string;
  orderUrl?: string;
  barcode?: string;
  purchaseStatus: '在庫あり' | '要購入' | '注文済み';
  description?: string;
  yahooCheck: boolean;
  check?: string;
  purchaseLocation?: '生協' | '週末買い物' | 'ネット';
  stockQuantity: number;
  minimumStock: number;
  stockDisplay?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PurchaseStatus = '在庫あり' | '要購入' | '注文済み';
export type PurchaseLocation = '生協' | '週末買い物' | 'ネット';

export async function getProducts(filters?: {
  purchaseStatus?: PurchaseStatus;
  purchaseLocation?: PurchaseLocation;
  lowStock?: boolean;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.purchaseStatus) params.append('purchaseStatus', filters.purchaseStatus);
  if (filters?.purchaseLocation) params.append('purchaseLocation', filters.purchaseLocation);
  if (filters?.lowStock) params.append('lowStock', 'true');
  if (filters?.search) params.append('search', filters.search);

  const response = await fetch(`/api/products?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json() as Promise<IProduct[]>;
}

export async function createProduct(data: Partial<IProduct>) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json() as Promise<IProduct>;
}

export async function updateProduct(id: string, data: Partial<IProduct>) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function deleteProduct(id: string) {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
  return response.json();
}

export async function updateStock(id: string, operation: 'increment' | 'decrement', amount: number = 1) {
  const response = await fetch(`/api/products/${id}/update-stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation, amount }),
  });
  if (!response.ok) throw new Error('Failed to update stock');
  return response.json();
}

export async function updatePurchaseStatus(id: string, status: PurchaseStatus) {
  const response = await fetch(`/api/products/${id}/purchase-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update purchase status');
  return response.json();
}

export async function getOrderUrl(id: string) {
  const response = await fetch(`/api/products/${id}/order-url`);
  if (!response.ok) throw new Error('Failed to get order URL');
  return response.json() as Promise<{ order_url: string }>;
}
