import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

// CUID-like ID generator
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

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
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    productName: {
      type: String,
      required: true,
    },
    image: String,
    orderUrl: String,
    barcode: String,
    purchaseStatus: {
      type: String,
      enum: ['在庫あり', '要購入', '注文済み'],
      default: '在庫あり',
    },
    description: String,
    yahooCheck: {
      type: Boolean,
      default: false,
    },
    check: String,
    purchaseLocation: {
      type: String,
      enum: ['生協', '週末買い物', 'ネット'],
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Virtual for stock status display
productSchema.virtual('stockDisplay').get(function() {
  const surplus = this.stockQuantity - this.minimumStock;
  return `在庫数 ${this.stockQuantity}${this.stockQuantity !== undefined ? ` (余裕 ${surplus}）` : ''}`;
});

// Ensure the model is only created once
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);
