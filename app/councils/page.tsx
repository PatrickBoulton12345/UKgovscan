'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

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

interface Council {
  name: string
  region: Region
  type: CouncilType
}

const COUNCILS: Council[] = [
  // London Boroughs
  { name: 'Barnet', region: 'London', type: 'London Borough' },
  { name: 'Camden', region: 'London', type: 'London Borough' },
  { name: 'Hackney', region: 'London', type: 'London Borough' },
  { name: 'Hammersmith and Fulham', region: 'London', type: 'London Borough' },
  { name: 'Islington', region: 'London', type: 'London Borough' },
  { name: 'Lambeth', region: 'London', type: 'London Borough' },
  { name: 'Southwark', region: 'London', type: 'London Borough' },
  { name: 'Tower Hamlets', region: 'London', type: 'London Borough' },

  // Metropolitan
  { name: 'Birmingham', region: 'West Midlands', type: 'Metropolitan' },
  { name: 'Leeds', region: 'Yorkshire', type: 'Metropolitan' },
  { name: 'Manchester', region: 'North West', type: 'Metropolitan' },
  { name: 'Liverpool', region: 'North West', type: 'Metropolitan' },
  { name: 'Sheffield', region: 'Yorkshire', type: 'Metropolitan' },
  { name: 'Bradford', region: 'Yorkshire', type: 'Metropolitan' },
  { name: 'Coventry', region: 'West Midlands', type: 'Metropolitan' },
  { name: 'Newcastle upon Tyne', region: 'North East', type: 'Metropolitan' },
  { name: 'Sunderland', region: 'North East', type: 'Metropolitan' },
  { name: 'Wirral', region: 'North West', type: 'Metropolitan' },

  // Unitary
  { name: 'Bristol', region: 'South West', type: 'Unitary' },
  { name: 'Brighton and Hove', region: 'South East', type: 'Unitary' },
  { name: 'Milton Keynes', region: 'South East', type: 'Unitary' },
  { name: 'Reading', region: 'South East', type: 'Unitary' },
  { name: 'Plymouth', region: 'South West', type: 'Unitary' },
  { name: 'Derby', region: 'East Midlands', type: 'Unitary' },
  { name: 'Leicester', region: 'East Midlands', type: 'Unitary' },
  { name: 'Nottingham', region: 'East Midlands', type: 'Unitary' },
  { name: 'Peterborough', region: 'East', type: 'Unitary' },

  // County
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
  { name: 'Breckland', region: 'East', type: 'District' },
  { name: 'Cherwell', region: 'South East', type: 'District' },
  { name: 'Pendle', region: 'North West', type: 'District' },
  { name: 'South Cambridgeshire', region: 'East', type: 'District' },
  { name: 'Waverley', region: 'South East', type: 'District' },
]

const REGIONS: Array<'All' | Region> = [
  'All',
  'East',
  'East Midlands',
  'London',
  'North East',
  'North West',
  'South East',
  'South West',
  'West Midlands',
  'Yorkshire',
]

const TYPES: Array<'All' | CouncilType> = [
  'All',
  'County',
  'District',
  'London Borough',
  'Metropolitan',
  'Unitary',
]

// Accent border cycle
const ACCENTS = [
  'border-l-lfg-orange',
  'border-l-lfg-blue',
  'border-l-lfg-yellow',
] as const

// Badge styles per type
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
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>councils</h1>
          <p>
            Local authority finances, contracts, and transparency data across
            England. Explore spending and accountability by council type and region.
          </p>
        </div>
      </section>

      <div className="brand-motif" />

      {/* Context bar */}
      <section className="bg-lfg-cream/40 border-b-2 border-lfg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'councils shown', value: `${COUNCILS.length}+` },
              { label: 'council types', value: '5' },
              { label: 'regions', value: '9' },
              { label: 'data source', value: 'DLUHC' },
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

      {/* Filters and search */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <label htmlFor="council-search" className="sr-only">
                Search councils
              </label>
              <input
                id="council-search"
                type="search"
                placeholder="Search councils..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-2 border-lfg-black px-4 py-3 font-dm text-sm
                           focus:outline-none focus:border-lfg-orange placeholder-gray-400"
                aria-label="Filter councils by name"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                             hover:text-lfg-black transition-colors text-lg leading-none"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <div
              className="text-sm font-dm text-gray-500 flex items-center gap-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>
                {filtered.length === COUNCILS.length
                  ? `${COUNCILS.length} councils`
                  : `${filtered.length} of ${COUNCILS.length} councils`}
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-lfg-orange hover:underline font-bold text-xs"
                >
                  clear all
                </button>
              )}
            </div>
          </div>

          {/* Region filter */}
          <div>
            <p className="text-xs font-dm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Region
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by region"
            >
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`filter-pill ${regionFilter === r ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  aria-pressed={regionFilter === r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Type filter */}
          <div>
            <p className="text-xs font-dm font-bold text-gray-400 uppercase tracking-widest mb-2">
              Council type
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by council type"
            >
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`filter-pill ${typeFilter === t ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  aria-pressed={typeFilter === t}
                >
                  {t}
                </button>
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
              <Link
                key={council.name}
                href="#"
                className={`stat-card border-l-4 ${ACCENTS[i % ACCENTS.length]} group flex flex-col gap-3 no-underline`}
                aria-label={`${council.name} — ${council.type}, ${council.region}`}
              >
                {/* Name */}
                <h3 className="font-octarine text-base leading-snug group-hover:text-lfg-orange transition-colors">
                  {council.name.toLowerCase()}
                </h3>

                {/* Type badge */}
                <div>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-dm font-bold rounded-sm ${TYPE_BADGE[council.type]}`}
                  >
                    {council.type}
                  </span>
                </div>

                {/* Region */}
                <div className="text-xs font-dm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                  <span>{council.region}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-octarine text-2xl text-gray-300 mb-2">no results</p>
            <p className="text-sm font-dm text-gray-400 mb-4">
              No councils match your current filters.
            </p>
            <button onClick={resetFilters} className="btn-primary">
              clear filters
            </button>
          </div>
        )}

        {/* More coming note */}
        {filtered.length > 0 && (
          <p className="text-xs font-dm text-gray-400 text-center mt-10">
            Showing a representative selection. Full council directory coming soon.
          </p>
        )}
      </section>

      {/* Data source footer */}
      <section className="bg-lfg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-octarine mb-4">data sources</h2>
          <p className="text-sm font-dm text-gray-400 max-w-2xl leading-relaxed">
            Council data sourced from the{' '}
            <a
              href="https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lfg-blue hover:underline"
            >
              Department for Levelling Up, Housing and Communities
            </a>{' '}
            (DLUHC), the{' '}
            <a
              href="https://www.ons.gov.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lfg-blue hover:underline"
            >
              Office for National Statistics
            </a>
            , and local authority transparency publications. Population figures
            are approximate and based on ONS mid-year estimates. Published under
            the Open Government Licence v3.0.
          </p>
        </div>
      </section>
    </div>
  )
}
