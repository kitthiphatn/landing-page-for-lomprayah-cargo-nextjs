'use client'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { CircleMarker, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'

export type BranchPin = { code: string; name: string; lat: number; lng: number }
export type BranchMapProps = {
  pins: BranchPin[]
  selected: string | null
  user?: { lat: number; lng: number } | null
  onSelect?: (code: string) => void
  zoom?: number
}

type LatLng = [number, number]

const userIcon = L.divIcon({
  className: '',
  html: '<span class="lp-map-current"><span></span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function Camera({ pins, selected, user, zoom }: Omit<BranchMapProps, 'onSelect'>) {
  const map = useMap()
  const first = useRef(true)
  const pinsRef = useRef(pins)
  useEffect(() => {
    pinsRef.current = pins
  }, [pins])

  // Show every pin once, then follow the selection
  useEffect(() => {
    if (!first.current) return
    first.current = false
    const target = pins.find((p) => p.code === selected)
    if (target) map.setView([target.lat, target.lng], zoom ?? 12)
    else if (pins.length > 1)
      map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as LatLng)), {
        padding: [30, 30],
        maxZoom: 11,
      })
    else if (pins[0]) map.setView([pins[0].lat, pins[0].lng], zoom ?? 12)
  }, [map, pins, selected, zoom])

  // Only a new selection moves the map; filtering the list must not
  useEffect(() => {
    if (first.current) return
    const target = pinsRef.current.find((p) => p.code === selected)
    if (target) map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 12), { duration: 0.6 })
  }, [map, selected])

  useEffect(() => {
    if (!user) return
    const near = [...pinsRef.current]
      .sort(
        (a, b) =>
          (a.lat - user.lat) ** 2 +
          (a.lng - user.lng) ** 2 -
          ((b.lat - user.lat) ** 2 + (b.lng - user.lng) ** 2),
      )
      .slice(0, 2)
    map.fitBounds(
      L.latLngBounds([[user.lat, user.lng], ...near.map((p) => [p.lat, p.lng] as LatLng)]),
      { padding: [40, 40], maxZoom: 12 },
    )
  }, [map, user])

  return null
}

export default function BranchMapLeaflet({ pins, selected, user, onSelect, zoom }: BranchMapProps) {
  return (
    <MapContainer
      center={[9.75, 99.9]}
      zoom={8}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Camera pins={pins} selected={selected} user={user} zoom={zoom} />
      {pins.map((p) => {
        const active = p.code === selected
        return (
          <CircleMarker
            key={p.code}
            center={[p.lat, p.lng]}
            radius={active ? 10 : 7}
            pathOptions={{
              color: '#ffffff',
              weight: 2,
              fillColor: active ? '#f2a516' : '#0e7c86',
              fillOpacity: 1,
            }}
            eventHandlers={onSelect ? { click: () => onSelect(p.code) } : undefined}
          >
            {/* Leaflet reads `permanent` only on mount, so remount the tooltip when it changes */}
            <Tooltip key={String(active)} direction="top" permanent={active} offset={[0, -6]}>
              {p.name}
            </Tooltip>
          </CircleMarker>
        )
      })}
      {user && <Marker position={[user.lat, user.lng]} icon={userIcon} />}
    </MapContainer>
  )
}
