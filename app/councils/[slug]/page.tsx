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
            <span className="inline-block px-3 py-1 text-xs font-dm font-bold rounded-sm bg-white/20 text-white border border-white/30">
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

        </div>

        {/* Debt */}
        {council.finance?.totalDebt && (
          <>
            <h2 className="font-octarine text-2xl mt-10 mb-6">debt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="stat-card border-l-4 border-l-red-500">
                <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Total outstanding debt</p>
                <p className="font-octarine text-5xl leading-none text-red-600">{formatCurrency(council.finance.totalDebt)}</p>
                <p className="text-sm font-dm text-gray-500 mt-2">
                  total borrowing as at 31 December 2025
                </p>
                <p className="text-sm font-dm text-gray-400 mt-1">
                  PWLB loans, bank loans, bonds, and other sources
                </p>
                <a href="https://assets.publishing.service.gov.uk/media/69a967631f59a04b996e77ad/Q3_2025_26_Borrowing_and_Investment_Live_Table.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG Borrowing Q3 2025-26 (.ods) →</a>
              </div>
              {council.finance.expenditure && (
                <div className="stat-card border-l-4 border-l-red-300">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Debt to expenditure ratio</p>
                  <p className="font-octarine text-5xl leading-none text-red-600">
                    {((council.finance.totalDebt / council.finance.expenditure) * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm font-dm text-gray-500 mt-2">
                    debt as a percentage of annual expenditure
                  </p>
                  <p className="text-sm font-dm text-gray-400 mt-1">
                    {council.finance.totalDebt > council.finance.expenditure
                      ? 'Debt exceeds one full year of spending'
                      : `${(council.finance.totalDebt / council.finance.expenditure).toFixed(1)}x annual expenditure`}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Income breakdown */}
        {council.finance && (council.finance.expenditure || council.finance.councilTax || council.finance.parkingIncome) && (
          <>
            <h2 className="font-octarine text-2xl mt-10 mb-6">income breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {council.finance.expenditure && (
                <div className="stat-card border-l-4 border-l-lfg-orange">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Total expenditure</p>
                  <p className="font-octarine text-4xl leading-none text-lfg-black">{formatCurrency(council.finance.expenditure)}</p>
                  <p className="text-sm font-dm text-gray-500 mt-2">annual revenue expenditure</p>
                  <a href="https://assets.publishing.service.gov.uk/media/692ed8ac9c1eda2cdf03440b/RS_LA_Data_2024-25_data_by_LA.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG RS 2024-25 (.ods) →</a>
                </div>
              )}

              {council.finance.councilTax && (
                <div className="stat-card border-l-4 border-l-lfg-blue">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Council tax</p>
                  <p className="font-octarine text-4xl leading-none text-lfg-black">{formatCurrency(council.finance.councilTax)}</p>
                  <p className="text-sm font-dm text-gray-500 mt-2">annual council tax requirement</p>
                  <a href="https://assets.publishing.service.gov.uk/media/663a45b51834d96a0aa6d1d4/Table_9_24-25__revised_.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG CTR1 Table 9 (.ods) →</a>
                </div>
              )}


              {council.finance.businessRates && (
                <div className="stat-card border-l-4 border-l-lfg-orange">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Business rates retained</p>
                  <p className="font-octarine text-4xl leading-none text-lfg-black">{formatCurrency(council.finance.businessRates)}</p>
                  <p className="text-sm font-dm text-gray-500 mt-2">retained from rate retention scheme</p>
                  <a href="https://assets.publishing.service.gov.uk/media/692ed8ac9c1eda2cdf03440b/RS_LA_Data_2024-25_data_by_LA.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG RS 2024-25 (.ods) →</a>
                </div>
              )}

              {council.finance.parkingIncome && (
                <div className="stat-card border-l-4 border-l-lfg-blue">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Parking income</p>
                  <p className="font-octarine text-4xl leading-none text-lfg-black">{formatCurrency(council.finance.parkingIncome)}</p>
                  <p className="text-sm font-dm text-gray-500 mt-2">
                    on-street + off-street
                  </p>
                  <p className="text-sm font-dm text-gray-500 mt-1">
                    surplus: {council.finance.parkingSurplus ? formatCurrency(council.finance.parkingSurplus) : '—'}
                  </p>
                  <a href="https://assets.publishing.service.gov.uk/media/692ed8f69c1eda2cdf03440d/RO2_LA_Data_2024-25_data_by_LA.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG RO2 2024-25 (.ods) →</a>
                </div>
              )}

              {council.finance.feesCharges && (
                <div className="stat-card border-l-4 border-l-lfg-yellow">
                  <p className="text-sm font-dm text-gray-500 uppercase tracking-wider mb-2">Fees, charges &amp; sales</p>
                  <p className="font-octarine text-4xl leading-none text-lfg-black">{formatCurrency(council.finance.feesCharges)}</p>
                  <p className="text-sm font-dm text-gray-500 mt-2">planning, social care, licensing, leisure etc.</p>
                  <a href="https://assets.publishing.service.gov.uk/media/692ed8baa245b0985f0343e5/RSX_LA_Data_2024-25_data_by_LA.ods" target="_blank" rel="noopener noreferrer" className="block text-xs font-dm text-gray-300 hover:text-lfg-orange mt-3 pt-3 border-t border-gray-100">Download: MHCLG RSX 2024-25 (.ods) →</a>
                </div>
              )}
            </div>
          </>
        )}

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
            Council expenditure from MHCLG Revenue Outturn 2024-25. Council tax from MHCLG CTR1 Table 9, 2024-25.
          </p>
        </div>
      </section>
    </div>
  )
}
