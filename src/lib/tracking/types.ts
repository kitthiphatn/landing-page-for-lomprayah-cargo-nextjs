// Shapes returned by the public Lomprayah Cargo API (https://app.lomprayahcargo.com/api-docs)

export const SHIPMENT_STATUSES = [
  'created',
  'payment_confirmed',
  'ready_for_pickup',
  'in_transit',
  'on_vessel',
  'at_transit_point',
  'arrived',
  'ready_for_delivery',
  'delivered',
  'cancelled',
  'returned',
] as const
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number]

export type TimelineEvent = {
  status: ShipmentStatus | string
  location: string | null
  description: string | null
  timestamp: string
}

export type Party = { name: string | null; phone: string | null; address: string | null }

export type Shipment = {
  tracking_number: string
  status: ShipmentStatus | string
  origin_code: string | null
  destination_code: string | null
  current_location_code: string | null
  weight: number | string | null
  description: string | null
  sender: Party | null
  receiver: Party | null
  timeline: TimelineEvent[]
  created_at: string
  updated_at: string
}

export type Branch = {
  code: string
  name: string
  nameEn: string | null
  address: string | null
  phone: string | null
  branchKind: string | null
  isTransitHub: boolean
  latitude: number | null
  longitude: number | null
  operatingHours: { days: number[]; open: string; close: string } | null
}

export type TrackError = 'not_found' | 'rate_limited' | 'server' | 'network'

export type TrackResult =
  | { number: string; ok: true; shipment: Shipment }
  | { number: string; ok: false; error: TrackError }
