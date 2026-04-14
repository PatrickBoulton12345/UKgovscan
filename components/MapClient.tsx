'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { ContractRelease } from '@/lib/types'
import { formatCurrency, formatDate, truncate } from '@/lib/utils'
import { geocodeLocality } from '@/lib/geocode'

// Fix Leaflet's broken default icon paths in Next.js/webpack environments
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createOrangeIcon(): L.DivIcon {
  return L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="#FE5500" stroke="#000" stroke-width="1.5"/>
    </svg>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  })
}

export interface PlottedContract {
  contract: ContractRelease
  lat: number
  lng: number
}

interface MapClientProps {
  contracts: ContractRelease[]
  onSelectContract: (contract: ContractRelease) => void
  selectedId: string | null
}

export default function MapClient({
  contracts,
  onSelectContract,
  selectedId,
}: MapClientProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  const plottable: PlottedContract[] = contracts.flatMap((c) => {
    const locality = c.buyer?.address?.locality
    const coords = geocodeLocality(locality)
    if (!coords) return []
    return [{ contract: c, lat: coords[0], lng: coords[1] }]
  })

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: [54.5, -2],
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map)

    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current.clear()

    const icon = createOrangeIcon()

    plottable.forEach(({ contract, lat, lng }) => {
      const value =
        contract.awards?.[0]?.value?.amount ?? contract.tender?.value?.amount
      const awardDate =
        contract.awards?.[0]?.date ?? contract.publishedDate

      const popupHtml = `
        <div style="font-family: 'DM Sans', system-ui, sans-serif; max-width: 260px; font-size: 13px; line-height: 1.5;">
          <p style="font-weight: 700; margin: 0 0 6px; font-size: 14px; color: #000;">
            ${truncate(contract.tender?.title || 'Untitled contract', 80)}
          </p>
          <p style="margin: 0 0 4px; color: #555;">
            <span style="font-weight: 600;">Buyer:</span> ${contract.buyer?.name || '—'}
          </p>
          ${value ? `<p style="margin: 0 0 4px; color: #FE5500; font-weight: 700;">${formatCurrency(value)}</p>` : ''}
          <p style="margin: 0; color: #888; font-size: 12px;">${formatDate(awardDate)}</p>
        </div>
      `

      const marker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, { maxWidth: 280 })

      marker.on('click', () => onSelectContract(contract))
      markersRef.current.set(contract.id, marker)
    })
  }, [plottable.length, contracts]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedId || !mapRef.current) return
    const marker = markersRef.current.get(selectedId)
    if (marker) {
      mapRef.current.setView(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 9), {
        animate: true,
      })
      marker.openPopup()
    }
  }, [selectedId])

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[400px] md:h-[600px]"
      aria-label="Interactive map of UK government contracts"
      role="application"
    />
  )
}
