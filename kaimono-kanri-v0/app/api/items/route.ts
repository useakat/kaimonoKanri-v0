import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const purchaseFlag = searchParams.get('purchaseFlag')

  try {
    const { db } = await connectToDatabase()
    const query = purchaseFlag ? { purchaseFlag } : {}
    const items = await db.collection('items').find(query).toArray()
    return NextResponse.json(items)
  } catch (error) {
    console.error('Failed to fetch items:', error)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const item = await request.json()
    const result = await db.collection('items').insertOne(item)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}

