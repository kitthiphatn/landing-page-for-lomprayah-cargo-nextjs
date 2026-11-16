import type { Locale } from '@/i18n/config'

// The company's shipping agreement (form FM-BPC-03, revision 001). Shown until the terms are
// edited in the admin, and used to pre-fill the admin form. Lines starting with "- " are sub-items.
export const DEFAULT_SHIPPING_TERMS: Record<Locale, string[]> = {
  th: [
    'Passport คิดราคาเพิ่ม 200 บาท ต่อเล่มและต่อเส้นทาง',
    'สินค้าต้องมีน้ำหนักไม่เกิน 30 กิโลกรัม / 1 ชิ้น',
    'สินค้าที่มีขนาดเกิน 1 เมตร คิดเพิ่ม 150 บาท แต่ไม่เกิน 1.50 เมตร',
    'ผู้โดยสารสามารถนำสัมภาระส่วนตัวถือขึ้นบนรถและ/หรือเรือ ได้ไม่เกิน 1 ชิ้น ต่อ 1 ท่าน กำหนดน้ำหนักกระเป๋าเดินทางใบใหญ่ไม่เกิน 20 กิโลกรัม หากน้ำหนักเกิน 20 กิโลกรัม คิดค่าใช้จ่ายเพิ่ม 200 บาท ต่อกระเป๋า 1 ใบ',
    'อุปกรณ์กีฬาทางน้ำ เช่น Surfboard (กระดานโต้คลื่น), Kite surfboard ที่มีขนาดเกิน 1 เมตร แต่ไม่เกิน 1.50 เมตร\n- เส้นทางรถ+เรือ 400 บาท\n- เส้นทางเรืออย่างเดียว 300 บาท',
    'จักรยาน\n- เส้นทางรถ+เรือ 700 บาท (รับเฉพาะรถจักรยานแบบพับเก็บได้เท่านั้น)\n- เส้นทางเรืออย่างเดียว 500 บาท',
    'บริษัทฯ ไม่รับฝากรถจักรยานยนต์ทุกชนิด',
    'ห้ามนำสัตว์เลี้ยงทุกชนิดขึ้นรถ',
    'สัตว์เลี้ยงที่นำขึ้นเรือคิดราคา 200 บาท / ตัว (แต่ต้องนำไว้ภายนอกห้องปรับอากาศ)',
    'ทางบริษัทฯ ขอสงวนสิทธิ์ในการเลือกส่งสินค้า/พัสดุ ในรอบเรือหรือรอบรถที่บริษัทฯ เห็นสมควร และไม่รับส่งวัตถุไวไฟทุกชนิด',
    'บริการดังกล่าวเป็นบริการฝากสินค้า/พัสดุเท่านั้น หากกรณีของเสียหายหรือสูญหาย ทางบริษัทฯ จะรับผิดชอบค่าเสียหายตามราคาส่งจริง แต่สูงสุดไม่เกิน 500 บาท',
    'บริษัทฯ ไม่รับส่งสินค้า/พัสดุผิดกฎหมาย สินค้า/พัสดุผิดกฎหมาย หมายถึง ยาเสพติด อาวุธสงคราม สินค้าละเมิดลิขสิทธิ์ และผู้ฝากส่งต้องอนุญาตให้สามารถเปิดตรวจสอบภายในบรรจุภัณฑ์ได้',
    'บริษัทฯ ไม่รับผิดชอบค่าเสียหายใดๆ ทั้งสิ้น กรณีสินค้า/พัสดุที่ฝากส่งเป็นสินค้า/พัสดุจำพวก อาหารสดแช่น้ำแข็งหรือแช่เย็น ไอศกรีม หรือขนมเค้กต่างๆ ที่ง่ายต่อการเสียหายระหว่างการขนส่ง',
    'ในกรณีที่ไม่มีผู้มาติดต่อรับสินค้า/พัสดุตามรายละเอียดที่ระบุไว้บนเอกสารภายใน 7 วัน ทางสาขานั้นๆ จะดำเนินการส่งสินค้า/พัสดุกลับไปยังสาขาต้นทางทันที',
  ],
  en: [
    'Passports are charged an extra 200 baht per passport, per route.',
    'Each item must weigh no more than 30 kg.',
    'Items longer than 1 metre are charged an extra 150 baht, up to a maximum length of 1.50 metres.',
    'Passengers may carry 1 piece of personal luggage each on the bus and/or boat. A large suitcase may weigh up to 20 kg; above 20 kg an extra 200 baht is charged per suitcase.',
    'Water sports equipment such as surfboards and kite surfboards longer than 1 metre but no longer than 1.50 metres\n- Bus + boat route: 400 baht\n- Boat-only route: 300 baht',
    'Bicycles\n- Bus + boat route: 700 baht (folding bicycles only)\n- Boat-only route: 500 baht',
    'The company does not accept motorcycles of any kind.',
    'Pets of any kind are not allowed on the bus.',
    'Pets taken on the boat are charged 200 baht each and must stay outside the air-conditioned cabin.',
    'The company reserves the right to choose the boat or bus departure for each shipment, and does not carry flammable materials of any kind.',
    'This is a parcel consignment service only. If an item is damaged or lost, the company is liable for its actual shipping price, up to a maximum of 500 baht.',
    'The company does not carry illegal goods, meaning drugs, weapons of war and counterfeit goods. Senders must allow the package to be opened for inspection.',
    'The company accepts no liability for perishable goods such as fresh food on ice or chilled, ice cream, or cakes, which are easily damaged in transit.',
    'If no one collects an item within 7 days as stated on the shipping document, the branch will send it back to the origin branch.',
  ],
}

export const SHIPPING_TERMS_FORM_CODE = 'FM-BPC-03 แก้ไขครั้งที่ 001'
