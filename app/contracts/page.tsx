'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ContractCard from '@/components/ContractCard'
import type { ContractRelease, ContractSearchResponse } from '@/lib/types'
import { formatNumber } from '@/lib/utils'

// Wrap the main page in Suspense so useSearchParams() works correctly
// with Next.js 14 App Router static generation
export default function ContractsPage() {
  return (
    <Suspense fallback={<ContractsPageSkeleton />}>
      <ContractsPageInner />
    </Suspense>
  )
}

// ---------------------------------------------------------------------------
// Stage filter options
// ---------------------------------------------------------------------------
type Stage = 'all' | 'tender' | 'award'

const STAGE_OPTIONS: { label: string; value: Stage }[] = [
  { label: 'all', value: 'all' },
  { label: 'tenders', value: 'tender' },
  { label: 'awards', value: 'award' },
]

const PAGE_SIZE = 20

// ---------------------------------------------------------------------------
// Main page component (uses useSearchParams, must be inside Suspense)
// ---------------------------------------------------------------------------
function ContractsPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // ---- Initialise state from URL query params ----
  const [keyword, setKeyword] = useState<string>(
    searchParams.get('keyword') ?? ''
  )
  const [stage, setStage] = useState<Stage>(
    (searchParams.get('stage') as Stage) ?? 'all'
  )
  const [publishedFrom, setPublishedFrom] = useState<string>(
    searchParams.get('publishedFrom') ?? ''
  )
  const [publishedTo, setPublishedTo] = useState<string>(
    searchParams.get('publishedTo') ?? ''
  )
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page') ?? 1)
  )

  // ---- Local search input (committed on submit / Enter) ----
  const [inputValue, setInputValue] = useState<string>(keyword)

  // ---- Results state ----
  const [results, setResults] = useState<ContractRelease[]>([])
  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Sync URL whenever active filter state changes (for shareability)
  // ---------------------------------------------------------------------------
  const syncUrl = useCallback(
    (
      kw: string,
      st: Stage,
      pg: number,
      from: string,
      to: string
    ) => {
      const params = new URLSearchParams()
      if (kw) params.set('keyword', kw)
      if (st !== 'all') params.set('stage', st)
      if (pg > 1) params.set('page', String(pg))
      if (from) params.set('publishedFrom', from)
      if (to) params.set('publishedTo', to)
      const qs = params.toString()
      router.replace(qs ? `/contracts?${qs}` : '/contracts', { scroll: false })
    },
    [router]
  )

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------
  const fetchContracts = useCallback(
    async (
      kw: string,
      st: Stage,
      pg: number,
      from: string,
      to: string
    ) => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: String(pg),
        size: String(PAGE_SIZE),
      })
      if (kw) params.set('keyword', kw)
      if (st !== 'all') params.set('stage', st)
      if (from) params.set('publishedFrom', from)
      if (to) params.set('publishedTo', to)

      try {
        const res = await fetch(`/api/contracts?${params.toString()}`)
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        const data: ContractSearchResponse = await res.json()
        setResults(data.releases ?? [])
        setTotal(data.total ?? 0)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load contracts'
        )
        setResults([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // Re-fetch whenever any committed filter changes
  useEffect(() => {
    fetchContracts(keyword, stage, page, publishedFrom, publishedTo)
    syncUrl(keyword, stage, page, publishedFrom, publishedTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, stage, page, publishedFrom, publishedTo])

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleStageChange = (newStage: Stage) => {
    setStage(newStage)
    setPage(1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setKeyword(inputValue.trim())
    setPage(1)
  }

  const handleDateChange =
    (field: 'publishedFrom' | 'publishedTo') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === 'publishedFrom') setPublishedFrom(e.target.value)
      else setPublishedTo(e.target.value)
      setPage(1)
    }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const hasResults = results.length > 0
  const startIndex = (page - 1) * PAGE_SIZE + 1
  const endIndex = Math.min(page * PAGE_SIZE, total)

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div>
      {/* ---- Page header ---- */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>contracts</h1>
          <p>
            search government procurement contracts from contracts finder.
            filter by stage, keyword, and date to find what you&apos;re looking for.
          </p>
        </div>
      </section>

      <div className="brand-motif-thick" />

      {/* ---- Filters bar ---- */}
      <section className="border-b-2 border-lfg-black bg-lfg-cream/30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:gap-6">

            {/* Stage pills */}
            <div>
              <p className="text-xs font-dm font-bold uppercase tracking-wider text-gray-500 mb-2">
                stage
              </p>
              <div
                className="flex gap-2 flex-wrap"
                role="group"
                aria-label="Filter by contract stage"
              >
                {STAGE_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => handleStageChange(value)}
                    aria-pressed={stage === value}
                    className={`filter-pill ${
                      stage === value ? 'filter-pill-active' : 'filter-pill-inactive'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyword search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex-1 min-w-0"
              role="search"
              aria-label="Search contracts by keyword"
            >
              <p className="text-xs font-dm font-bold uppercase tracking-wider text-gray-500 mb-2">
                keyword
              </p>
              <div className="flex gap-2">
                <input
                  type="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g. consultancy, IT, construction..."
                  aria-label="Search keyword"
                  className="flex-1 min-w-0 border-2 border-lfg-black px-4 py-2 text-sm font-dm
                             bg-white focus:outline-none focus:border-lfg-orange
                             placeholder:text-gray-400 transition-colors"
                />
                <button type="submit" className="btn-primary whitespace-nowrap py-2 px-4">
                  search
                </button>
              </div>
            </form>

            {/* Date range */}
            <div className="flex gap-3 flex-wrap md:flex-nowrap">
              <div>
                <label
                  htmlFor="publishedFrom"
                  className="block text-xs font-dm font-bold uppercase tracking-wider text-gray-500 mb-2"
                >
                  published from
                </label>
                <input
                  id="publishedFrom"
                  type="date"
                  value={publishedFrom}
                  onChange={handleDateChange('publishedFrom')}
                  aria-label="Published from date"
                  className="border-2 border-lfg-black px-3 py-2 text-sm font-dm bg-white
                             focus:outline-none focus:border-lfg-orange transition-colors"
                />
              </div>
              <div>
                <label
                  htmlFor="publishedTo"
                  className="block text-xs font-dm font-bold uppercase tracking-wider text-gray-500 mb-2"
                >
                  published to
                </label>
                <input
                  id="publishedTo"
                  type="date"
                  value={publishedTo}
                  onChange={handleDateChange('publishedTo')}
                  aria-label="Published to date"
                  className="border-2 border-lfg-black px-3 py-2 text-sm font-dm bg-white
                             focus:outline-none focus:border-lfg-orange transition-colors"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Results area ---- */}
      <main className="max-w-7xl mx-auto px-6 py-8" id="results">
        {/* Results meta row */}
        <div
          className="flex items-center justify-between mb-6 min-h-[28px]"
          aria-live="polite"
          aria-atomic="true"
        >
          {loading ? (
            <p className="text-sm font-dm text-gray-400">loading...</p>
          ) : error ? (
            <p className="text-sm font-dm text-red-600" role="alert">
              {error}
            </p>
          ) : (
            <p className="text-sm font-dm text-gray-500">
              {total === 0 ? (
                'no contracts found'
              ) : (
                <>
                  showing{' '}
                  <span className="font-bold text-lfg-black">
                    {formatNumber(startIndex)}–{formatNumber(endIndex)}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-lfg-black">
                    {formatNumber(total)}
                  </span>{' '}
                  contracts
                </>
              )}
            </p>
          )}

          {/* Clear filters shortcut */}
          {(keyword || stage !== 'all' || publishedFrom || publishedTo) && (
            <button
              onClick={() => {
                setKeyword('')
                setInputValue('')
                setStage('all')
                setPublishedFrom('')
                setPublishedTo('')
                setPage(1)
              }}
              className="text-xs font-dm font-bold text-gray-400 hover:text-lfg-orange
                         transition-colors underline underline-offset-2"
              aria-label="Clear all active filters"
            >
              clear filters
            </button>
          )}
        </div>

        {/* Error state */}
        {error && !loading && (
          <div
            className="stat-card border-l-4 border-l-red-500 mb-8"
            role="alert"
          >
            <p className="font-dm font-bold text-sm mb-1">
              something went wrong
            </p>
            <p className="font-dm text-sm text-gray-500">{error}</p>
            <button
              onClick={() =>
                fetchContracts(keyword, stage, page, publishedFrom, publishedTo)
              }
              className="btn-secondary mt-4 py-2 px-4 text-sm"
            >
              try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div
            className="grid grid-cols-1 gap-4"
            aria-label="Loading contracts"
            aria-busy="true"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="stat-card animate-pulse"
                aria-hidden="true"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-1" />
                <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
                <div className="flex gap-6">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && !hasResults && (
          <div className="stat-card text-center py-16">
            <p className="font-octarine text-2xl mb-2">no results</p>
            <p className="font-dm text-gray-500 text-sm max-w-sm mx-auto">
              try adjusting your keyword or date range, or clearing the stage
              filter.
            </p>
            <button
              onClick={() => {
                setKeyword('')
                setInputValue('')
                setStage('all')
                setPublishedFrom('')
                setPublishedTo('')
                setPage(1)
              }}
              className="btn-secondary mt-6 py-2 px-6 text-sm"
            >
              clear all filters
            </button>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && hasResults && (
          <>
            <ul
              className="grid grid-cols-1 gap-4"
              aria-label={`${formatNumber(total)} contracts found`}
            >
              {results.map((contract) => (
                <li key={contract.ocid}>
                  <ContractCard contract={contract} />
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex items-center justify-between mt-10 pt-6 border-t-2 border-lfg-black"
                aria-label="Pagination"
              >
                <button
                  onClick={() => {
                    const prev = Math.max(1, page - 1)
                    setPage(prev)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page <= 1}
                  aria-label="Go to previous page"
                  className={`btn-secondary py-2 px-5 text-sm ${
                    page <= 1
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}
                >
                  ← previous
                </button>

                <div className="text-sm font-dm text-gray-500 text-center">
                  <span className="font-bold text-lfg-black">{page}</span>
                  {' / '}
                  <span>{formatNumber(totalPages)}</span>
                </div>

                <button
                  onClick={() => {
                    const next = Math.min(totalPages, page + 1)
                    setPage(next)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  disabled={page >= totalPages}
                  aria-label="Go to next page"
                  className={`btn-primary py-2 px-5 text-sm ${
                    page >= totalPages
                      ? 'opacity-40 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}
                >
                  next →
                </button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fallback skeleton shown while the Suspense boundary resolves
// ---------------------------------------------------------------------------
function ContractsPageSkeleton() {
  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>contracts</h1>
          <p>search government procurement contracts from contracts finder.</p>
        </div>
      </section>
      <div className="brand-motif-thick" />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 gap-4 animate-pulse" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="stat-card">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-full mb-1" />
              <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
              <div className="flex gap-6">
                <div className="h-3 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
