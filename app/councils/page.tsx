'use client'

import { useState, useMemo } from 'react'

type CouncilType =
  | 'County'
  | 'District'
  | 'Metropolitan'
  | 'Unitary'
  | 'London Borough'

type Region =
  | 'East'
  | 'West Midlands'
  | 'North West'
  | 'South East'
  | 'South West'
  | 'London'
  | 'North East'
  | 'Yorkshire'
  | 'East Midlands'

interface FlyTipping {
  incidents: number
  fpns: number
  rate: number // percentage
}

interface Council {
  name: string
  region: Region
  type: CouncilType
  flyTipping?: FlyTipping
}

const COUNCILS: Council[] = [
  // London Boroughs
  { name: 'Barnet', region: 'London', type: 'London Borough', flyTipping: { incidents: 6938, fpns: 409, rate: 5.90 } },
  { name: 'Camden', region: 'London', type: 'London Borough', flyTipping: { incidents: 36216, fpns: 1169, rate: 3.23 } },
  { name: 'Croydon', region: 'London', type: 'London Borough', flyTipping: { incidents: 53268, fpns: 23, rate: 0.04 } },
  { name: 'Ealing', region: 'London', type: 'London Borough', flyTipping: { incidents: 25394, fpns: 2429, rate: 9.57 } },
  { name: 'Enfield', region: 'London', type: 'London Borough', flyTipping: { incidents: 9218, fpns: 4712, rate: 51.12 } },
  { name: 'Hackney', region: 'London', type: 'London Borough', flyTipping: { incidents: 31042, fpns: 106, rate: 0.34 } },
  { name: 'Hammersmith and Fulham', region: 'London', type: 'London Borough', flyTipping: { incidents: 8087, fpns: 2164, rate: 26.76 } },
  { name: 'Hounslow', region: 'London', type: 'London Borough', flyTipping: { incidents: 25177, fpns: 4, rate: 0.02 } },
  { name: 'Islington', region: 'London', type: 'London Borough', flyTipping: { incidents: 3330, fpns: 772, rate: 23.18 } },
  { name: 'Lambeth', region: 'London', type: 'London Borough', flyTipping: { incidents: 21220, fpns: 925, rate: 4.36 } },
  { name: 'Lewisham', region: 'London', type: 'London Borough', flyTipping: { incidents: 33471, fpns: 748, rate: 2.23 } },
  { name: 'Newham', region: 'London', type: 'London Borough', flyTipping: { incidents: 26502, fpns: 14502, rate: 54.72 } },
  { name: 'Southwark', region: 'London', type: 'London Borough', flyTipping: { incidents: 18530, fpns: 555, rate: 3.00 } },
  { name: 'Tower Hamlets', region: 'London', type: 'London Borough', flyTipping: { incidents: 6029, fpns: 426, rate: 7.07 } },
  { name: 'Wandsworth', region: 'London', type: 'London Borough', flyTipping: { incidents: 5580, fpns: 1828, rate: 32.76 } },
  { name: 'Westminster', region: 'London', type: 'London Borough', flyTipping: { incidents: 20047, fpns: 2522, rate: 12.58 } },
  { name: 'Brent', region: 'London', type: 'London Borough', flyTipping: { incidents: 16338, fpns: 3655, rate: 22.37 } },
  { name: 'Waltham Forest', region: 'London', type: 'London Borough', flyTipping: { incidents: 10246, fpns: 2755, rate: 26.89 } },
  { name: 'Kensington and Chelsea', region: 'London', type: 'London Borough', flyTipping: { incidents: 7613, fpns: 2163, rate: 28.41 } },

  // Metropolitan
  { name: 'Birmingham', region: 'West Midlands', type: 'Metropolitan', flyTipping: { incidents: 24664, fpns: 153, rate: 0.62 } },
  { name: 'Leeds', region: 'Yorkshire', type: 'Metropolitan', flyTipping: { incidents: 13923, fpns: 83, rate: 0.60 } },
  { name: 'Manchester', region: 'North West', type: 'Metropolitan', flyTipping: { incidents: 14963, fpns: 992, rate: 6.63 } },
  { name: 'Liverpool', region: 'North West', type: 'Metropolitan', flyTipping: { incidents: 20300, fpns: 0, rate: 0.00 } },
  { name: 'Sheffield', region: 'Yorkshire', type: 'Metropolitan', flyTipping: { incidents: 12237, fpns: 129, rate: 1.05 } },
  { name: 'Bradford', region: 'Yorkshire', type: 'Metropolitan', flyTipping: { incidents: 19697, fpns: 91, rate: 0.46 } },
  { name: 'Coventry', region: 'West Midlands', type: 'Metropolitan', flyTipping: { incidents: 7188, fpns: 199, rate: 2.77 } },
  { name: 'Newcastle upon Tyne', region: 'North East', type: 'Metropolitan', flyTipping: { incidents: 16731, fpns: 157, rate: 0.94 } },
  { name: 'Sunderland', region: 'North East', type: 'Metropolitan', flyTipping: { incidents: 9481, fpns: 95, rate: 1.00 } },
  { name: 'Wirral', region: 'North West', type: 'Metropolitan', flyTipping: { incidents: 7977, fpns: 0, rate: 0.00 } },
  { name: 'Sandwell', region: 'West Midlands', type: 'Metropolitan', flyTipping: { incidents: 12542, fpns: 28, rate: 0.22 } },

  // Unitary
  { name: 'Bristol', region: 'South West', type: 'Unitary', flyTipping: { incidents: 10266, fpns: 217, rate: 2.11 } },
  { name: 'Brighton and Hove', region: 'South East', type: 'Unitary', flyTipping: { incidents: 1627, fpns: 390, rate: 23.97 } },
  { name: 'Milton Keynes', region: 'South East', type: 'Unitary', flyTipping: { incidents: 4258, fpns: 115, rate: 2.70 } },
  { name: 'Reading', region: 'South East', type: 'Unitary', flyTipping: { incidents: 2229, fpns: 221, rate: 9.91 } },
  { name: 'Plymouth', region: 'South West', type: 'Unitary', flyTipping: { incidents: 5370, fpns: 281, rate: 5.23 } },
  { name: 'Derby', region: 'East Midlands', type: 'Unitary', flyTipping: { incidents: 6477, fpns: 182, rate: 2.81 } },
  { name: 'Leicester', region: 'East Midlands', type: 'Unitary', flyTipping: { incidents: 6966, fpns: 230, rate: 3.30 } },
  { name: 'Nottingham', region: 'East Midlands', type: 'Unitary', flyTipping: { incidents: 26138, fpns: 973, rate: 3.72 } },
  { name: 'Peterborough', region: 'East', type: 'Unitary', flyTipping: { incidents: 10474, fpns: 247, rate: 2.36 } },
  { name: 'Stoke-on-Trent', region: 'West Midlands', type: 'Unitary', flyTipping: { incidents: 5893, fpns: 2109, rate: 35.79 } },
  { name: 'Luton', region: 'East', type: 'Unitary', flyTipping: { incidents: 11599, fpns: 144, rate: 1.24 } },
  { name: 'Southampton', region: 'South East', type: 'Unitary', flyTipping: { incidents: 12208, fpns: 38, rate: 0.31 } },
  { name: 'Thurrock', region: 'East', type: 'Unitary', flyTipping: { incidents: 3037, fpns: 1112, rate: 36.62 } },

  // County (no fly tipping data — waste is handled at district level)
  { name: 'Kent', region: 'South East', type: 'County' },
  { name: 'Essex', region: 'East', type: 'County' },
  { name: 'Hampshire', region: 'South East', type: 'County' },
  { name: 'Surrey', region: 'South East', type: 'County' },
  { name: 'Lancashire', region: 'North West', type: 'County' },
  { name: 'Suffolk', region: 'East', type: 'County' },
  { name: 'Oxfordshire', region: 'South East', type: 'County' },
  { name: 'Cambridgeshire', region: 'East', type: 'County' },
  { name: 'Gloucestershire', region: 'South West', type: 'County' },
  { name: 'Lincolnshire', region: 'East Midlands', type: 'County' },
  { name: 'Staffordshire', region: 'West Midlands', type: 'County' },
  { name: 'Norfolk', region: 'East', type: 'County' },

  // District
  { name: 'Breckland', region: 'East', type: 'District', flyTipping: { incidents: 830, fpns: 24, rate: 2.89 } },
  { name: 'Cherwell', region: 'South East', type: 'District', flyTipping: { incidents: 1332, fpns: 29, rate: 2.18 } },
  { name: 'Pendle', region: 'North West', type: 'District', flyTipping: { incidents: 6186, fpns: 81, rate: 1.31 } },
  { name: 'South Cambridgeshire', region: 'East', type: 'District', flyTipping: { incidents: 943, fpns: 47, rate: 4.98 } },
  { name: 'Waverley', region: 'South East', type: 'District', flyTipping: { incidents: 715, fpns: 1, rate: 0.14 } },
  { name: 'New Forest', region: 'South East', type: 'District', flyTipping: { incidents: 1361, fpns: 852, rate: 62.60 } },
  { name: 'Boston', region: 'East Midlands', type: 'District', flyTipping: { incidents: 4687, fpns: 67, rate: 1.43 } },
]

