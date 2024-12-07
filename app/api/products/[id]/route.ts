import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models/product';

// DELETE endpoint for removing a product
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}

// PUT endpoint for updating product details
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Remove any fields that shouldn't be updated directly
    const { _id, createdAt, updatedAt, ...updateData } = body;

    // Validate purchaseStatus if it's being updated
    if (updateData.purchaseStatus && 
        !['在庫あり', '要購入', '注文済み'].includes(updateData.purchaseStatus)) {
      return NextResponse.json(
        { error: 'Invalid purchase status' },
        { status: 400 }
      );
    }

    // Validate purchaseLocation if it's being updated
    if (updateData.purchaseLocation && 
        !['生協', '週末買い物', 'ネット'].includes(updateData.purchaseLocation)) {
      return NextResponse.json(
        { error: 'Invalid purchase location' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product_id: updatedProduct._id,
      updated_fields: updateData
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving a single product
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve product' },
      { status: 500 }
    );
  }
}
