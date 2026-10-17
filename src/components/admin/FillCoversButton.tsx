'use client'

import { Button } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Result = {
  checked: number
  filled: number
  noLink: number
  failed: { title: string; reason: string }[]
  error?: string
}

// Above the posts list: fetch cover images for posts that only have an original-article link
export function FillCoversButton() {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<Result | null>(null)

  async function run() {
    setBusy(true)
    setResult(null)
    try {
      const res = await fetch('/api/posts/fill-covers', { method: 'POST', credentials: 'include' })
      setResult(await res.json())
      router.refresh()
    } catch (err) {
      setResult({ checked: 0, filled: 0, noLink: 0, failed: [], error: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <Button buttonStyle="secondary" size="small" disabled={busy} onClick={run}>
        {busy ? 'กำลังดึงรูป…' : 'ดึงรูปปกจากลิงก์บทความต้นฉบับ'}
      </Button>
      <p style={{ margin: '4px 0 0', color: 'var(--theme-elevation-500)', fontSize: 13 }}>
        สำหรับบทความที่ยังไม่มีรูปปก ระบบจะไปเอารูปหน้าปกจากลิงก์ต้นฉบับมาใส่ให้
      </p>
      {result && (
        <div style={{ marginTop: 8, fontSize: 13 }}>
          {result.error ? (
            <p>ดึงรูปไม่สำเร็จ: {result.error}</p>
          ) : (
            <p>
              ใส่รูปปกแล้ว {result.filled} บทความ
              {result.noLink > 0 && ` · ไม่มีลิงก์ต้นฉบับ ${result.noLink} บทความ`}
              {result.failed.length > 0 && ` · ดึงไม่ได้ ${result.failed.length} บทความ`}
              {result.checked === 0 && ' (ทุกบทความมีรูปปกแล้ว)'}
            </p>
          )}
          {result.failed.length > 0 && (
            <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
              {result.failed.map((f, i) => (
                <li key={i}>
                  {f.title}: {f.reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
