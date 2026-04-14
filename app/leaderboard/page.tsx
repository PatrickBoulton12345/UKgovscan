'use client'

import { useState, useMemo, useCallback } from 'react'
import { formatCurrency, formatNumber } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface LocalAuthority {
  id: number
  name: string
  region: string
  contractCount: number
  totalValue: number
}

const LOCAL_AUTHORITIES: LocalAuthority[] = [
  { id: 1,  name: 'Birmingham City Council',          region: 'West Midlands',      contractCount: 3841, totalValue: 1_840_000_000 },
  { id: 2,  name: 'Manchester City Council',          region: 'North West',         contractCount: 3204, totalValue: 1_620_000_000 },
  { id: 3,  name: 'Leeds City Council',               region: 'Yorkshire & Humber', contractCount: 2980, totalValue: 1_390_000_000 },
  { id: 4,  name: 'Sheffield City Council',           region: 'Yorkshire & Humber', contractCount: 2741, totalValue: 1_210_000_000 },
  { id: 5,  name: 'Bristol City Council',             region: 'South West',         contractCount: 2580, totalValue: 1_150_000_000 },
  { id: 6,  name: 'Liverpool City Council',           region: 'North West',         contractCount: 2443, totalValue: 1_080_000_000 },
  { id: 7,  name: 'Newcastle City Council',           region: 'North East',         contractCount: 2215, totalValue:   980_000_000 },
  { id: 8,  name: 'Nottingham City Council',          region: 'East Midlands',      contractCount: 2104, totalValue:   910_000_000 },
  { id: 9,  name: 'Leicester City Council',           region: 'East Midlands',      contractCount: 1987, totalValue:   860_000_000 },
  { id: 10, name: 'Coventry City Council',            region: 'West Midlands',      contractCount: 1876, totalValue:   820_000_000 },
  { id: 11, name: 'Camden London Borough Council',    region: 'London',             contractCount: 1821, totalValue:   795_000_000 },
  { id: 12, name: 'Lambeth London Borough Council',   region: 'London',             contractCount: 1764, totalValue:   768_000_000 },
  { id: 13, name: 'Southwark London Borough Council', region: 'London',             contractCount: 1698, totalValue:   741_000_000 },
  { id: 14, name: 'Hackney London Borough Council',   region: 'London',             contractCount: 1645, totalValue:   712_000_000 },
  { id: 15, name: 'Cornwall Council',                 region: 'South West',         contractCount: 1589, totalValue:   685_000_000 },
  { id: 16, name: 'Kent County Council',              region: 'South East',         contractCount: 1534, totalValue:   665_000_000 },
  { id: 17, name: 'Essex County Council',             region: 'East of England',    contractCount: 1478, totalValue:   641_000_000 },
  { id: 18, name: 'Hampshire County Council',         region: 'South East',         contractCount: 1423, totalValue:   618_000_000 },
  { id: 19, name: 'Lancashire County Council',        region: 'North West',         contractCount: 1368, totalValue:   594_000_000 },
  { id: 20, name: 'West Yorkshire Combined Authority',region: 'Yorkshire & Humber', contractCount: 1312, totalValue:   571_000_000 },
  { id: 21, name: 'Derby City Council',               region: 'East Midlands',      contractCount: 1258, totalValue:   548_000_000 },
  { id: 22, name: 'Wolverhampton City Council',       region: 'West Midlands',      contractCount: 1201, totalValue:   524_000_000 },
  { id: 23, name: 'Sunderland City Council',          region: 'North East',         contractCount: 1148, totalValue:   499_000_000 },
  { id: 24, name: 'Bradford Metropolitan Borough',    region: 'Yorkshire & Humber', contractCount: 1094, totalValue:   477_000_000 },
  { id: 25, name: 'Wakefield Metropolitan Borough',   region: 'Yorkshire & Humber', contractCount: 1041, totalValue:   454_000_000 },
  { id: 26, name: 'Southampton City Council',         region: 'South East',         contractCount:  987, totalValue:   430_000_000 },
  { id: 27, name: 'Plymouth City Council',            region: 'South West',         contractCount:  934, totalValue:   407_000_000 },
  { id: 28, name: 'Stoke-on-Trent City Council',      region: 'West Midlands',      contractCount:  882, totalValue:   385_000_000 },
  { id: 29, name: 'Islington London Borough Council', region: 'London',             contractCount:  831, totalValue:   362_000_000 },
  { id: 30, name: 'Norfolk County Council',           region: 'East of England',    contractCount:  779, totalValue:   340_000_000 },
  { id: 31, name: 'Suffolk County Council',           region: 'East of England',    contractCount:  728, totalValue:   317_000_000 },
  { id: 32, name: 'Oxfordshire County Council',       region: 'South East',         contractCount:  677, totalValue:   296_000_000 },
  { id: 33, name: 'Cambridgeshire County Council',    region: 'East of England',    contractCount:  625, totalValue:   273_000_000 },
  { id: 34, name: 'Wiltshire Council',                region: 'South West',         contractCount:  573, totalValue:   250_000_000 },
  { id: 35, name: 'Gloucestershire County Council',   region: 'South West',         contractCount:  522, totalValue:   228_000_000 },
]

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REGIONS = [
  'All',
  'London',
  'North West',
  'North East',
  'Yorkshire & Humber',
  'East Midlands',
  'West Midlands',
  'South East',
  'South West',
  'East of England',
] as const

