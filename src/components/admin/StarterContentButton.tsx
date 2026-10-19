'use client'

import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Result = {
  posts: number
  faqs: number
  about: boolean
  imagesSkipped: number
  error?: string
}

// Above the posts list: add the starter news, about page, FAQs and contact links to a database
// that has none yet. Running it again adds nothing that is already there.
export function StarterContentButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function run() {
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/posts/starter-content', {
        method: 'POST',
        credentials: 'include',
      })
      setResult(await res.json())
      router.refresh()
    } catch (err) {
      setResult({
        posts: 0,
        faqs: 0,
        about: false,
        imagesSkipped: 0,
        error: (err as Error).message,
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Button buttonStyle="secondary" size="small" disabled={busy} onClick={run}>
        {busy ? 'กำลังนำเข้า… (อาจใช้เวลาสักครู่)' : 'นำเข้าเนื้อหาตั้งต้น'}
      </Button>
      <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        ใส่ข่าวจาก lomprayah.com (เป็นฉบับร่าง), หน้าเกี่ยวกับเรา, FAQ, บริการหน้าแรก
        และลิงก์โซเชียล ส่วนที่มีอยู่แล้วจะไม่ถูกแก้
      </p>
      {result && (
        <p style={{ marginTop: 8, fontSize: 13 }}>
          {result.error
            ? `นำเข้าไม่สำเร็จ: ${result.error}`
            : result.posts || result.faqs || result.about
              ? `เพิ่มข่าว ${result.posts} รายการ (ฉบับร่าง รอกด Publish)` +
                (result.faqs ? ` · FAQ ${result.faqs} ข้อ` : '') +
                (result.about ? ' · หน้าเกี่ยวกับเรา' : '') +
                (result.imagesSkipped ? ` · ดึงรูปไม่ได้ ${result.imagesSkipped} รูป` : '')
              : 'มีเนื้อหาตั้งต้นครบแล้ว ไม่ได้เพิ่มอะไร'}
        </p>
      )}
    </div>
  )
}
