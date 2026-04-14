import type { ContractRelease } from '@/lib/types'

const BASE_URL = 'https://www.contractsfinder.service.gov.uk'

interface SearchParams {
  keyword?: string
  publishedFrom?: string
  publishedTo?: string
  stage?: 'tender' | 'award' | 'planning'
  buyerName?: string
  minValue?: number
  maxValue?: number
  page?: number
  size?: number
}

export async function searchContracts(params: SearchParams): Promise<{
  releases: ContractRelease[]
  total: number
}> {
  const searchBody: Record<string, unknown> = {
    searchCriteria: {
      keyword: params.keyword || '',
      stages: params.stage ? [params.stage] : ['tender', 'award'],
      ...(params.publishedFrom && {
        publishedFrom: params.publishedFrom,
      }),
      ...(params.publishedTo && {
        publishedTo: params.publishedTo,
      }),
      ...(params.buyerName && {
        buyerName: params.buyerName,
      }),
      ...(params.minValue !== undefined &&
        params.maxValue !== undefined && {
          valueFrom: params.minValue,
          valueTo: params.maxValue,
        }),
    },
    size: params.size || 20,
    page: params.page || 1,
  }

  const res = await fetch(
    `${BASE_URL}/Published/Notices/OCDS/Search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchBody),
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    throw new Error(`Contracts Finder API error: ${res.status}`)
  }

  const data = await res.json()

  const releases: ContractRelease[] = (data.releases || []).map(
    (r: Record<string, unknown>) => {
      const release = r as unknown as ContractRelease
      return release
    }
  )

  return {
    releases,
    total: data.total || releases.length,
  }
}

export async function getContract(
  ocid: string
): Promise<ContractRelease | null> {
  const res = await fetch(
    `${BASE_URL}/Published/Notices/OCDS/${encodeURIComponent(ocid)}`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.releases?.[0] ?? null
}
