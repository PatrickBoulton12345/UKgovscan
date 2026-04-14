'use client'

import { useState } from 'react'

const REGIONS = ['All', 'London', 'North West', 'Yorkshire & Humber', 'West Midlands', 'South East', 'South West', 'East Midlands', 'East of England', 'North East'] as const

export default function LeaderboardPage() {
  const [region, setRegion] = useState('All')

  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>leaderboard</h1>
          <p>
            Local authorities ranked by total government contract value,
            aggregated from Contracts Finder data.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Region filter */}
        <div className="mb-8">
          <p className="text-sm font-dm font-bold text-gray-500 mb-2">Filter by region</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`filter-pill ${region === r ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                aria-pressed={region === r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table header (ready for data) */}
        <div className="overflow-x-auto mb-8">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th>Local authority</th>
                <th>Region</th>
                <th>Contracts</th>
                <th>Total value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-16">
                  <p className="font-octarine text-2xl text-gray-400 mb-3 lowercase">coming soon</p>
                  <p className="font-dm text-gray-500 max-w-md mx-auto">
                    This table will show live contract data aggregated by local authority
                    from the Contracts Finder API, ranked by total procurement value.
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Data source note */}
        <div className="p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
          <p className="text-xs text-gray-500 font-dm">
            Rankings will be calculated from Contracts Finder data, aggregating
            contract awards by buyer organisation. Figures will be indicative and
            should be verified against original sources.
          </p>
        </div>
      </div>
    </div>
  )
}
