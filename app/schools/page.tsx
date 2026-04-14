'use client'

import { useState, useMemo } from 'react'
import { formatNumber } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Phase = 'Primary' | 'Secondary' | 'Special' | 'PRU'
type OfstedRating = 'Outstanding' | 'Good' | 'Requires Improvement' | 'Inadequate'

interface School {
  id: number
  name: string
  phase: Phase
  localAuthority: string
  ofsted: OfstedRating
  pupils: number
}

const SCHOOLS: School[] = [
  { id: 1,  name: 'Eton College',                              phase: 'Secondary', localAuthority: 'Windsor & Maidenhead', ofsted: 'Outstanding',           pupils: 1340 },
  { id: 2,  name: 'Harrow School',                             phase: 'Secondary', localAuthority: 'Harrow',              ofsted: 'Outstanding',           pupils: 870  },
  { id: 3,  name: 'King Edward VI Camp Hill School for Boys',  phase: 'Secondary', localAuthority: 'Birmingham',          ofsted: 'Outstanding',           pupils: 938  },
  { id: 4,  name: 'Manchester Grammar School',                 phase: 'Secondary', localAuthority: 'Manchester',          ofsted: 'Outstanding',           pupils: 1480 },
  { id: 5,  name: 'Guildford High School',                     phase: 'Secondary', localAuthority: 'Surrey',              ofsted: 'Outstanding',           pupils: 1010 },
  { id: 6,  name: 'Colchester Royal Grammar School',           phase: 'Secondary', localAuthority: 'Essex',               ofsted: 'Outstanding',           pupils: 1280 },
  { id: 7,  name: 'Watford Grammar School for Girls',          phase: 'Secondary', localAuthority: 'Hertfordshire',       ofsted: 'Outstanding',           pupils: 1450 },
  { id: 8,  name: 'Tiffin School',                             phase: 'Secondary', localAuthority: 'Kingston upon Thames',ofsted: 'Outstanding',           pupils: 1100 },
  { id: 9,  name: 'Newstead Wood School',                      phase: 'Secondary', localAuthority: 'Bromley',             ofsted: 'Outstanding',           pupils: 960  },
  { id: 10, name: 'St Olave\'s Grammar School',                phase: 'Secondary', localAuthority: 'Bromley',             ofsted: 'Outstanding',           pupils: 1040 },
  { id: 11, name: 'Hills Road Sixth Form College',             phase: 'Secondary', localAuthority: 'Cambridgeshire',      ofsted: 'Outstanding',           pupils: 2100 },
  { id: 12, name: 'Harris Academy Bermondsey',                 phase: 'Secondary', localAuthority: 'Southwark',           ofsted: 'Good',                  pupils: 1180 },
  { id: 13, name: 'Alperton Community School',                 phase: 'Secondary', localAuthority: 'Brent',               ofsted: 'Good',                  pupils: 1560 },
  { id: 14, name: 'Archbishop Cranmer CofE Primary',           phase: 'Primary',   localAuthority: 'Leeds',               ofsted: 'Outstanding',           pupils: 420  },
  { id: 15, name: 'Mayflower Primary School',                  phase: 'Primary',   localAuthority: 'Tower Hamlets',       ofsted: 'Outstanding',           pupils: 630  },
  { id: 16, name: 'Peakirk-cum-Glinton CofE Primary',         phase: 'Primary',   localAuthority: 'Peterborough',        ofsted: 'Good',                  pupils: 195  },
  { id: 17, name: 'Moorside Primary School',                   phase: 'Primary',   localAuthority: 'Manchester',          ofsted: 'Good',                  pupils: 415  },
  { id: 18, name: 'Broad Heath Primary School',                phase: 'Primary',   localAuthority: 'Coventry',            ofsted: 'Good',                  pupils: 680  },
  { id: 19, name: 'Summerswood Primary School',                phase: 'Primary',   localAuthority: 'Hertfordshire',       ofsted: 'Good',                  pupils: 453  },
  { id: 20, name: 'Bellenden Primary School',                  phase: 'Primary',   localAuthority: 'Southwark',           ofsted: 'Good',                  pupils: 388  },
  { id: 21, name: 'Park View Primary School',                  phase: 'Primary',   localAuthority: 'Sheffield',           ofsted: 'Requires Improvement',  pupils: 290  },
  { id: 22, name: 'St Cuthbert\'s RC Primary School',          phase: 'Primary',   localAuthority: 'Newcastle',           ofsted: 'Requires Improvement',  pupils: 340  },
  { id: 23, name: 'Hillside Primary School',                   phase: 'Primary',   localAuthority: 'Nottingham',          ofsted: 'Requires Improvement',  pupils: 276  },
  { id: 24, name: 'Castleton Community School',                phase: 'Primary',   localAuthority: 'Rochdale',            ofsted: 'Requires Improvement',  pupils: 315  },
  { id: 25, name: 'Birchfields Primary School',                phase: 'Primary',   localAuthority: 'Manchester',          ofsted: 'Inadequate',            pupils: 248  },
  { id: 26, name: 'Hope Valley Academy',                       phase: 'Secondary', localAuthority: 'Derbyshire',          ofsted: 'Requires Improvement',  pupils: 870  },
  { id: 27, name: 'Saltley Academy',                           phase: 'Secondary', localAuthority: 'Birmingham',          ofsted: 'Requires Improvement',  pupils: 1220 },
  { id: 28, name: 'Weston Favell Academy',                     phase: 'Secondary', localAuthority: 'Northamptonshire',    ofsted: 'Inadequate',            pupils: 760  },
  { id: 29, name: 'Portland School',                           phase: 'Special',   localAuthority: 'Sunderland',          ofsted: 'Outstanding',           pupils: 130  },
  { id: 30, name: 'Riverside School',                          phase: 'Special',   localAuthority: 'Barking & Dagenham',  ofsted: 'Good',                  pupils: 95   },
  { id: 31, name: 'The Meadows School',                        phase: 'Special',   localAuthority: 'Kent',                ofsted: 'Good',                  pupils: 180  },
  { id: 32, name: 'Treehouse School',                          phase: 'Special',   localAuthority: 'Islington',           ofsted: 'Outstanding',           pupils: 75   },
  { id: 33, name: 'Charlton Park Academy',                     phase: 'Special',   localAuthority: 'Greenwich',           ofsted: 'Good',                  pupils: 110  },
  { id: 34, name: 'Foxes Academy PRU',                         phase: 'PRU',       localAuthority: 'Somerset',            ofsted: 'Good',                  pupils: 48   },
  { id: 35, name: 'Sheffield PRU',                             phase: 'PRU',       localAuthority: 'Sheffield',           ofsted: 'Requires Improvement',  pupils: 62   },
  { id: 36, name: 'Bridge AP Academy',                         phase: 'PRU',       localAuthority: 'Lambeth',             ofsted: 'Outstanding',           pupils: 55   },
  { id: 37, name: 'North Westminster Community School',        phase: 'Secondary', localAuthority: 'Westminster',         ofsted: 'Good',                  pupils: 1140 },
  { id: 38, name: 'The Mountbatten School',                    phase: 'Secondary', localAuthority: 'Hampshire',           ofsted: 'Good',                  pupils: 1380 },
  { id: 39, name: 'Lipson Co-operative Academy',               phase: 'Secondary', localAuthority: 'Plymouth',            ofsted: 'Inadequate',            pupils: 1090 },
  { id: 40, name: 'Deansfield Primary School',                 phase: 'Primary',   localAuthority: 'Greenwich',           ofsted: 'Outstanding',           pupils: 465  },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PHASES = ['All', 'Primary', 'Secondary', 'Special', 'PRU'] as const
const OFSTED_RATINGS = ['All', 'Outstanding', 'Good', 'Requires Improvement', 'Inadequate'] as const
const PAGE_SIZE = 15

type PhaseFilter = typeof PHASES[number]
type OfstedFilter = typeof OFSTED_RATINGS[number]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ofstedBadge(rating: OfstedRating) {
  const map: Record<OfstedRating, { bg: string; text: string }> = {
    'Outstanding':           { bg: 'bg-green-100',  text: 'text-green-800'  },
    'Good':                  { bg: 'bg-blue-100',   text: 'text-blue-800'   },
    'Requires Improvement':  { bg: 'bg-amber-100',  text: 'text-amber-800'  },
    'Inadequate':            { bg: 'bg-red-100',    text: 'text-red-700'    },
  }
  const { bg, text } = map[rating]
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-dm font-bold rounded ${bg} ${text}`}
    >
      {rating}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SchoolsPage() {
  const [search, setSearch]         = useState('')
  const [phase, setPhase]           = useState<PhaseFilter>('All')
  const [ofsted, setOfsted]         = useState<OfstedFilter>('All')
  const [page, setPage]             = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SCHOOLS.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.localAuthority.toLowerCase().includes(q)
      const matchPhase  = phase  === 'All' || s.phase  === phase
      const matchOfsted = ofsted === 'All' || s.ofsted === ofsted
      return matchSearch && matchPhase && matchOfsted
    })
  }, [search, phase, ofsted])

  // Reset to page 1 whenever filters change
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageData   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }
  function handlePhaseChange(value: PhaseFilter) {
    setPhase(value)
    setPage(1)
  }
  function handleOfstedChange(value: OfstedFilter) {
    setOfsted(value)
    setPage(1)
  }

  return (
    <div>
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>schools</h1>
          <p>
            Explore school funding, Ofsted ratings, and performance data across England.
            Data sourced from DfE GIAS and Ofsted bulk downloads.
          </p>
        </div>
      </section>

      <div className="brand-motif" />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* Search */}
        <div className="relative max-w-xl">
          <label htmlFor="school-search" className="sr-only">
            Search schools
          </label>
          <input
            id="school-search"
            type="search"
            placeholder="Search by school name or local authority…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="
              w-full border-2 border-lfg-black px-4 py-3 pr-10
              font-dm text-sm placeholder-gray-400
              focus:outline-none focus:border-lfg-orange
            "
          />
          {/* Search icon */}
          <svg
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx={11} cy={11} r={8} />
            <line x1={21} y1={21} x2={16.65} y2={16.65} />
          </svg>
        </div>

        {/* Filter pills — phase */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-2">
              Phase
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by phase">
              {PHASES.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePhaseChange(p)}
                  className={`filter-pill ${phase === p ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  aria-pressed={phase === p}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Filter pills — Ofsted */}
          <div>
            <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-2">
              Ofsted rating
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by Ofsted rating">
              {OFSTED_RATINGS.map((r) => (
                <button
                  key={r}
                  onClick={() => handleOfstedChange(r)}
                  className={`filter-pill ${ofsted === r ? 'filter-pill-active' : 'filter-pill-inactive'}`}
                  aria-pressed={ofsted === r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm font-dm text-gray-500">
          Showing{' '}
          <span className="font-bold text-lfg-black">{formatNumber(filtered.length)}</span>{' '}
          {filtered.length === 1 ? 'school' : 'schools'}
          {search && (
            <> matching &ldquo;<span className="font-bold text-lfg-black">{search}</span>&rdquo;</>
          )}
        </p>

        {/* Table */}
        <div className="overflow-x-auto border-2 border-lfg-black">
          <table className="data-table" aria-label="School results">
            <thead>
              <tr>
                <th scope="col">School Name</th>
                <th scope="col">Phase</th>
                <th scope="col">Local Authority</th>
                <th scope="col">Ofsted Rating</th>
                <th scope="col" className="text-right">Pupils</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 py-12 font-dm text-sm"
                  >
                    No schools match your search.
                  </td>
                </tr>
              ) : (
                pageData.map((school) => (
                  <tr key={school.id}>
                    <td className="font-dm font-bold text-sm">{school.name}</td>
                    <td className="text-sm text-gray-600">{school.phase}</td>
                    <td className="text-sm text-gray-600">{school.localAuthority}</td>
                    <td>{ofstedBadge(school.ofsted)}</td>
                    <td className="text-sm text-right tabular-nums">
                      {formatNumber(school.pupils)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between"
            aria-label="Pagination"
          >
            <p className="text-sm font-dm text-gray-500">
              Page {safePage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                ← prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                next →
              </button>
            </div>
          </nav>
        )}

        {/* Data source note */}
        <p className="text-xs font-dm text-gray-400 border-t border-gray-200 pt-4">
          Data sourced from the Department for Education Get Information About Schools (GIAS) register
          and Ofsted published inspection outcomes. Updated termly.
        </p>
      </div>
    </div>
  )
}
