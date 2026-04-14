'use client'

import dynamic from 'next/dynamic'
import { useState, useMemo } from 'react'
import type { ContractRelease } from '@/lib/types'
import { formatCurrency, formatDate, truncate, contractsFinderUrl } from '@/lib/utils'
import { geocodeBuyer } from '@/lib/geocode'

// Dynamically import the Leaflet component — never SSR'd
const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[600px] bg-lfg-cream flex items-center justify-center">
      <p className="font-dm text-lfg-black/60 animate-pulse">loading map…</p>
    </div>
  ),
})

interface MapPageClientProps {
  contracts: ContractRelease[]
}

export default function MapPageClient({ contracts }: MapPageClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Only keep contracts that have a geocodable buyer locality
  const plottableContracts = useMemo(
    () =>
      contracts.filter((c) => geocodeBuyer(c.buyer?.name, c.buyer?.address?.locality) !== null),
    [contracts]
  )

  const selectedContract = useMemo(
    () => plottableContracts.find((c) => c.id === selectedId) ?? null,
    [plottableContracts, selectedId]
  )

  function handleSelectContract(contract: ContractRelease) {
    setSelectedId(contract.id)
    // On mobile, scroll past the map so the sidebar is visible
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('map-sidebar')?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Stat bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <p className="font-dm text-sm text-gray-500">
          <span className="font-bold text-lfg-black">{contracts.length}</span> contracts
          fetched —{' '}
          <span className="font-bold text-lfg-orange">{plottableContracts.length}</span>{' '}
          plotted on map
        </p>
        {plottableContracts.length < contracts.length && (
          <p className="font-dm text-xs text-gray-400">
            (contracts without a recognised UK locality are not shown)
          </p>
        )}
      </div>

      {/* Desktop: map left, sidebar right | Mobile: map top, list below */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Map */}
        <div className="flex-1 min-w-0 border-2 border-lfg-black overflow-hidden">
          <MapClient
            contracts={contracts}
            onSelectContract={handleSelectContract}
            selectedId={selectedId}
          />
        </div>

        {/* Sidebar */}
        <aside
          id="map-sidebar"
          className="w-full lg:w-[360px] shrink-0 flex flex-col"
          aria-label="Plotted contracts list"
        >
          <div className="bg-lfg-black text-white px-4 py-3 flex items-center justify-between">
            <h2 className="font-octarine text-lg lowercase">plotted contracts</h2>
            <span className="font-dm text-xs text-gray-400">
              {plottableContracts.length} shown
            </span>
          </div>

          {plottableContracts.length === 0 ? (
            <div className="border-2 border-t-0 border-lfg-black p-6 text-center font-dm text-gray-400 text-sm flex-1">
              No contracts with known locations found.
            </div>
          ) : (
            <ul
              className="border-2 border-t-0 border-lfg-black divide-y divide-gray-100 overflow-y-auto"
              style={{ maxHeight: 'calc(600px - 48px)' }}
              role="listbox"
              aria-label="Contracts on map"
            >
              {plottableContracts.map((contract) => {
                const value =
                  contract.awards?.[0]?.value?.amount ??
                  contract.tender?.value?.amount
                const awardDate =
                  contract.awards?.[0]?.date ?? contract.publishedDate
                const isSelected = contract.id === selectedId

                return (
                  <li key={contract.id} role="option" aria-selected={isSelected}>
                    <button
                      onClick={() => handleSelectContract(contract)}
                      className={`w-full text-left px-4 py-3 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-lfg-orange focus-visible:ring-inset ${
                        isSelected
                          ? 'bg-lfg-orange/10 border-l-4 border-lfg-orange'
                          : 'hover:bg-lfg-cream border-l-4 border-transparent'
                      }`}
                      aria-label={`Select contract: ${contract.tender?.title || 'Untitled'}`}
                    >
                      <p className="font-dm font-bold text-sm text-lfg-black leading-snug mb-1">
                        {truncate(contract.tender?.title || 'Untitled contract', 72)}
                      </p>
                      <p className="font-dm text-xs text-gray-500 mb-1.5">
                        {contract.buyer?.name || '—'}
                        {contract.buyer?.address?.locality
                          ? ` · ${contract.buyer.address.locality}`
                          : ''}
                      </p>
                      <div className="flex items-center gap-3">
                        {value && (
                          <span className="font-dm font-bold text-xs text-lfg-orange">
                            {formatCurrency(value)}
                          </span>
                        )}
                        <span className="font-dm text-xs text-gray-400">
                          {formatDate(awardDate)}
                        </span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Selected contract detail panel */}
          {selectedContract && (
            <div
              className="mt-4 border-2 border-lfg-black bg-lfg-cream p-4"
              aria-live="polite"
              aria-label="Selected contract details"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-octarine lowercase text-base leading-snug flex-1">
                  {truncate(selectedContract.tender?.title || 'Untitled contract', 80)}
                </h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="shrink-0 text-gray-400 hover:text-lfg-black font-dm text-xs mt-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-lfg-orange"
                  aria-label="Deselect contract"
                >
                  ✕
                </button>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm font-dm">
                <dt className="text-gray-500 font-medium">Buyer</dt>
                <dd className="font-bold text-lfg-black">
                  {selectedContract.buyer?.name || '—'}
                </dd>

                {selectedContract.buyer?.address?.locality && (
                  <>
                    <dt className="text-gray-500 font-medium">Location</dt>
                    <dd>
                      {[
                        selectedContract.buyer.address.locality,
                        selectedContract.buyer.address.region,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </dd>
                  </>
                )}

                {(() => {
                  const v =
                    selectedContract.awards?.[0]?.value?.amount ??
                    selectedContract.tender?.value?.amount
                  return v ? (
                    <>
                      <dt className="text-gray-500 font-medium">Value</dt>
                      <dd className="font-bold text-lfg-orange">{formatCurrency(v)}</dd>
                    </>
                  ) : null
                })()}

                {selectedContract.awards?.[0]?.suppliers?.[0]?.name && (
                  <>
                    <dt className="text-gray-500 font-medium">Supplier</dt>
                    <dd className="font-bold">
                      {selectedContract.awards[0].suppliers[0].name}
                    </dd>
                  </>
                )}

                <dt className="text-gray-500 font-medium">Published</dt>
                <dd>{formatDate(selectedContract.publishedDate)}</dd>
              </dl>

              {selectedContract.tender?.description && (
                <p className="mt-3 text-xs font-dm text-gray-600 leading-relaxed border-t border-lfg-black/10 pt-3">
                  {truncate(selectedContract.tender.description, 220)}
                </p>
              )}

              <a
                href={contractsFinderUrl(selectedContract.ocid)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center btn-primary text-xs"
              >
                view on Contracts Finder →
              </a>
            </div>
          )}
        </aside>
      </div>

      {/* Attribution note */}
      <p className="mt-4 font-dm text-xs text-gray-400">
        Data from{' '}
        <a
          href="https://www.contractsfinder.service.gov.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-lfg-black"
        >
          Contracts Finder
        </a>
        . Map tiles by{' '}
        <a
          href="https://carto.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-lfg-black"
        >
          CARTO
        </a>
        .
      </p>
    </div>
  )
}
