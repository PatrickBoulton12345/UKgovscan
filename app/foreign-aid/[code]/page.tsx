'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'

const DEVTRACKER_BASE = 'https://devtracker.fcdo.gov.uk'

interface Project {
  id: number
  iatiIdentifier: string
  title: string
  description?: string
  recipientCountryCode: string
  recipientCountryName: string
  sectorName: string | null
  activityStatus: string
  startDate: string | null
  endDate: string | null
  budgetGbp: number
  disbursementGbp: number
  commitmentGbp: number
}

interface ApiResponse {
  countryCode: string
  countryName: string
  total: number
  truncated?: boolean
  projects: Project[]
}

type SortField = 'budget' | 'disbursement' | 'title' | 'endDate' | 'status'

export default function CountryDetailPage() {
  const params = useParams<{ code: string }>()
  const code = (params?.code ?? '').toUpperCase()

  const [data, setData] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Implementation' | 'Closed'>('all')
  const [sortBy, setSortBy] = useState<SortField>('budget')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    if (!/^[A-Z]{2}$/.test(code)) {
      setError('Invalid country code')
      return
    }
    let cancelled = false
    fetch(`/api/aid-country?code=${code}`)
      .then((r) => r.json())
      .then((d: ApiResponse | { error: string }) => {
        if (cancelled) return
        if ('error' in d) setError(d.error)
        else setData(d)
      })
      .catch((e) => !cancelled && setError(String(e)))
    return () => {
      cancelled = true
    }
  }, [code])

  const filtered = useMemo(() => {
    if (!data) return []
    let list = data.projects
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.activityStatus === statusFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.sectorName?.toLowerCase().includes(q) ||
          p.iatiIdentifier?.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      let av: string | number = 0
      let bv: string | number = 0
      switch (sortBy) {
        case 'budget':
          av = a.budgetGbp ?? 0
          bv = b.budgetGbp ?? 0
          break
        case 'disbursement':
          av = a.disbursementGbp ?? 0
          bv = b.disbursementGbp ?? 0
          break
        case 'title':
          av = (a.title ?? '').toLowerCase()
          bv = (b.title ?? '').toLowerCase()
          break
        case 'endDate':
          av = a.endDate ?? ''
          bv = b.endDate ?? ''
          break
        case 'status':
          av = a.activityStatus ?? ''
          bv = b.activityStatus ?? ''
          break
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc'
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number)
    })
  }, [data, statusFilter, search, sortBy, sortDir])

  function toggleSort(field: SortField) {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir(field === 'title' ? 'asc' : 'desc')
    }
  }

  const sortIcon = (field: SortField) =>
    sortBy === field ? (sortDir === 'desc' ? '↓' : '↑') : '↕'

  const totalBudget = useMemo(
    () => (data?.projects ?? []).reduce((s, p) => s + (p.budgetGbp ?? 0), 0),
    [data]
  )
  const totalDisbursed = useMemo(
    () => (data?.projects ?? []).reduce((s, p) => s + (p.disbursementGbp ?? 0), 0),
    [data]
  )
  const activeCount = useMemo(
    () => (data?.projects ?? []).filter((p) => p.activityStatus === 'Implementation').length,
    [data]
  )

  const statusOptions = useMemo(() => {
    if (!data) return ['all'] as const
    const set = new Set(data.projects.map((p) => p.activityStatus).filter(Boolean))
    return ['all', ...Array.from(set)]
  }, [data])

  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/foreign-aid"
            className="font-dm text-sm text-gray-500 hover:text-lfg-orange transition-colors"
          >
            ← back to foreign aid
          </Link>
          <h1>
            {data?.countryName?.toLowerCase() ?? code.toLowerCase()}
          </h1>
          <p>
            All UK aid projects in {data?.countryName ?? code} reported via the
            International Aid Transparency Initiative (IATI). Click any project
            to view it on the official FCDO{' '}
            <a
              href={`${DEVTRACKER_BASE}/countries/${code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-lfg-orange"
            >
              DevTracker country page
            </a>
            .
          </p>
        </div>
      </section>

      <div className="brand-motif-thick" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="p-4 mb-6 bg-red-50 border-l-4 border-l-red-500 font-dm text-sm text-red-800">
            Could not load data for {code}: {error}
          </div>
        )}

        {!data && !error && (
          <div className="py-12 text-center font-dm text-gray-400">
            Loading projects for {code}…
          </div>
        )}

        {data && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="stat-card border-l-4 border-l-lfg-orange">
                <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
                  Projects
                </p>
                <p className="text-3xl font-octarine lowercase">
                  {data.projects.length.toLocaleString()}
                </p>
                <p className="text-xs font-dm text-gray-400 mt-1">
                  total in IATI
                </p>
              </div>
              <div className="stat-card border-l-4 border-l-lfg-green">
                <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
                  Active
                </p>
                <p className="text-3xl font-octarine lowercase">
                  {activeCount.toLocaleString()}
                </p>
                <p className="text-xs font-dm text-gray-400 mt-1">
                  in implementation
                </p>
              </div>
              <div className="stat-card border-l-4 border-l-lfg-yellow">
                <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
                  Total budgeted
                </p>
                <p className="text-3xl font-octarine lowercase">
                  {formatCurrency(totalBudget)}
                </p>
                <p className="text-xs font-dm text-gray-400 mt-1">
                  across all projects
                </p>
              </div>
              <div className="stat-card border-l-4 border-l-lfg-blue">
                <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
                  Total disbursed
                </p>
                <p className="text-3xl font-octarine lowercase">
                  {formatCurrency(totalDisbursed)}
                </p>
                <p className="text-xs font-dm text-gray-400 mt-1">
                  paid out to date
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project title, sector or IATI ID…"
                className="flex-1 border-2 border-lfg-black px-4 py-3 font-dm text-sm focus:outline-none focus:border-lfg-orange placeholder-gray-400"
              />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="border-2 border-lfg-black px-4 py-3 font-dm text-sm bg-white focus:outline-none focus:border-lfg-orange"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All statuses' : s}
                  </option>
                ))}
              </select>
            </div>

            <p className="font-dm text-xs text-gray-500 mb-3">
              Showing {filtered.length.toLocaleString()} of{' '}
              {data.projects.length.toLocaleString()} projects.
              {data.truncated &&
                ' (Result list capped at 3,000 — see DevTracker for the full list.)'}
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>
                      <button
                        onClick={() => toggleSort('title')}
                        className="flex items-center hover:text-lfg-orange"
                      >
                        Project <span className="ml-1">{sortIcon('title')}</span>
                      </button>
                    </th>
                    <th className="hidden md:table-cell">Sector</th>
                    <th className="hidden lg:table-cell">
                      <button
                        onClick={() => toggleSort('status')}
                        className="flex items-center hover:text-lfg-orange"
                      >
                        Status <span className="ml-1">{sortIcon('status')}</span>
                      </button>
                    </th>
                    <th className="hidden lg:table-cell">
                      <button
                        onClick={() => toggleSort('endDate')}
                        className="flex items-center hover:text-lfg-orange"
                      >
                        End date <span className="ml-1">{sortIcon('endDate')}</span>
                      </button>
                    </th>
                    <th>
                      <button
                        onClick={() => toggleSort('budget')}
                        className="flex items-center hover:text-lfg-orange"
                      >
                        Budget <span className="ml-1">{sortIcon('budget')}</span>
                      </button>
                    </th>
                    <th className="hidden md:table-cell">
                      <button
                        onClick={() => toggleSort('disbursement')}
                        className="flex items-center hover:text-lfg-orange"
                      >
                        Disbursed{' '}
                        <span className="ml-1">{sortIcon('disbursement')}</span>
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-lfg-cream/30">
                      <td className="font-dm">
                        <a
                          href={`${DEVTRACKER_BASE}/programme/${p.iatiIdentifier}/summary`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold hover:text-lfg-orange hover:underline transition-colors"
                          title={p.title}
                        >
                          {p.title?.length > 90
                            ? p.title.slice(0, 90) + '…'
                            : p.title}{' '}
                          <span className="text-xs text-gray-400">↗</span>
                        </a>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                          {p.iatiIdentifier}
                        </p>
                      </td>
                      <td className="hidden md:table-cell font-dm text-xs text-gray-600">
                        {p.sectorName ?? '—'}
                      </td>
                      <td className="hidden lg:table-cell font-dm text-xs">
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            p.activityStatus === 'Implementation'
                              ? 'bg-lfg-green/20 text-green-900'
                              : p.activityStatus === 'Closed'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-lfg-yellow/20 text-yellow-900'
                          }`}
                        >
                          {p.activityStatus}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell font-dm text-xs text-gray-600">
                        {p.endDate ? formatDate(p.endDate) : '—'}
                      </td>
                      <td className="font-dm font-bold text-lfg-orange">
                        {formatCurrency(p.budgetGbp ?? 0)}
                      </td>
                      <td className="hidden md:table-cell font-dm text-gray-700">
                        {formatCurrency(p.disbursementGbp ?? 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 font-dm">
                No projects match your filters.
              </div>
            )}

            <div className="mt-8 p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
              <p className="text-xs text-gray-500 font-dm">
                Source: International Aid Transparency Initiative (IATI),
                FCDO publications. Project budgets and disbursements are as
                published by the reporting organisation. Click any project to
                view full transaction history on FCDO DevTracker.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
