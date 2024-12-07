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
    const { status } = body;

    if (!status || !['在庫あり', '要購入', '注文済み'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "在庫あり", "要購入", or "注文済み"' },
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

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: { purchaseStatus: status } },
      { new: true }
    );

    return NextResponse.json({
      product_id: updatedProduct?._id,
      purchase_status: updatedProduct?.purchaseStatus
    });
  } catch (error) {
    console.error('Error updating purchase status:', error);
    return NextResponse.json(
      { error: 'Failed to update purchase status' },
      { status: 500 }
    );
  }
}
