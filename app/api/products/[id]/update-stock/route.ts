import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models/product';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    const { operation, amount = 1 } = body;

    if (!operation || !['increment', 'decrement'].includes(operation)) {
      return NextResponse.json(
        { error: 'Invalid operation. Must be "increment" or "decrement"' },
        { status: 400 }
      );
    }

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updateValue = operation === 'increment' ? amount : -amount;
    const newStockValue = Math.max(0, product.stockQuantity + updateValue);

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          stockQuantity: newStockValue,
          purchaseStatus: newStockValue <= product.minimumStock ? '要購入' : '在庫あり'
        } 
      },
      { new: true }
    );

    return NextResponse.json({
      product_id: updatedProduct?._id,
      updated_stock: updatedProduct?.stockQuantity
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    );
  }
}
