'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import aidData from '@/lib/aid-data.json'

// Top recipient countries — FCDO/IATI cumulative project spend, sourced via
// the live build-time fetch in scripts/fetch-aid-data.mjs.
const COUNTRIES = aidData.topCountries

// ---------------------------------------------------------------------------
// Spotlight: real aid projects that raise eyebrows
// ---------------------------------------------------------------------------
const SPOTLIGHT = [
  {
    title: 'Exposing Chinese Communist Party institutions to UK best practice on governance, policy making and service delivery',
    country: 'China',
    budget: 68_160,
    tag: '£68k teaching governance to the CCP',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-3-PAP-CNF-002335',
  },
  {
    title: 'ARM: Strengthening UK-Armenia fashion ties in the framework of Yerevan Fashion Week',
    country: 'Armenia',
    budget: 34_877,
    tag: '£35k of aid money on Fashion Week',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-1-400223-403',
  },
  {
    title: 'Support to Theatre for Change',
    country: 'Global',
    budget: 218_810,
    tag: '£219k on theatre as international development',
    source: 'IATI / FCDO',
    iatiId: 'GB-1-114193-102',
  },
  {
    title: 'Women in Central Bougainville trained in chocolate making and cocoa value addition',
    country: 'Papua New Guinea',
    budget: 10_000,
    tag: '£10k teaching chocolate making in the Pacific',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-1-400808-402',
  },
  {
    title: 'Nature Park YUS Tree Kangaroo Conservation Coffee',
    country: 'Papua New Guinea',
    budget: 10_000,
    tag: '£10k on tree kangaroo coffee',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-1-400808-404',
  },
  {
    title: 'Social Media Tracking for Ghana 2012 Elections',
    country: 'Ghana',
    budget: 24_570,
    tag: '£25k monitoring Ghanaian tweets',
    source: 'IATI / FCDO',
    iatiId: 'GB-1-202477-112',
  },
  {
    title: 'ZEG Tbilisi Storytelling Festival',
    country: 'Georgia',
    budget: 19_710,
    tag: '£20k of aid on a Georgian storytelling festival',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-1-400223-401',
  },
  {
    title: 'Inclusion through Football: Using soft power to promote UK values of diversity and inclusion',
    country: 'Global',
    budget: 2_535,
    tag: '£2.5k — "soft power" via football',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-1-400222-403',
  },
  {
    title: 'Departmental Central Administrative Costs of ODA Programme',
    country: 'Global',
    budget: 47,
    tag: '£47 — the UK\'s smallest foreign aid project',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-3-PF-EDU-911001',
  },
  {
    title: 'Supporting China\'s strategic development of its technology and satellite industries to promote international innovation',
    country: 'China',
    budget: 0,
    tag: 'UK aid helping China build its tech and satellite industries',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-3-PPF-CHP-000183',
  },
  {
    title: 'Fostering innovation and critical thinking through improved English proficiency among school children in Malaysia using poetry',
    country: 'Malaysia',
    budget: 12_712,
    tag: '£13k teaching Malaysian children English through poetry',
    source: 'IATI / FCDO',
    iatiId: 'GB-GOV-3-PAP-MAK-002271',
  },
]

