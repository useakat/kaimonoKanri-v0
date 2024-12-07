import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Product } from '@/lib/models/product';

// GET endpoint for listing all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const purchaseStatus = searchParams.get('purchaseStatus');
    const purchaseLocation = searchParams.get('purchaseLocation');
    const lowStock = searchParams.get('lowStock');
    const search = searchParams.get('search');

    // Build query
    const query: any = {};

    if (purchaseStatus) {
      query.purchaseStatus = purchaseStatus;
    }

    if (purchaseLocation) {
      query.purchaseLocation = purchaseLocation;
    }

    if (lowStock === 'true') {
      query.$expr = {
        $lte: ['$stockQuantity', '$minimumStock']
      };
    }

    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ updatedAt: -1 });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error retrieving products:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve products' },
      { status: 500 }
    );
  }
}

// POST endpoint for creating a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validate required fields
    if (!body.productName) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    // Validate purchaseStatus if provided
    if (body.purchaseStatus && 
        !['在庫あり', '要購入', '注文済み'].includes(body.purchaseStatus)) {
      return NextResponse.json(
        { error: 'Invalid purchase status' },
        { status: 400 }
      );
    }

    // Validate purchaseLocation if provided
    if (body.purchaseLocation && 
        !['生協', '週末買い物', 'ネット'].includes(body.purchaseLocation)) {
      return NextResponse.json(
        { error: 'Invalid purchase location' },
        { status: 400 }
      );
    }

    // Ensure numbers are valid
    if (body.stockQuantity !== undefined && body.stockQuantity < 0) {
      return NextResponse.json(
        { error: 'Stock quantity cannot be negative' },
        { status: 400 }
      );
    }

    if (body.minimumStock !== undefined && body.minimumStock < 0) {
      return NextResponse.json(
        { error: 'Minimum stock cannot be negative' },
        { status: 400 }
      );
    }

    const product = new Product(body);
    await product.save();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
