'use client'

import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet'

export type MapStop = { code: string; name: string; lat: number; lng: number }
export type RouteMapProps = {
  passed: MapStop[]
  remaining: MapStop[]
  current: MapStop | null
  destination: MapStop | null
}

type LatLng = [number, number]

// Bends each leg a little so sea crossings read as a route instead of straight lines over land
function curve(a: MapStop, b: MapStop, steps = 16): LatLng[] {
  const mx = (a.lat + b.lat) / 2
  const my = (a.lng + b.lng) / 2
  const dx = b.lat - a.lat
  const dy = b.lng - a.lng
  const cx = mx - dy * 0.18
  const cy = my + dx * 0.18
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps
    const u = 1 - t
    return [
      u * u * a.lat + 2 * u * t * cx + t * t * b.lat,
      u * u * a.lng + 2 * u * t * cy + t * t * b.lng,
    ]
  })
}

function path(stops: MapStop[]): LatLng[] {
  return stops.slice(1).flatMap((s, i) => curve(stops[i]!, s))
}

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 0) return
    // From md up the live card covers the bottom of the map, so keep the route above it
    const bottom = window.matchMedia('(min-width: 768px)').matches ? 230 : 40
    if (points.length === 1) map.setView(points[0]!, 10)
    else
      map.fitBounds(L.latLngBounds(points), {
        paddingTopLeft: [40, 50],
        paddingBottomRight: [40, bottom],
        maxZoom: 11,
      })
  }, [map, points])
  return null
}

const currentIcon = L.divIcon({
  className: '',
  html: '<span class="lp-map-current"><span></span></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

export default function RouteMapLeaflet({
  passed,
  remaining,
  current,
  destination,
}: RouteMapProps) {
  const stops = [...passed, ...remaining.slice(passed.length ? 1 : 0)]
  const pointsKey = stops.map((s) => s.code).join(',')
  // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute only when the stops change
  const all = useMemo<LatLng[]>(() => stops.map((s) => [s.lat, s.lng]), [pointsKey])
  const center: LatLng = all[0] ?? [9.75, 99.9]

  return (
    <MapContainer
      center={center}
      zoom={9}
      scrollWheelZoom={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={all} />
      {remaining.length > 1 && (
        <Polyline
          positions={path(remaining)}
          pathOptions={{ color: '#7b88a8', weight: 3, dashArray: '4 8' }}
        />
      )}
      {passed.length > 1 && (
        <Polyline positions={path(passed)} pathOptions={{ color: '#0e7c86', weight: 4 }} />
      )}
      {stops.map((s) =>
        s.code === current?.code || s.code === destination?.code ? null : (
          <CircleMarker
            key={s.code}
            center={[s.lat, s.lng]}
            radius={6}
            pathOptions={{ color: '#0e7c86', weight: 3, fillColor: '#ffffff', fillOpacity: 1 }}
          >
            <Tooltip direction="top">{s.name}</Tooltip>
          </CircleMarker>
        ),
      )}
      {destination && destination.code !== current?.code && (
        <CircleMarker
          center={[destination.lat, destination.lng]}
          radius={8}
          pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#d64545', fillOpacity: 1 }}
        >
          <Tooltip direction="top" permanent>
            {destination.name}
          </Tooltip>
        </CircleMarker>
      )}
      {current && (
        <Marker position={[current.lat, current.lng]} icon={currentIcon}>
          <Tooltip direction="top" permanent offset={[0, -12]}>
            {current.name}
          </Tooltip>
        </Marker>
      )}
    </MapContainer>
  )
}