function rateColour(rate: number): string {
  if (rate >= 20) return 'text-green-600'
  if (rate >= 5) return 'text-lfg-orange'
  if (rate > 0) return 'text-red-500'
  return 'text-red-700'
}

const REGIONS: Array<'All' | Region> = [
  'All', 'East', 'East Midlands', 'London', 'North East', 'North West',
  'South East', 'South West', 'West Midlands', 'Yorkshire',
]

const TYPES: Array<'All' | CouncilType> = [
  'All', 'County', 'District', 'London Borough', 'Metropolitan', 'Unitary',
]

const ACCENTS = ['border-l-lfg-orange', 'border-l-lfg-blue', 'border-l-lfg-yellow'] as const

const TYPE_BADGE: Record<CouncilType, string> = {
  County: 'bg-lfg-orange/10 text-lfg-orange border border-lfg-orange/30',
  District: 'bg-gray-100 text-gray-600 border border-gray-200',
  Metropolitan: 'bg-lfg-blue/10 text-teal-700 border border-lfg-blue/30',
  Unitary: 'bg-lfg-yellow/10 text-amber-700 border border-lfg-yellow/30',
  'London Borough': 'bg-lfg-black/5 text-lfg-black border border-lfg-black/20',
}

export default function CouncilsPage() {
  const [query, setQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<'All' | Region>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | CouncilType>('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COUNCILS.filter((c) => {
      const matchesQuery = !q || c.name.toLowerCase().includes(q)
      const matchesRegion = regionFilter === 'All' || c.region === regionFilter
      const matchesType = typeFilter === 'All' || c.type === typeFilter
      return matchesQuery && matchesRegion && matchesType
    })
  }, [query, regionFilter, typeFilter])

  const hasActiveFilters = regionFilter !== 'All' || typeFilter !== 'All' || query.trim() !== ''

  function resetFilters() {
    setQuery('')
    setRegionFilter('All')
    setTypeFilter('All')
  }

  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>councils</h1>
          <p>
            Local authority fly tipping enforcement across England. How many
            incidents result in a Fixed Penalty Notice?
          </p>
        </div>
      </section>

      <div className="brand-motif" />

      {/* Context bar */}
      <section className="bg-lfg-cream/40 border-b-2 border-lfg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'councils shown', value: String(COUNCILS.length) },
              { label: 'council types', value: '5' },
              { label: 'regions', value: '9' },
              { label: 'data source', value: 'DEFRA' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="stat-card p-4 border-l-4 border-l-lfg-blue text-center"
              >
                <p className="font-octarine text-2xl text-lfg-orange">{stat.value}</p>
                <p className="text-xs font-dm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <label htmlFor="council-search" className="sr-only">Search councils</label>
              <input
                id="council-search"
                type="search"
                placeholder="Search councils..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-2 border-lfg-black px-4 py-3 font-dm text-sm focus:outline-none focus:border-lfg-orange placeholder-gray-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-lfg-black text-lg" aria-label="Clear search">×</button>
              )}
            </div>
            <div className="text-sm font-dm text-gray-500 flex items-center gap-2" aria-live="polite">
              <span>{filtered.length === COUNCILS.length ? `${COUNCILS.length} councils` : `${filtered.length} of ${COUNCILS.length} councils`}</span>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-lfg-orange hover:underline font-bold text-xs">clear all</button>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-dm font-bold text-gray-400 uppercase tracking-widest mb-2">Region</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by region">
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegionFilter(r)} className={`filter-pill ${regionFilter === r ? 'filter-pill-active' : 'filter-pill-inactive'}`} aria-pressed={regionFilter === r}>{r}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-dm font-bold text-gray-400 uppercase tracking-widest mb-2">Council type</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by council type">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`filter-pill ${typeFilter === t ? 'filter-pill-active' : 'filter-pill-inactive'}`} aria-pressed={typeFilter === t}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Council grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((council, i) => (
              <a
                key={council.name}
                href={`/contracts?keyword=${encodeURIComponent(council.name)}`}
                className={`stat-card border-l-4 ${ACCENTS[i % ACCENTS.length]} group flex flex-col gap-2 no-underline text-inherit`}
                aria-label={`${council.name} — view contracts`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-octarine text-base leading-snug group-hover:text-lfg-orange transition-colors">
                      {council.name.toLowerCase()}
                    </h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-dm font-bold rounded-sm ${TYPE_BADGE[council.type]}`}>
                      {council.type}
                    </span>
                    <p className="text-xs font-dm text-gray-400 mt-1">{council.region}</p>
                  </div>

                  {council.flyTipping && (
                    <div className="text-right shrink-0">
                      <p className={`font-octarine text-3xl leading-none ${rateColour(council.flyTipping.rate)}`}>
                        {council.flyTipping.rate.toFixed(1)}%
                      </p>
                      <p className="text-xs font-dm text-gray-400 mt-1">FPN rate</p>
                    </div>
                  )}
                </div>

                {council.flyTipping ? (
                  <p className="text-xs font-dm text-gray-300">
                    {council.flyTipping.fpns.toLocaleString()} FPNs from {council.flyTipping.incidents.toLocaleString()} fly tipping incidents
                  </p>
                ) : (
                  <p className="text-xs font-dm text-gray-300 italic">
                    Fly tipping data not available (county level)
                  </p>
                )}

                <div className="flex items-center justify-end text-xs font-dm mt-auto pt-2 border-t border-gray-100">
                  <span className="text-lfg-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    view contracts →
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-octarine text-2xl text-gray-300 mb-2">no results</p>
            <p className="text-sm font-dm text-gray-400 mb-4">No councils match your current filters.</p>
            <button onClick={resetFilters} className="btn-primary">clear filters</button>
          </div>
        )}

        {/* Data source */}
        <div className="mt-8 p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
          <p className="text-xs text-gray-500 font-dm">
            Fly tipping data sourced from DEFRA. FPN = Fixed Penalty Notice.
            A higher percentage means the council is more actively enforcing
            against fly tipping. County councils are excluded as waste collection
            is handled at district level. Council names and types are factual.
          </p>
        </div>
      </section>
    </div>
  )
}
