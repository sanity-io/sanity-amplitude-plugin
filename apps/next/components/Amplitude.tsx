'use client'

import { useEffect } from 'react'
import * as amplitude from '@amplitude/analytics-browser'

export function AmplitudeSdk() {
  useEffect(() => {
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '', {
      defaultTracking: true,
    })
  })

  return null
}
