import type { Metadata } from 'next'
import type { ContractRelease } from '@/lib/types'
import { searchContracts } from '@/lib/api/contracts-finder'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: 'Contract Map',
  description:
    'Explore UK government contracts geographically. See where public money is being spent across the country.',
}

// Force dynamic rendering so we always fetch fresh data
export const dynamic = 'force-dynamic'

async function fetchContracts(): Promise<ContractRelease[]> {
  try {
    const data = await searchContracts({ stage: 'award', size: 50, page: 1 })
    return data.releases ?? []
  } catch (e) {
    console.error('Map: failed to fetch contracts', e)
    return []
  }
}

export default async function MapPage() {
  const contracts = await fetchContracts()

  return (
    <div>
      <div className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-octarine lowercase">contract map</h1>
          <p className="font-dm">
            Explore UK government contracts geographically. Markers show where
            public money is being awarded — click any pin for details.
          </p>
        </div>
      </div>

      <MapPageClient contracts={contracts} />
    </div>
  )
}
