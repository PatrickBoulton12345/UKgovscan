import { NextRequest, NextResponse } from 'next/server'
import { searchContracts } from '@/lib/api/contracts-finder'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const keyword = searchParams.get('keyword') || ''
  const stage = searchParams.get('stage') as 'tender' | 'award' | 'planning' | null
  const page = parseInt(searchParams.get('page') || '1')
  const size = parseInt(searchParams.get('size') || '20')
  const publishedFrom = searchParams.get('publishedFrom') || undefined
  const publishedTo = searchParams.get('publishedTo') || undefined
  const buyerName = searchParams.get('buyerName') || undefined
  const minValue = searchParams.get('minValue')
    ? parseInt(searchParams.get('minValue')!)
    : undefined
  const maxValue = searchParams.get('maxValue')
    ? parseInt(searchParams.get('maxValue')!)
    : undefined

  try {
    const data = await searchContracts({
      keyword,
      stage: stage || undefined,
      page,
      size,
      publishedFrom,
      publishedTo,
      buyerName,
      minValue,
      maxValue,
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error('Contracts API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}
