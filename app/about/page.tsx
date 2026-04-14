import Link from 'next/link'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const dataSources = [
  {
    name: 'Contracts Finder',
    description:
      'UK government procurement notices and contract awards from public bodies across England.',
    url: 'https://www.contractsfinder.service.gov.uk/',
    tag: 'procurement',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Companies House',
    description:
      'Official UK company register including accounts, filings, officers, and company status.',
    url: 'https://developer.company-information.service.gov.uk/',
    tag: 'company data',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'GOV.UK Spending Data',
    description:
      'Departmental payments over £25,000 published by HM Treasury and central government bodies.',
    url: 'https://www.gov.uk/government/collections/spending-transparency',
    tag: 'spending',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'GIAS / Get Information About Schools',
    description:
      'The Department for Education register of all schools and colleges in England, including academy trust data.',
    url: 'https://get-information-schools.service.gov.uk/',
    tag: 'education',
    accent: 'border-l-lfg-orange',
  },
  {
    name: 'Ofsted',
    description:
      'School inspection outcomes, ratings, and published reports for all state-funded schools.',
    url: 'https://www.gov.uk/government/organisations/ofsted',
    tag: 'inspections',
    accent: 'border-l-lfg-blue',
  },
  {
    name: 'DLUHC',
    description:
      'Local authority finance statistics, council tax data, and housing figures from the Department for Levelling Up.',
    url: 'https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities',
    tag: 'local finance',
    accent: 'border-l-lfg-yellow',
  },
  {
    name: 'ONS',
    description:
      'Office for National Statistics: public sector finance statistics, population data, and economic indicators.',
    url: 'https://www.ons.gov.uk/',
    tag: 'statistics',
    accent: 'border-l-lfg-orange',
  },
] as const

// ---------------------------------------------------------------------------
// Page (server component — no 'use client')
// ---------------------------------------------------------------------------

export default function AboutPage() {
  return (
    <div>
      {/* Page header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <h1>about</h1>
          <p>uk government spending transparency</p>
        </div>
      </section>

      <div className="brand-motif-thick" />

      {/* What is LFG GovScan? */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-octarine text-3xl mb-6">what is lfg govscan?</h2>
        <div className="space-y-4 font-dm text-base leading-relaxed text-gray-700">
          <p>
            LFG GovScan is an independent transparency project by{' '}
            <Link
              href="https://lookingforgrowth.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-lfg-orange hover:underline"
            >
              Looking for Growth
            </Link>
            . It aggregates open government data to make public spending visible,
            searchable, and understandable — without the jargon.
          </p>
          <p>
            Every year, UK public bodies spend hundreds of billions of pounds on
            contracts, services, and grants. The data exists — it is published
            under open government licences — but it is spread across dozens of
            portals, formats, and APIs. GovScan pulls it together in one place.
          </p>
          <p>
            Our goal is simple: if your money is being spent, you should be able
            to find out how, by whom, and whether it represents good value.
          </p>
        </div>
      </section>

      <div className="brand-motif my-8" />

      {/* Data sources */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-octarine text-3xl mb-2">data sources</h2>
        <p className="font-dm text-gray-500 text-sm mb-8">
          All data is sourced from official UK government APIs and open data
          publications. We do not modify or editorialize raw source data.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataSources.map((source) => (
            <a
              key={source.name}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`stat-card border-l-4 ${source.accent} group flex flex-col gap-2`}
              aria-label={`${source.name} — opens in new tab`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-dm font-bold text-base group-hover:text-lfg-orange transition-colors leading-snug">
                  {source.name}
                </h3>
                <span className="shrink-0 text-xs font-dm text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded-sm">
                  {source.tag}
                </span>
              </div>
              <p className="font-dm text-sm text-gray-600 leading-relaxed">
                {source.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <div className="brand-motif my-8" />

      {/* Licensing */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-octarine text-3xl mb-6">licensing</h2>
        <div className="space-y-4 font-dm text-base leading-relaxed text-gray-700">
          <p>
            All government data displayed on GovScan is published under the{' '}
            <a
              href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-lfg-orange hover:underline"
            >
              Open Government Licence v3.0
            </a>{' '}
            (OGL v3). This means it is free to use, share, and adapt for any
            purpose, including commercial use, provided attribution is given to
            the original data provider and the licence is acknowledged.
          </p>
          <p>
            Contains public sector information licensed under the Open Government
            Licence v3.0.
          </p>
          <div className="border-2 border-lfg-black bg-lfg-cream/40 p-4 text-sm font-dm text-gray-600">
            <strong className="font-bold text-lfg-black">Attribution:</strong>{' '}
            Data sourced from Contracts Finder, Companies House, GOV.UK, DfE,
            Ofsted, DLUHC, and ONS — © Crown copyright and database rights.
          </div>
        </div>
      </section>

      <div className="brand-motif my-8" />

      {/* About Looking for Growth */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-octarine text-3xl mb-6">about looking for growth</h2>
        <div className="space-y-4 font-dm text-base leading-relaxed text-gray-700">
          <p>
            Looking for Growth is an independent UK media and research project
            covering economic policy, public spending, and infrastructure. We
            believe that holding government to account starts with making its data
            legible to everyone — not just researchers and journalists with
            specialist tools.
          </p>
          <p>
            GovScan is one part of that mission. We build tools that turn
            sprawling official datasets into something you can actually use.
          </p>
          <Link
            href="https://lookingforgrowth.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block btn-primary mt-2"
          >
            visit lookingforgrowth.uk
          </Link>
        </div>
      </section>

      {/* Bottom motif */}
      <div className="brand-motif-thick" />
    </div>
  )
}
