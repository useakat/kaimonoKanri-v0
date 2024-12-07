import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models/product';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (!product.orderUrl) {
      return NextResponse.json(
        { error: 'Order URL not set for this product' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      order_url: product.orderUrl
    });
  } catch (error) {
    console.error('Error retrieving order URL:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order URL' },
      { status: 500 }
    );
  }
}
