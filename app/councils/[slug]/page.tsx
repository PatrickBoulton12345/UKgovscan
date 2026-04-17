import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  COUNCILS,
  getCouncilBySlug,
  getFpnRanking,
  getTotalRankedCouncils,
  rateColour,
  TYPE_BADGE,
} from '@/lib/councils-data'
import { formatCurrency } from '@/lib/utils'

export function generateStaticParams() {
  return COUNCILS.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const council = getCouncilBySlug(params.slug)
  if (!council) return { title: 'Council Not Found' }
  return {
    title: `${council.name} — At a Glance`,
    description: `Fly tipping enforcement, spending, and council tax data for ${council.name}.`,
  }
}

export default function CouncilDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const council = getCouncilBySlug(params.slug)
  if (!council) notFound()

  const ranking = getFpnRanking(council)
  const totalRanked = getTotalRankedCouncils()

  return (
    <div>
      {/* Header */}
      <section className="page-header">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/councils"
              className="text-sm font-dm text-gray-400 hover:text-white transition-colors"
            >
              ← all councils
            </Link>
          </div>
          <h1>{council.name.toLowerCase()}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-dm font-bold rounded-sm ${TYPE_BADGE[council.type]}`}
            >
              {council.type}
            </span>
            <span className="text-gray-400 font-dm text-sm">
              {council.region}
            </span>
          </div>
        </div>
      </section>

      <div className="brand-motif-thick" />

      {/* At a glance */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-octarine text-2xl mb-6">at a glance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* FPN Rate */}
          {council.flyTipping && (
            <div className="stat-card border-l-4 border-l-lfg-orange">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Fly tipping FPN rate
              </p>
              <p
                className={`font-octarine text-5xl leading-none ${rateColour(council.flyTipping.rate)}`}
              >
                {council.flyTipping.rate.toFixed(1)}%
              </p>
              <p className="text-sm font-dm text-gray-500 mt-2">
                of fly tipping incidents received a Fixed Penalty Notice
              </p>
              {ranking && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="font-dm text-sm">
                    <span className="font-bold text-lfg-orange">
                      #{ranking}
                    </span>
                    <span className="text-gray-400">
                      {' '}
                      out of {totalRanked} councils nationally
                    </span>
                  </p>
                  <p className="text-xs font-dm text-gray-300 mt-1">
                    {ranking <= 10
                      ? 'Top 10 — strong enforcement'
                      : ranking <= Math.floor(totalRanked / 2)
                        ? 'Above average enforcement'
                        : 'Below average enforcement'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Incidents & FPNs */}
          {council.flyTipping && (
            <div className="stat-card border-l-4 border-l-lfg-blue">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Fly tipping incidents
              </p>
              <p className="font-octarine text-4xl leading-none text-lfg-black">
                {council.flyTipping.incidents.toLocaleString()}
              </p>
              <p className="text-sm font-dm text-gray-500 mt-2">
                total reported incidents
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="font-dm text-sm">
                  <span className="font-bold">
                    {council.flyTipping.fpns.toLocaleString()}
                  </span>
                  <span className="text-gray-400"> FPNs issued</span>
                </p>
                {council.flyTipping.fpns === 0 && (
                  <p className="text-xs font-dm text-red-500 font-bold mt-1">
                    Zero enforcement — not a single fine issued
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Estimated FPN Revenue */}
          {council.finance?.fpnRevenue !== undefined && (
            <div className="stat-card border-l-4 border-l-lfg-yellow">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Estimated FPN revenue
              </p>
              <p className="font-octarine text-4xl leading-none text-lfg-black">
                {council.finance.fpnRevenue > 0
                  ? formatCurrency(council.finance.fpnRevenue)
                  : '£0'}
              </p>
              <p className="text-sm font-dm text-gray-500 mt-2">
                based on £400 standard fine per FPN
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-dm text-gray-300">
                  Councils can set FPN fines between £150 and £1,000.
                  £400 is the government-recommended standard rate.
                  Actual revenue may differ.
                </p>
              </div>
            </div>
          )}

          {/* Council Expenditure — placeholder for DLUHC data */}
          {council.finance?.expenditure ? (
            <div className="stat-card border-l-4 border-l-lfg-orange">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Total expenditure
              </p>
              <p className="font-octarine text-4xl leading-none text-lfg-black">
                {formatCurrency(council.finance.expenditure)}
              </p>
              <p className="text-sm font-dm text-gray-500 mt-2">
                annual revenue expenditure
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-dm text-gray-300">
                  Source: DLUHC Revenue Outturn (RO) data
                </p>
              </div>
            </div>
          ) : (
            <div className="stat-card border-l-4 border-l-lfg-orange border-dashed">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Total expenditure
              </p>
              <p className="font-octarine text-2xl leading-none text-gray-300">
                coming soon
              </p>
              <p className="text-sm font-dm text-gray-400 mt-2">
                DLUHC revenue expenditure data
              </p>
            </div>
          )}

          {/* Council Tax Revenue — placeholder for DLUHC data */}
          {council.finance?.councilTax ? (
            <div className="stat-card border-l-4 border-l-lfg-blue">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Council tax revenue
              </p>
              <p className="font-octarine text-4xl leading-none text-lfg-black">
                {formatCurrency(council.finance.councilTax)}
              </p>
              <p className="text-sm font-dm text-gray-500 mt-2">
                annual council tax collected
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-dm text-gray-300">
                  Source: DLUHC council tax statistics
                </p>
              </div>
            </div>
          ) : (
            <div className="stat-card border-l-4 border-l-lfg-blue border-dashed">
              <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">
                Council tax revenue
              </p>
              <p className="font-octarine text-2xl leading-none text-gray-300">
                coming soon
              </p>
              <p className="text-sm font-dm text-gray-400 mt-2">
                DLUHC council tax data
              </p>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`/contracts?keyword=${encodeURIComponent(council.name)}`}
            className="btn-primary text-sm"
          >
            view contracts →
          </a>
          <Link href="/councils" className="btn-secondary text-sm">
            ← back to all councils
          </Link>
        </div>

        {/* Data source */}
        <div className="mt-8 p-4 bg-lfg-cream/40 border-l-4 border-l-lfg-yellow">
          <p className="text-xs text-gray-500 font-dm">
            Fly tipping data sourced from DEFRA. FPN = Fixed Penalty Notice.
            National ranking is based on FPN-to-incident rate across all
            councils with available data. FPN revenue is estimated at the
            standard £400 rate — actual fines can range from £150 to £1,000.
            Council expenditure and tax data from DLUHC (when available).
          </p>
        </div>
      </section>
    </div>
  )
}
