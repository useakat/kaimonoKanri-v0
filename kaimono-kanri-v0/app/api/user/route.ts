import { NextResponse } from 'next/server'
import { connectToDatabase } from '../../../lib/mongodb'

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection('users').findOne({})
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user settings' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const updates = await request.json()
    const result = await db.collection('users').updateOne({}, { $set: updates }, { upsert: true })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user settings' }, { status: 500 })
  }
}

