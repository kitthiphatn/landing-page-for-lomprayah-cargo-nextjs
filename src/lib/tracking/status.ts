import type { Locale } from '@/i18n/config'

import type { ShipmentStatus } from './types'

export type StatusTone = 'muted' | 'wait' | 'move' | 'sea' | 'near' | 'ok' | 'bad' | 'warn'

type Meta = {
  th: string
  en: string
  tone: StatusTone
  progress: number
  vehicle: 'box' | 'truck' | 'boat'
}

const META: Record<ShipmentStatus, Meta> = {
  created: { th: 'สร้างรายการ', en: 'Created', tone: 'muted', progress: 0, vehicle: 'box' },
  payment_confirmed: {
    th: 'ชำระเงินแล้ว',
    en: 'Payment confirmed',
    tone: 'muted',
    progress: 8,
    vehicle: 'box',
  },
  ready_for_pickup: {
    th: 'รอรับพัสดุ',
    en: 'Ready for pickup',
    tone: 'wait',
    progress: 15,
    vehicle: 'box',
  },
  in_transit: { th: 'กำลังขนส่ง', en: 'In transit', tone: 'move', progress: 40, vehicle: 'truck' },
  on_vessel: { th: 'อยู่บนเรือ', en: 'On the ferry', tone: 'sea', progress: 55, vehicle: 'boat' },
  at_transit_point: {
    th: 'ถึงจุดพักสินค้า',
    en: 'At transit point',
    tone: 'move',
    progress: 70,
    vehicle: 'truck',
  },
  arrived: {
    th: 'ถึงสาขาปลายทาง',
    en: 'Arrived at destination',
    tone: 'near',
    progress: 85,
    vehicle: 'box',
  },
  ready_for_delivery: {
    th: 'พร้อมรับ/นำจ่าย',
    en: 'Ready for collection',
    tone: 'near',
    progress: 92,
    vehicle: 'box',
  },
  delivered: { th: 'ส่งสำเร็จ', en: 'Delivered', tone: 'ok', progress: 100, vehicle: 'box' },
  cancelled: { th: 'ยกเลิก', en: 'Cancelled', tone: 'bad', progress: 0, vehicle: 'box' },
  returned: { th: 'ตีกลับ', en: 'Returned', tone: 'warn', progress: 0, vehicle: 'box' },
}

export function statusMeta(status: string, locale: Locale) {
  const meta = META[status as ShipmentStatus]
  if (!meta)
    return { label: status, tone: 'muted' as StatusTone, progress: 0, vehicle: 'box' as const }
  return { label: meta[locale], tone: meta.tone, progress: meta.progress, vehicle: meta.vehicle }
}

export const TONE_CLASS: Record<StatusTone, string> = {
  muted: 'text-muted',
  wait: 'text-sun',
  move: 'text-navy',
  sea: 'text-sea',
  near: 'text-ok',
  ok: 'text-ok',
  bad: 'text-danger',
  warn: 'text-sun',
}
