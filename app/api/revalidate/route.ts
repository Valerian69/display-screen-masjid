import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const path = body.path || '/'

    // Revalidate the specified path
    revalidatePath(path)

    // Also revalidate the home page specifically
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      message: `Cache revalidated for path: ${path}`
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { success: false, message: 'Revalidation failed' },
      { status: 500 }
    )
  }
}