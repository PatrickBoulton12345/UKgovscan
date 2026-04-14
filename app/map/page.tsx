import type { Metadata } from 'next'
import type { ContractRelease, ContractSearchResponse } from '@/lib/types'
import MapPageClient from './MapPageClient'

export const metadata: Metadata = {
  title: 'Contract Map',
  description:
    'Explore UK government contracts geographically. See where public money is being spent across the country.',
}

async function fetchContracts(): Promise<ContractRelease[]> {
  try {
    // Absolute URL required for server-side fetch in Next.js App Router
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

    const res = await fetch(`${baseUrl}/api/contracts?size=50&stage=award`, {
      next: { revalidate: 300 }, // 5-minute ISR cache
    })

    if (!res.ok) return []
    const data: ContractSearchResponse = await res.json()
    return data.releases ?? []
  } catch {
    return []
  }
}

// The heavy client bundle (Leaflet) is loaded only when the browser renders
// the map page — never on the server.
export default async function MapPage() {
  const contracts = await fetchContracts()

  return (
    <div>
      {/* ------------------------------------------------------------------ */}
      {/* Page header                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-octarine lowercase">contract map</h1>
          <p className="font-dm">
            Explore UK government contracts geographically. Markers show where
            public money is being awarded — click any pin for details.
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Map + sidebar (client component handles all interactivity)          */}
      {/* ------------------------------------------------------------------ */}
      <MapPageClient contracts={contracts} />
    </div>
  )
}
