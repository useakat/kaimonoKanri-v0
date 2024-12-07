import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '../../../../lib/mongodb'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    const { id } = params
    const updates = await request.json()
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    )
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

