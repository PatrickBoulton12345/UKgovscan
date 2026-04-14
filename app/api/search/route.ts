import { NextRequest, NextResponse } from 'next/server'
import { searchContracts } from '@/lib/api/contracts-finder'
import type { SearchResult } from '@/lib/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json(
      { error: 'Provide a search query' },
      { status: 400 }
    )
  }

  try {
    const results: SearchResult[] = []

    // Search contracts
    const contracts = await searchContracts({
      keyword: query,
      size: 10,
      page: 1,
    })

    for (const release of contracts.releases) {
      const value =
        release.awards?.[0]?.value?.amount ??
        release.tender?.value?.amount
      results.push({
        type: 'contract',
        title: release.tender?.title || 'Untitled contract',
        subtitle: release.buyer?.name || 'Unknown buyer',
        value: value,
        url: `/contracts?ocid=${release.ocid}`,
        meta: {
          status: release.tender?.status || 'unknown',
          date: release.publishedDate,
        },
      })
    }

    // Try Companies House search (may fail if key not set)
    try {
      const companiesRes = await fetch(
        `${request.nextUrl.origin}/api/companies?q=${encodeURIComponent(query)}`
      )
      if (companiesRes.ok) {
        const companiesData = await companiesRes.json()
        for (const company of (companiesData.items || []).slice(0, 5)) {
          results.push({
            type: 'company',
            title: company.title,
            subtitle: company.address_snippet || '',
            url: `/search?company=${company.company_number}`,
            meta: {
              status: company.company_status,
              number: company.company_number,
              created: company.date_of_creation,
            },
          })
        }
      }
    } catch {
      // Companies House not configured yet — skip silently
    }

    return NextResponse.json({
      results,
      total: results.length,
      query,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
