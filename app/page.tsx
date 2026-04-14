import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import SearchBar from '@/components/SearchBar'
import { searchContracts } from '@/lib/api/contracts-finder'
import { formatCurrency, formatDate, truncate, contractsFinderUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getHomepageData() {
  try {
    const [recentAwards, recentTenders] = await Promise.all([
      searchContracts({ stage: 'award', size: 5, page: 1 }),
      searchContracts({ stage: 'tender', size: 5, page: 1 }),
    ])
    return { recentAwards, recentTenders, error: null }
  } catch {
    return { recentAwards: null, recentTenders: null, error: 'Failed to load data' }
  }
}

export default async function HomePage() {
  const { recentAwards, recentTenders, error } = await getHomepageData()

  return (
    <div>
      {/* Hero */}
      <section className="bg-lfg-black text-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-octarine mb-4 leading-tight">
            <span className="text-lfg-orange">uk government</span>
            <br />
            spending transparency
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-dm max-w-2xl mb-8">
            Track government contracts, departmental spending, council finances,
            and school funding. Built with open government data.
          </p>
          <div className="max-w-xl">
            <SearchBar large />
          </div>
        </div>
      </section>
      <div className="brand-motif-thick" />

      {/* Stats overview */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            label="Contracts tracked"
            value={recentAwards ? `${recentAwards.total.toLocaleString()}+` : '—'}
            sublabel="via Contracts Finder"
            accent="orange"
          />
          <StatsCard
            label="Departments"
            value="18"
            sublabel="spending data linked"
            accent="blue"
          />
          <StatsCard
            label="Councils"
            value="45"
            sublabel="local authorities listed"
            accent="yellow"
          />
          <StatsCard
            label="Live APIs"
            value="2"
            sublabel="Contracts Finder + Companies House"
            accent="cream"
          />
        </div>
      </section>

      {/* Quick nav cards */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-octarine mb-6">explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'contracts',
              desc: 'Search government procurement contracts. Filter by buyer, value, and status.',
              href: '/contracts',
              accent: 'border-l-lfg-orange',
            },
            {
              title: 'spending',
              desc: 'Departmental payments over £25,000 across government bodies.',
              href: '/spending',
              accent: 'border-l-lfg-blue',
            },
            {
              title: 'map',
              desc: 'See contracts geographically. Explore procurement by region.',
              href: '/map',
              accent: 'border-l-lfg-yellow',
            },
            {
              title: 'councils',
              desc: 'Local authority finances, contracts, and transparency data.',
              href: '/councils',
              accent: 'border-l-lfg-orange',
            },
            {
              title: 'schools',
              desc: 'Per-school funding, Ofsted ratings, and academy trust data.',
              href: '/schools',
              accent: 'border-l-lfg-blue',
            },
            {
              title: 'leaderboard',
              desc: 'Which local authorities are spending the most on contracts?',
              href: '/leaderboard',
              accent: 'border-l-lfg-yellow',
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`stat-card border-l-4 ${card.accent} group`}
            >
              <h3 className="font-octarine text-lg mb-2 group-hover:text-lfg-orange transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 font-dm">{card.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent contracts */}
      {!error && recentAwards && (
        <section className="bg-lfg-cream/40 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-octarine">recent awards</h2>
              <Link
                href="/contracts?stage=award"
                className="text-sm font-dm font-bold text-lfg-orange hover:underline"
              >
                view all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contract</th>
                    <th>Buyer</th>
                    <th>Supplier</th>
                    <th>Value</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAwards.releases.map((r) => (
                    <tr key={r.ocid}>
                      <td className="font-dm font-bold text-sm max-w-xs">
                        <a href={contractsFinderUrl(r.ocid)} target="_blank" rel="noopener noreferrer" className="hover:text-lfg-orange hover:underline">
                          {truncate(r.tender?.title || 'Untitled', 80)}
                        </a>
                      </td>
                      <td className="text-sm">{r.buyer?.name || '—'}</td>
                      <td className="text-sm">
                        {r.awards?.[0]?.suppliers?.[0]?.name || '—'}
                      </td>
                      <td className="text-sm font-bold text-lfg-orange">
                        {r.awards?.[0]?.value?.amount
                          ? formatCurrency(r.awards[0].value.amount)
                          : '—'}
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(r.awards?.[0]?.date || r.publishedDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Recent tenders */}
      {!error && recentTenders && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-octarine">open tenders</h2>
              <Link
                href="/contracts?stage=tender"
                className="text-sm font-dm font-bold text-lfg-orange hover:underline"
              >
                view all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tender</th>
                    <th>Buyer</th>
                    <th>Value</th>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTenders.releases.map((r) => (
                    <tr key={r.ocid}>
                      <td className="font-dm font-bold text-sm max-w-xs">
                        <a href={contractsFinderUrl(r.ocid)} target="_blank" rel="noopener noreferrer" className="hover:text-lfg-orange hover:underline">
                          {truncate(r.tender?.title || 'Untitled', 80)}
                        </a>
                      </td>
                      <td className="text-sm">{r.buyer?.name || '—'}</td>
                      <td className="text-sm font-bold text-lfg-orange">
                        {r.tender?.value?.amount
                          ? formatCurrency(r.tender.value.amount)
                          : '—'}
                      </td>
                      <td className="text-sm text-gray-500">
                        {formatDate(r.publishedDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Data sources */}
      <section className="bg-lfg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-octarine mb-6">data sources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Contracts Finder',
              'Companies House',
              'GOV.UK Spending Data',
              'DfE / GIAS',
              'Ofsted',
              'DLUHC',
              'ONS',
              'Open Government Licence',
            ].map((source) => (
              <div
                key={source}
                className="border border-gray-700 px-4 py-3 text-sm font-dm text-gray-300"
              >
                {source}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
