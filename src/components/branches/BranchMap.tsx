'use client'

import dynamic from 'next/dynamic'

export type { BranchPin } from './BranchMapLeaflet'

// Leaflet touches `window`, so it only loads in the browser
export const BranchMap = dynamic(() => import('./BranchMapLeaflet'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-chip" />,
})
