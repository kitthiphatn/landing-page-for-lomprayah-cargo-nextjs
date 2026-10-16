'use client'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

// A hex color text field with the browser's color picker beside it
export const ColorField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError } = useField<string>({ path })
  const hex = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'

  return (
    <div className="field-type text" style={{ flex: '1 1 0' }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="color"
          value={hex}
          onChange={(e) => setValue(e.target.value)}
          aria-label={typeof field.label === 'string' ? field.label : path}
          style={{
            width: 44,
            height: 40,
            padding: 2,
            border: 0,
            background: 'none',
            cursor: 'pointer',
          }}
        />
        <input
          type="text"
          value={value ?? ''}
          placeholder="#132968"
          onChange={(e) => setValue(e.target.value.trim())}
          style={{
            flex: 1,
            height: 40,
            padding: '0 12px',
            fontFamily: 'monospace',
            border: `1px solid ${showError ? 'var(--theme-error-500)' : 'var(--theme-elevation-150)'}`,
            borderRadius: 4,
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
          }}
        />
      </div>
      <FieldError path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