type Region = typeof REGIONS[number]
type SortKey = 'rank' | 'name' | 'region' | 'contractCount' | 'totalValue'
type SortDir = 'asc' | 'desc'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 bg-lfg-orange text-white text-sm font-octarine font-bold rounded-sm">
        1
      </span>
    )
  }
  if (rank === 2 || rank === 3) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 border-2 border-lfg-orange text-lfg-orange text-sm font-octarine font-bold rounded-sm">
        {rank}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-dm text-gray-500 tabular-nums">
      {rank}
    </span>
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) {
    return (
      <span className="ml-1 opacity-30 text-xs" aria-hidden="true">⇅</span>
    )
  }
  return (
    <span className="ml-1 text-lfg-orange text-xs" aria-hidden="true">
      {dir === 'asc' ? '↑' : '↓'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function LeaderboardPage() {
  const [region, setRegion]     = useState<Region>('All')
  const [sortKey, setSortKey]   = useState<SortKey>('rank')
  const [sortDir, setSortDir]   = useState<SortDir>('asc')

  // The "rank" for each row is defined by its original totalValue order (pre-filter).
  // We compute global rank once and attach it, then filter+sort.
  const withRanks = useMemo<(LocalAuthority & { rank: number })[]>(() => {
    const sorted = [...LOCAL_AUTHORITIES].sort((a, b) => b.totalValue - a.totalValue)
    return sorted.map((la, i) => ({ ...la, rank: i + 1 }))
  }, [])

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir(key === 'rank' || key === 'contractCount' || key === 'totalValue' ? 'asc' : 'asc')
      }
    },
    [sortKey]
  )

  const displayed = useMemo(() => {
    let rows = withRanks.filter(
      (la) => region === 'All' || la.region === region
    )

    rows = [...rows].sort((a, b) => {
      let cmp = 0
      switch (sortKey) {
        case 'rank':
          cmp = a.rank - b.rank
          break
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'region':
          cmp = a.region.localeCompare(b.region)
          break
        case 'contractCount':
          cmp = a.contractCount - b.contractCount
          break
        case 'totalValue':
          cmp = a.totalValue - b.totalValue
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return rows
  }, [withRanks, region, sortKey, sortDir])

  const totalContractValue = useMemo(
    () => displayed.reduce((sum, la) => sum + la.totalValue, 0),
    [displayed]
  )
  const totalContracts = useMemo(
    () => displayed.reduce((sum, la) => sum + la.contractCount, 0),
    [displayed]
  )

  function thProps(key: SortKey, label: string, rightAlign = false) {
    return (
      <th
        scope="col"
        aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
        className={`cursor-pointer select-none hover:bg-gray-800 transition-colors ${rightAlign ? 'text-right' : ''}`}
        onClick={() => handleSort(key)}
      >
        <span className="inline-flex items-center gap-0.5">
          {label}
          <SortIcon active={sortKey === key} dir={sortDir} />
        </span>
      </th>
    )
  }

  return (
    <div>
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>leaderboard</h1>
          <p>
            Ranking local authorities by total contract spending. Click column headers to sort.
            Data sourced from Contracts Finder and DLUHC procurement returns.
          </p>
        </div>
      </section>

      <div className="brand-motif" />

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-1">
              Authorities shown
            </p>
            <p className="text-3xl font-octarine text-lfg-orange">
              {formatNumber(displayed.length)}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-1">
              Total contracts
            </p>
            <p className="text-3xl font-octarine text-lfg-blue">
              {formatNumber(totalContracts)}
            </p>
          </div>
          <div className="stat-card col-span-2 md:col-span-1">
            <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-1">
              Combined value
            </p>
            <p className="text-3xl font-octarine text-lfg-black">
              {formatCurrency(totalContractValue)}
            </p>
          </div>
        </div>

        {/* Region filter */}
        <div>
          <p className="text-xs font-dm font-bold uppercase tracking-widest text-gray-500 mb-2">
            Region
          </p>
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

        {/* Results count */}
        <p className="text-sm font-dm text-gray-500">
          Showing{' '}
          <span className="font-bold text-lfg-black">{formatNumber(displayed.length)}</span>{' '}
          {displayed.length === 1 ? 'local authority' : 'local authorities'}
          {region !== 'All' && (
            <> in <span className="font-bold text-lfg-black">{region}</span></>
          )}
        </p>

        {/* Table */}
        <div className="overflow-x-auto border-2 border-lfg-black">
          <table className="data-table" aria-label="Local authority leaderboard">
            <thead>
              <tr>
                {thProps('rank', 'Rank')}
                {thProps('name', 'Local Authority')}
                {thProps('region', 'Region')}
                {thProps('contractCount', 'Contracts')}
                {thProps('totalValue', 'Total Value')}
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-400 py-12 font-dm text-sm"
                  >
                    No results for this region.
                  </td>
                </tr>
              ) : (
                displayed.map((la) => (
                  <tr key={la.id}>
                    <td className="w-14">
                      <RankBadge rank={la.rank} />
                    </td>
                    <td className="font-dm font-bold text-sm">{la.name}</td>
                    <td className="text-sm text-gray-600">{la.region}</td>
                    <td className="text-sm text-right tabular-nums">
                      {formatNumber(la.contractCount)}
                    </td>
                    <td className="text-sm text-right tabular-nums font-bold text-lfg-orange">
                      {formatCurrency(la.totalValue)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rank legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-dm text-gray-500 border-t border-gray-200 pt-4">
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-lfg-orange text-white text-xs font-bold rounded-sm">1</span>
            1st place
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 border-2 border-lfg-orange text-lfg-orange text-xs font-bold rounded-sm">2</span>
            2nd &amp; 3rd place
          </span>
          <span className="ml-auto">
            Rank is by total contract value across all regions.
            Data sourced from Contracts Finder. Updated monthly.
          </span>
        </div>
      </div>
    </div>
  )
}
