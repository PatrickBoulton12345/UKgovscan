'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import { formatCurrency, formatDate, getContractStatusColour } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SearchResultMeta {
  status?: string
  date?: string
  number?: string
  created?: string
}

interface SearchResult {
  type: 'contract' | 'company'
  title: string
  subtitle: string
  value?: number
  url: string
  meta?: SearchResultMeta
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-dm font-bold rounded-sm uppercase tracking-wide ${getContractStatusColour(status)}`}
    >
      {status}
    </span>
  )
}

function ContractResult({ result }: { result: SearchResult }) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="stat-card flex flex-col gap-2 hover:border-lfg-orange group block no-underline text-inherit"
      aria-label={`Contract: ${result.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-dm font-bold text-base leading-snug group-hover:text-lfg-orange transition-colors">
          {result.title}
        </h3>
        {result.value != null && (
          <span className="shrink-0 font-octarine text-lfg-orange text-lg leading-none">
            {formatCurrency(result.value)}
          </span>
        )}
      </div>

      {/* Buyer */}
      <p className="text-sm text-gray-600 font-dm">{result.subtitle}</p>

      {/* Metadata row */}
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        {result.meta?.status && (
          <StatusBadge status={result.meta.status} />
        )}
        {result.meta?.date && (
          <span className="text-xs text-gray-400 font-dm">
            {formatDate(result.meta.date)}
          </span>
        )}
      </div>
    </a>
  )
}

function CompanyResult({ result }: { result: SearchResult }) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="stat-card flex flex-col gap-2 hover:border-lfg-blue group block no-underline text-inherit"
      aria-label={`Company: ${result.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-dm font-bold text-base leading-snug group-hover:text-lfg-blue transition-colors">
          {result.title}
        </h3>
        {result.meta?.status && (
          <StatusBadge status={result.meta.status} />
        )}
      </div>

      {/* Address */}
      {result.subtitle && (
        <p className="text-sm text-gray-600 font-dm">{result.subtitle}</p>
      )}

      {/* Metadata row */}
      <div className="flex items-center gap-4 mt-1 flex-wrap">
        {result.meta?.number && (
          <span className="text-xs text-gray-500 font-dm">
            Company No. {result.meta.number}
          </span>
        )}
        {result.meta?.created && (
          <span className="text-xs text-gray-400 font-dm">
            Incorporated {formatDate(result.meta.created)}
          </span>
        )}
      </div>
    </a>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading results">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="stat-card animate-pulse"
          aria-hidden="true"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="text-center py-16 px-6">
      <p className="font-octarine text-2xl mb-2 text-gray-400">no results found</p>
      <p className="font-dm text-sm text-gray-500">
        No contracts or companies matched &ldquo;{query}&rdquo;. Try a broader search term.
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Results section — grouped by type
// ---------------------------------------------------------------------------

function ResultsSection({ data }: { data: SearchResponse }) {
  const contracts = data.results.filter((r) => r.type === 'contract')
  const companies = data.results.filter((r) => r.type === 'company')

  if (data.total === 0) {
    return <EmptyState query={data.query} />
  }

  return (
    <div className="space-y-12">
      {/* Result count */}
      <p className="font-dm text-sm text-gray-500" role="status">
        <span className="font-bold text-lfg-black">{data.total}</span>{' '}
        {data.total === 1 ? 'result' : 'results'} for &ldquo;
        <span className="font-bold">{data.query}</span>&rdquo;
      </p>

      {/* Contracts group */}
      {contracts.length > 0 && (
        <section aria-labelledby="contracts-heading">
          <div className="flex items-center gap-4 mb-4">
            <h2
              id="contracts-heading"
              className="font-octarine text-xl"
            >
              contracts
            </h2>
            <span className="bg-lfg-orange text-white text-xs font-dm font-bold px-2 py-0.5 border-2 border-lfg-black">
              {contracts.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {contracts.map((result, i) => (
              <ContractResult key={`contract-${i}`} result={result} />
            ))}
          </div>
        </section>
      )}

      {/* Companies group */}
      {companies.length > 0 && (
        <section aria-labelledby="companies-heading">
          <div className="flex items-center gap-4 mb-4">
            <h2
              id="companies-heading"
              className="font-octarine text-xl"
            >
              companies
            </h2>
            <span className="bg-lfg-blue text-white text-xs font-dm font-bold px-2 py-0.5 border-2 border-lfg-black">
              {companies.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {companies.map((result, i) => (
              <CompanyResult key={`company-${i}`} result={result} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inner component (needs useSearchParams — must be inside Suspense)
// ---------------------------------------------------------------------------

function SearchPageInner() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setData(null)
      setError(null)
      return
    }

    let cancelled = false

    async function fetchResults() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query.trim())}`
        )
        if (!res.ok) {
          throw new Error(`Search request failed (${res.status})`)
        }
        const json: SearchResponse = await res.json()
        if (!cancelled) {
          setData(json)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search failed')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchResults()

    return () => {
      cancelled = true
    }
  }, [query])

  return (
    <>
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>search</h1>
          <p>search contracts, companies, and public spending data</p>
        </div>
      </section>

      <div className="brand-motif" />

      {/* Search bar */}
      <div className="bg-lfg-cream/40 border-b-2 border-lfg-black py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <SearchBar large defaultValue={query} />
        </div>
      </div>

      {/* Results area */}
      <main className="max-w-4xl mx-auto px-6 py-12" id="results">
        {/* Idle — no query entered yet */}
        {!query && (
          <div className="text-center py-16">
            <p className="font-octarine text-2xl text-gray-400 mb-2">
              what are you looking for?
            </p>
            <p className="font-dm text-sm text-gray-500">
              Search across government contracts and registered companies.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="border-2 border-red-400 bg-red-50 p-6 text-center"
          >
            <p className="font-dm font-bold text-red-700 mb-1">
              Something went wrong
            </p>
            <p className="font-dm text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && data && <ResultsSection data={data} />}
      </main>
    </>
  )
}

// ---------------------------------------------------------------------------
// Page export — wraps inner in Suspense as required by Next.js for
// useSearchParams() in client components
// ---------------------------------------------------------------------------

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-12">
          <LoadingSkeleton />
        </div>
      }
    >
      <SearchPageInner />
    </Suspense>
  )
}
