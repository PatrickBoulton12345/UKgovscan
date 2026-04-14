'use client'

import { useState } from 'react'
import SearchBar from '@/components/SearchBar'

const PHASES = ['All', 'Primary', 'Secondary', 'Special', 'PRU'] as const
const RATINGS = ['All', 'Outstanding', 'Good', 'Requires Improvement', 'Inadequate'] as const

export default function SchoolsPage() {
  const [phase, setPhase] = useState('All')
  const [rating, setRating] = useState('All')

  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>schools</h1>
          <p>
            Explore school funding, Ofsted ratings, and performance data across
            England. Data sourced from DfE, GIAS, and Ofsted.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6 max-w-xl">
          <SearchBar
            placeholder="Search schools by name or local authority…"
            action="/schools"
            paramName="q"
          />
        </div>

        {/* Phase filter */}
        <div className="mb-4">
          <p className="text-sm font-dm font-bold text-gray-500 mb-2">Phase</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by phase">
            {PHASES.map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p)}
                className={`filter-pill ${phase === p ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                aria-pressed={phase === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Ofsted filter */}
        <div className="mb-8">
          <p className="text-sm font-dm font-bold text-gray-500 mb-2">Ofsted rating</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by Ofsted rating">
            {RATINGS.map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`filter-pill ${rating === r ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                aria-pressed={rating === r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div className="text-center py-16 border-2 border-dashed border-gray-200">
          <p className="font-octarine text-2xl text-gray-400 mb-3 lowercase">coming soon</p>
          <p className="font-dm text-gray-500 max-w-md mx-auto mb-6">
            This page will display live school data from the Department for Education
            (GIAS), Ofsted inspection ratings, and school funding allocations.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['GIAS (Get Information About Schools)', 'Ofsted', 'DfE School Census', 'DfE Funding Data'].map((source) => (
              <span key={source} className="text-xs font-dm font-bold px-3 py-1.5 bg-lfg-cream border border-gray-300">
                {source}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
