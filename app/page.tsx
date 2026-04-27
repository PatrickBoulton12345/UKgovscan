import Link from 'next/link'
import StatsCard from '@/components/StatsCard'
import SearchBar from '@/components/SearchBar'
import { searchContracts } from '@/lib/api/contracts-finder'

export const dynamic = 'force-dynamic'

async function getHomepageData() {
  try {
    const recentAwards = await searchContracts({ stage: 'award', size: 1, page: 1 })
    return { totalContracts: recentAwards.total }
  } catch {
    return { totalContracts: null }
  }
}

export default async function HomePage() {
  const { totalContracts } = await getHomepageData()

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            label="Contracts tracked"
            value={totalContracts ? `${totalContracts.toLocaleString()}+` : '—'}
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