const DEVTRACKER_BASE = 'https://devtracker.fcdo.gov.uk'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ForeignAidPage() {
  const [sortBy, setSortBy] = useState<'currentYearBudget' | 'projects' | 'name'>('currentYearBudget')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function toggleSort(field: 'currentYearBudget' | 'projects' | 'name') {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(field)
      setSortDir(field === 'name' ? 'asc' : 'desc')
    }
  }

  const filtered = useMemo(() => {
    return [...COUNTRIES].sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return sortDir === 'asc'
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number)
    })
  }, [sortBy, sortDir])

  const maxCurrentYearBudget = Math.max(
    ...COUNTRIES.map((c) => c.currentYearBudget || 0),
    1,
  )

  return (
    <div>
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>foreign aid</h1>
          <p>
            UK overseas development assistance by recipient country.
            Project-level data from the International Aid Transparency
            Initiative (IATI); national totals from the OECD Creditor
            Reporting System (CRS).
          </p>
          <p className="text-xs italic text-gray-400 mt-2 font-dm">
            Names for territories come from UK Government and third-party
            sources. They may not represent LFG&apos;s position.
          </p>
        </div>
      </section>

      <div className="brand-motif-thick" />

      {/* Spotlight */}
      <section className="bg-lfg-cream/40 border-b-2 border-lfg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="font-octarine text-2xl mb-1">you couldn&apos;t make it up</h2>
          <p className="font-dm text-sm text-gray-500 mb-6">
            Real UK aid projects. Real taxpayer money. All sourced from FCDO data published via IATI.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {SPOTLIGHT.map((s, i) => (
              <a
                key={i}
                href={`${DEVTRACKER_BASE}/programme/${s.iatiId}/summary`}
                target="_blank"
                rel="noopener noreferrer"
                className="stat-card border-l-4 border-l-lfg-orange group flex flex-col gap-2 hover:bg-white hover:shadow-md transition-all"
              >
                <p className="font-dm font-bold text-sm leading-tight group-hover:text-lfg-orange">
                  {s.title.length > 80 ? s.title.slice(0, 80) + '…' : s.title}
                </p>
                <p className="text-xs font-dm text-gray-400">{s.country}</p>
                {s.budget > 0 && (
                  <p className="font-octarine text-xl text-lfg-orange lowercase">
                    {formatCurrency(s.budget)}
                  </p>
                )}
                <p className="text-xs font-dm font-bold text-gray-600 mt-auto pt-2 border-t border-gray-100">
                  {s.tag}
                </p>
                <p className="text-[10px] font-dm text-gray-400 uppercase tracking-wider">
                  View on FCDO DevTracker ↗
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Country breakdown */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="stat-card border-l-4 border-l-lfg-green">
            <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
              Spend in {aidData.currentYear.year}
            </p>
            <p className="text-3xl font-octarine lowercase">
              {formatCurrency(aidData.currentYear.totalSpentGbp ?? 0)}
            </p>
            <p className="text-xs font-dm text-gray-400 mt-1">
              {(aidData.currentYear.projectCount ?? 0).toLocaleString()} projects, {aidData.currentYear.countryCount ?? 0} countries (IATI)
            </p>
          </div>
          <div className="stat-card border-l-4 border-l-lfg-orange">
            <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
              UK ODA {aidData.oecd.latestYear}
            </p>
            <p className="text-3xl font-octarine lowercase">
              {formatCurrency(aidData.oecd.latestDisbursementGbp ?? 0)}
            </p>
            <p className="text-xs font-dm text-gray-400 mt-1">
              disbursed (OECD CRS)
            </p>
          </div>
          <div className="stat-card border-l-4 border-l-lfg-blue">
            <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-1">
              Tracked projects
            </p>
            <p className="text-3xl font-octarine lowercase">
              {(aidData.iatiSummary.projectCount ?? 0).toLocaleString()}
            </p>
            <p className="text-xs font-dm text-gray-400 mt-1">
              across {aidData.iatiSummary.countryCount ?? 0} countries (
              <a
                href="https://d-portal.org/q.html?publisher_id=GB-GOV-1"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-lfg-orange"
                title="Browse FCDO IATI projects on D-Portal"
              >
                IATI ↗
              </a>
              )
            </p>
          </div>
        </div>

        <h2 className="font-octarine text-2xl mb-4">by recipient country</h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-12">#</th>
                <th>
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center hover:text-lfg-orange transition-colors"
                  >
                    Country
                    <span className="ml-1">
                      {sortBy === 'name'
                        ? sortDir === 'desc' ? '↓' : '↑'
                        : '↕'}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => toggleSort('projects')}
                    className="flex items-center hover:text-lfg-orange transition-colors"
                  >
                    Projects
                    <span className="ml-1">
                      {sortBy === 'projects'
                        ? sortDir === 'desc' ? '↓' : '↑'
                        : '↕'}
                    </span>
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => toggleSort('currentYearBudget')}
                    className="flex items-center hover:text-lfg-orange transition-colors"
                  >
                    Spend in {aidData.currentYear.year}
                    <span className="ml-1">
                      {sortBy === 'currentYearBudget'
                        ? sortDir === 'desc' ? '↓' : '↑'
                        : '↕'}
                    </span>
                  </button>
                </th>
                <th className="hidden md:table-cell w-64"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.code}>
                  <td>
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold ${
                        i < 3
                          ? 'bg-lfg-orange text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="font-dm font-bold">
                    <Link
                      href={`/foreign-aid/${c.code}`}
                      className="hover:text-lfg-orange hover:underline transition-colors"
                      title={`View all UK aid projects in ${c.name}`}
                    >
                      {c.name} <span className="text-xs text-gray-400">→</span>
                    </Link>
                  </td>
                  <td className="font-dm">{c.projects.toLocaleString()}</td>
                  <td className="font-dm font-bold text-lfg-green">
                    {c.currentYearBudget > 0 ? formatCurrency(c.currentYearBudget) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="hidden md:table-cell">
                    <div className="w-full bg-gray-100 h-3">
                      <div
                        className="bg-lfg-green h-3 transition-all duration-300"
                        style={{
                          width: `${(c.currentYearBudget / maxCurrentYearBudget) * 100}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data source */}
        <div className="mt-8 p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
          <p className="text-xs text-gray-500 font-dm">
            Per-country figures show UK aid spend in {aidData.currentYear.year},
            sourced from the International Aid Transparency Initiative (IATI).
            The {aidData.oecd.latestYear} headline figure is UK Official
            Development Assistance disbursed in that year, sourced from the{' '}
            <a
              href="https://stats.oecd.org/Index.aspx?DataSetCode=crs1"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-lfg-orange"
            >
              OECD Creditor Reporting System
            </a>
            . Click any country or project to view it on the official FCDO{' '}
            <a
              href="https://devtracker.fcdo.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-lfg-orange"
            >
              DevTracker
            </a>
            . Multi-country programmes are apportioned by IATI percentage
            shares; budget figures may differ from final disbursements. Data
            last refreshed{' '}
            {new Date(aidData.generatedAt).toISOString().slice(0, 10)}.
          </p>
        </div>
      </div>
    </div>
  )
}
