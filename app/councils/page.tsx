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
  population: string
}

const COUNCILS: Council[] = [
  // London Boroughs
  { name: 'Barnet', region: 'London', type: 'London Borough', population: '395,000' },
  { name: 'Camden', region: 'London', type: 'London Borough', population: '255,000' },
  { name: 'Hackney', region: 'London', type: 'London Borough', population: '281,000' },
  { name: 'Hammersmith and Fulham', region: 'London', type: 'London Borough', population: '185,000' },
  { name: 'Islington', region: 'London', type: 'London Borough', population: '245,000' },
  { name: 'Lambeth', region: 'London', type: 'London Borough', population: '317,000' },
  { name: 'Southwark', region: 'London', type: 'London Borough', population: '307,000' },
  { name: 'Tower Hamlets', region: 'London', type: 'London Borough', population: '310,000' },

  // Metropolitan
  { name: 'Birmingham', region: 'West Midlands', type: 'Metropolitan', population: '1,145,000' },
  { name: 'Leeds', region: 'Yorkshire', type: 'Metropolitan', population: '812,000' },
  { name: 'Manchester', region: 'North West', type: 'Metropolitan', population: '553,000' },
  { name: 'Liverpool', region: 'North West', type: 'Metropolitan', population: '496,800' },
  { name: 'Sheffield', region: 'Yorkshire', type: 'Metropolitan', population: '584,000' },
  { name: 'Bradford', region: 'Yorkshire', type: 'Metropolitan', population: '539,800' },
  { name: 'Coventry', region: 'West Midlands', type: 'Metropolitan', population: '367,000' },
  { name: 'Newcastle upon Tyne', region: 'North East', type: 'Metropolitan', population: '302,800' },
  { name: 'Sunderland', region: 'North East', type: 'Metropolitan', population: '277,000' },
  { name: 'Wirral', region: 'North West', type: 'Metropolitan', population: '320,800' },

  // Unitary
  { name: 'Bristol', region: 'South West', type: 'Unitary', population: '467,000' },
  { name: 'Brighton and Hove', region: 'South East', type: 'Unitary', population: '277,000' },
  { name: 'Milton Keynes', region: 'South East', type: 'Unitary', population: '270,000' },
  { name: 'Reading', region: 'South East', type: 'Unitary', population: '163,000' },
  { name: 'Plymouth', region: 'South West', type: 'Unitary', population: '262,000' },
  { name: 'Derby', region: 'East Midlands', type: 'Unitary', population: '257,000' },
  { name: 'Leicester', region: 'East Midlands', type: 'Unitary', population: '368,600' },
  { name: 'Nottingham', region: 'East Midlands', type: 'Unitary', population: '322,000' },
  { name: 'Peterborough', region: 'East', type: 'Unitary', population: '213,000' },

  // County
  { name: 'Kent', region: 'South East', type: 'County', population: '1,797,000' },
  { name: 'Essex', region: 'East', type: 'County', population: '1,478,000' },
  { name: 'Hampshire', region: 'South East', type: 'County', population: '1,345,000' },
  { name: 'Surrey', region: 'South East', type: 'County', population: '1,193,000' },
  { name: 'Lancashire', region: 'North West', type: 'County', population: '1,200,000' },
  { name: 'Suffolk', region: 'East', type: 'County', population: '756,000' },
  { name: 'Oxfordshire', region: 'South East', type: 'County', population: '688,000' },
  { name: 'Cambridgeshire', region: 'East', type: 'County', population: '656,000' },
  { name: 'Gloucestershire', region: 'South West', type: 'County', population: '643,000' },
  { name: 'Lincolnshire', region: 'East Midlands', type: 'County', population: '757,000' },
  { name: 'Staffordshire', region: 'West Midlands', type: 'County', population: '881,000' },
  { name: 'Norfolk', region: 'East', type: 'County', population: '906,000' },

  // District
  { name: 'Breckland', region: 'East', type: 'District', population: '136,000' },
  { name: 'Cherwell', region: 'South East', type: 'District', population: '148,000' },
  { name: 'Pendle', region: 'North West', type: 'District', population: '91,000' },
  { name: 'South Cambridgeshire', region: 'East', type: 'District', population: '160,000' },
  { name: 'Waverley', region: 'South East', type: 'District', population: '128,000' },
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

                {/* Region + population */}
                <div className="flex items-center justify-between text-xs font-dm text-gray-500 mt-auto pt-2 border-t border-gray-100">
                  <span>{council.region}</span>
                  <span className="tabular-nums">{council.population}</span>
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
