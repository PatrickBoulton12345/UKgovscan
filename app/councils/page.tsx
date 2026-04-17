'use client'

import { useState, useMemo } from 'react'
import { COUNCILS, REGIONS, TYPES, TYPE_BADGE, rateColour } from '@/lib/councils-data'

const ACCENTS = ['border-l-lfg-orange', 'border-l-lfg-blue', 'border-l-lfg-yellow'] as const

export default function CouncilsPage() {
  const [query, setQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')

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

      <section className="bg-lfg-cream/40 border-b-2 border-lfg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'councils shown', value: String(COUNCILS.length) },
              { label: 'council types', value: '5' },
              { label: 'regions', value: '9' },
              { label: 'data source', value: 'DEFRA' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card p-4 border-l-4 border-l-lfg-blue text-center">
                <p className="font-octarine text-2xl text-lfg-orange">{stat.value}</p>
                <p className="text-xs font-dm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            <div className="flex flex-wrap gap-2" role="group">
              {REGIONS.map((r) => (
                <button key={r} onClick={() => setRegionFilter(r)} className={`filter-pill ${regionFilter === r ? 'filter-pill-active' : 'filter-pill-inactive'}`} aria-pressed={regionFilter === r}>{r}</button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-dm font-bold text-gray-400 uppercase tracking-widest mb-2">Council type</p>
            <div className="flex flex-wrap gap-2" role="group">
              {TYPES.map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`filter-pill ${typeFilter === t ? 'filter-pill-active' : 'filter-pill-inactive'}`} aria-pressed={typeFilter === t}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((council, i) => (
              <a
                key={council.slug}
                href={`/councils/${council.slug}`}
                className={`stat-card border-l-4 ${ACCENTS[i % ACCENTS.length]} group flex flex-col gap-2 no-underline text-inherit`}
                aria-label={`${council.name} — view at a glance`}
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
                  <p className="text-xs font-dm text-gray-300 italic">Fly tipping data not available (county level)</p>
                )}

                <div className="flex items-center justify-end text-xs font-dm mt-auto pt-2 border-t border-gray-100">
                  <span className="text-lfg-orange font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    at a glance →
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

        <div className="mt-8 p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
          <p className="text-xs text-gray-500 font-dm">
            Fly tipping data sourced from DEFRA. FPN = Fixed Penalty Notice.
            A higher percentage means the council is more actively enforcing
            against fly tipping. County councils are excluded as waste collection
            is handled at district level.
          </p>
        </div>
      </section>
    </div>
  )
}
