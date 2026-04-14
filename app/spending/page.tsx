'use client'

import { useState, useMemo } from 'react'

interface Department {
  name: string
  description: string
  url: string
  accent: 'border-l-lfg-orange' | 'border-l-lfg-blue' | 'border-l-lfg-yellow'
}

const DEPARTMENTS: Department[] = [
  {
    name: 'Cabinet Office',
    description:
      'Supports the Prime Minister and Cabinet, coordinates government policy across Whitehall.',

    url: 'https://www.gov.uk/government/collections/spending-over-25-000',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Department for Education',
    description:
      'Responsible for children\'s services, education, and skills in England.',
    url: 'https://www.gov.uk/government/collections/dfe-departmental-spending-over-25000',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'Department for Environment, Food & Rural Affairs',
    description:
      'Covers environmental policy, food, farming, and rural communities.',
    url: 'https://www.gov.uk/government/collections/defra-and-its-agencies-spending-over-25-000',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'Department for Transport',
    description:
      'Transport policy and investment including roads, rail, and aviation.',
    url: 'https://www.gov.uk/government/collections/dft-departmental-spending',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Department of Health and Social Care',
    description:
      'Leads health and social care policy, funding for NHS England and adult social care.',
    url: 'https://www.gov.uk/government/collections/dhsc-departmental-spending',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'HM Revenue & Customs',
    description:
      'Collects taxes and administers National Insurance, tax credits and Child Benefit.',
    url: 'https://www.gov.uk/government/collections/hmrc-spending-over-25-000',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'HM Treasury',
    description:
      'Maintains control over public spending, financial regulation and economic policy.',
    url: 'https://www.gov.uk/government/collections/hmt-departmental-spending',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Home Office',
    description:
      'Immigration, security, and law and order. Sponsors the police and border agencies.',
    url: 'https://www.gov.uk/government/collections/home-office-spending-over-25-000',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'Ministry of Defence',
    description:
      'Protects UK interests and defence of the realm. One of the largest procurement buyers.',
    url: 'https://www.gov.uk/government/collections/mod-departmental-spending',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'Ministry of Justice',
    description:
      'Courts, prisons, probation, and legal aid across England and Wales.',
    url: 'https://www.gov.uk/government/collections/moj-departmental-spending',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Department for Energy Security & Net Zero',
    description:
      'Ensures UK energy security and leads the transition to net zero emissions.',
    url: 'https://www.gov.uk/government/collections/spending-over-25-000',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'Department for Science, Innovation & Technology',
    description:
      'Drives science, research, and technology policy including digital infrastructure.',
    url: 'https://www.gov.uk/government/collections/spending-over-25-000',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'Department for Business and Trade',
    description:
      'Supports business growth, trade policy, and UK investment promotion.',
    url: 'https://www.gov.uk/government/collections/spending-over-25-000',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Department for Work and Pensions',
    description:
      'Administers welfare, pensions, and child maintenance. One of the largest spending departments.',
    url: 'https://www.gov.uk/government/collections/dwp-departmental-spending',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'Department for Levelling Up, Housing and Communities',
    description:
      'Local government funding, housing, and regional regeneration across England.',
    url: 'https://www.gov.uk/government/collections/dluhc-spending-over-25-000',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'Foreign, Commonwealth & Development Office',
    description:
      'UK foreign policy and overseas development aid. Manages global diplomatic network.',
    url: 'https://www.gov.uk/government/collections/fcdo-spending-over-25-000',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'NHS England',
    description:
      'Commissions health services across England. Largest healthcare purchaser in the world.',
    url: 'https://www.england.nhs.uk/about/equality/equality-hub/equality-standard/transparency-data/',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'Department for Culture, Media & Sport',
    description:
      'Tourism, sport, arts, libraries, broadcasting, and the creative industries.',
    url: 'https://www.gov.uk/government/collections/dcms-spending-over-25-000',
    accent: 'border-l-lfg-yellow',
  },
]

