// Local stand-in for https://api.lomprayahcargo.com/api, for working on the tracking page offline.
// Usage: node scripts/mock-tracking-api.mjs   then   TRACKING_API_UPSTREAM=http://localhost:4500/api npm run dev
// Sample numbers: LP-TAO-261005-0003 (on ferry), LP-SMI-261012-0141 (delivered),
// LP-CPN-261014-0027 (ready for pickup), LP-PNG-261001-0009 (returned). Anything else returns 404.
import http from 'node:http'

const hours = { days: [1, 2, 3, 4, 5, 6, 7], open: '07:00', close: '17:00' }
const b = (code, name, nameEn, lat, lng, kind, hub = false, phone = '077-000-000') => ({
  code,
  name,
  nameEn,
  address: `ท่าเรือ${name}`,
  phone,
  branchKind: kind,
  isTransitHub: hub,
  latitude: lat,
  longitude: lng,
  operatingHours: hours,
})
const branches = [
  b('BKK', 'กรุงเทพฯ (ปิ่นเกล้า)', 'Bangkok (Pinklao)', 13.7563, 100.5018, 'mainland'),
  b('HHQ', 'หัวหิน', 'Hua Hin', 12.5684, 99.9577, 'mainland'),
  b('CPN', 'ชุมพร', 'Chumphon', 10.493, 99.18, 'gulf_hub', true),
  b('DSK', 'สุราษฎร์ธานี (ดอนสัก)', 'Surat Thani (Donsak)', 9.3167, 99.6833, 'gulf_hub', true),
  b('USM', 'เกาะสมุย', 'Koh Samui', 9.512, 100.0136, 'gulf_island'),
  b('UNT', 'เกาะสมุย (หน้าทอน)', 'Koh Samui (Nathon)', 9.5338, 99.9869, 'gulf_island'),
  b('PNG', 'เกาะพะงัน', 'Koh Phangan', 9.7479, 100.023, 'gulf_island'),
  b('TAO', 'เกาะเต่า', 'Koh Tao', 10.0956, 99.8408, 'gulf_island', false, '077-567-890'),
  { ...b('NY', 'เกาะนางยวน', 'Koh Nang Yuan', null, null, 'gulf_island'), operatingHours: null },
]

const masked = (n) => ({ name: n, phone: '08x-xxx-x231', address: 'xxx' })
const ev = (status, location, description, timestamp) => ({
  status,
  location,
  description,
  timestamp,
})
const ship = (n, status, o, d, cur, timeline) => ({
  tracking_number: n,
  status,
  origin_code: o,
  destination_code: d,
  current_location_code: cur,
  weight: 2.5,
  description: 'กล่องพัสดุ',
  sender: masked('ส***ย'),
  receiver: masked('ม***า'),
  timeline,
  total_price: null,
  trip_number: null,
  driver_name: null,
  created_at: timeline[0].timestamp,
  updated_at: timeline.at(-1).timestamp,
})
const shipments = {
  'LP-TAO-261005-0003': ship('LP-TAO-261005-0003', 'on_vessel', 'UNT', 'TAO', 'PNG', [
    ev('created', 'UNT', 'สร้างรายการพัสดุ', '2026-10-13T10:58:00Z'),
    ev('payment_confirmed', 'UNT', 'ชำระเงินเรียบร้อย', '2026-10-13T11:05:00Z'),
    ev('in_transit', 'UNT', 'พัสดุออกจากสาขาหน้าทอน', '2026-10-14T00:40:00Z'),
    ev('on_vessel', 'PNG', 'พัสดุอยู่บนเรือ แวะท่าเรือท้องศาลา เกาะพะงัน', '2026-10-14T02:12:00Z'),
  ]),
  'LP-SMI-261012-0141': ship('LP-SMI-261012-0141', 'delivered', 'DSK', 'USM', 'USM', [
    ev('created', 'DSK', 'สร้างรายการพัสดุ', '2026-10-12T03:00:00Z'),
    ev('on_vessel', 'DSK', 'พัสดุขึ้นเรือที่ท่าเรือดอนสัก', '2026-10-12T05:30:00Z'),
    ev('arrived', 'USM', 'ถึงสาขาเกาะสมุย', '2026-10-12T07:10:00Z'),
    ev('delivered', 'USM', 'ผู้รับมารับพัสดุแล้ว', '2026-10-12T09:45:00Z'),
  ]),
  'LP-CPN-261014-0027': ship('LP-CPN-261014-0027', 'ready_for_pickup', 'CPN', 'TAO', 'CPN', [
    ev('created', 'CPN', 'สร้างรายการพัสดุ', '2026-10-14T01:20:00Z'),
    ev('ready_for_pickup', 'CPN', 'รอขึ้นเรือรอบถัดไป', '2026-10-14T01:45:00Z'),
  ]),
  'LP-PNG-261001-0009': ship('LP-PNG-261001-0009', 'returned', 'PNG', 'BKK', 'PNG', [
    ev('created', 'PNG', 'สร้างรายการพัสดุ', '2026-10-01T02:00:00Z'),
    ev('returned', 'PNG', 'ติดต่อผู้รับไม่ได้ ส่งคืนผู้ส่ง', '2026-10-05T04:00:00Z'),
  ]),
}

const send = (res, code, body) => {
  res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(body))
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    if (url.pathname === '/api/branches')
      return send(res, 200, { success: true, count: branches.length, data: branches })
    const m = url.pathname.match(/^\/api\/shipments\/track\/(.+)$/)
    if (m) {
      const s = shipments[decodeURIComponent(m[1]).toUpperCase()]
      return s
        ? send(res, 200, { success: true, data: s })
        : send(res, 404, { success: false, error: 'Shipment not found' })
    }
    send(res, 404, { success: false, error: 'Not found' })
  })
  .listen(Number(process.env.PORT || 4500), () =>
    console.log('Mock tracking API on http://localhost:4500/api'),
  )