export default function SpendingPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DEPARTMENTS
    return DEPARTMENTS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <div>
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>spending</h1>
          <p>
            Departmental payments over £25,000 — published monthly by each
            government department under the UK transparency agenda.
          </p>
        </div>
      </section>

      <div className="brand-motif" />

      {/* Data source explainer */}
      <section className="bg-lfg-cream/40 border-b-2 border-lfg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-octarine mb-2">about this data</h2>
              <p className="text-sm font-dm text-gray-700 leading-relaxed max-w-2xl">
                Under the{' '}
                <span className="font-bold">UK Coalition Government&apos;s 2010 transparency agenda</span>,
                all central government departments must publish details of
                invoices and payments above £25,000 each month. The data
                is released as downloadable CSV files on GOV.UK. This page
                links you directly to each department&apos;s transparency data
                collection.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="stat-card border-l-4 border-l-lfg-blue p-4 min-w-[180px]">
                <p className="font-octarine text-3xl text-lfg-orange">18</p>
                <p className="text-xs font-dm text-gray-500 mt-1">
                  departments tracked
                </p>
              </div>
            </div>
          </div>

          {/* How-to note */}
          <div className="mt-6 flex items-start gap-3 bg-white border-2 border-lfg-black px-5 py-4 max-w-2xl">
            <span
              className="text-lfg-orange font-octarine text-lg leading-none mt-0.5 select-none"
              aria-hidden="true"
            >
              !
            </span>
            <p className="text-sm font-dm text-gray-700">
              Each card links to the official GOV.UK transparency data page.
              Download the CSV files directly from GOV.UK and use tools like
              Excel, Google Sheets, or a database to explore them.
            </p>
          </div>
        </div>
      </section>

      {/* Search and results */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Search bar */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="dept-search" className="sr-only">
              Search departments
            </label>
            <input
              id="dept-search"
              type="search"
              placeholder="Search departments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-2 border-lfg-black px-4 py-3 font-dm text-sm
                         focus:outline-none focus:border-lfg-orange placeholder-gray-400"
              aria-label="Filter departments by name or description"
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
          <p
            className="text-sm font-dm text-gray-500"
            aria-live="polite"
            aria-atomic="true"
          >
            {filtered.length === DEPARTMENTS.length
              ? `${DEPARTMENTS.length} departments`
              : `${filtered.length} of ${DEPARTMENTS.length} departments`}
          </p>
        </div>

        {/* Department grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((dept) => (
              <a
                key={dept.name}
                href={dept.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`stat-card border-l-4 ${dept.accent} group flex flex-col gap-3 no-underline`}
                aria-label={`${dept.name} — opens on GOV.UK`}
              >
                {/* Name */}
                <h3 className="font-octarine text-base leading-snug group-hover:text-lfg-orange transition-colors">
                  {dept.name.toLowerCase()}
                </h3>

                {/* Description */}
                <p className="text-sm font-dm text-gray-600 leading-relaxed flex-1">
                  {dept.description}
                </p>

                {/* Footer row */}
                <div className="pt-2 border-t border-gray-100 text-right">
                  <span
                    className="text-xs font-dm font-bold text-lfg-orange group-hover:underline"
                    aria-hidden="true"
                  >
                    GOV.UK data →
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="font-octarine text-2xl text-gray-300 mb-2">no results</p>
            <p className="text-sm font-dm text-gray-400">
              Try a different search term, or{' '}
              <button
                onClick={() => setQuery('')}
                className="text-lfg-orange hover:underline font-bold"
              >
                clear the filter
              </button>
              .
            </p>
          </div>
        )}
      </section>

      {/* Data source footer */}
      <section className="bg-lfg-black text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-octarine mb-4">data licence</h2>
          <p className="text-sm font-dm text-gray-400 max-w-2xl leading-relaxed">
            All spending data is published by UK government departments under the{' '}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lfg-blue hover:underline"
            >
              Open Government Licence v3.0
            </a>
            . Source: GOV.UK transparency data. LFG GovScan links to primary
            sources and does not host or modify the underlying data.
          </p>
        </div>
      </section>
    </div>
  )
}
