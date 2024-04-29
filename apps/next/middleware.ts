import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { loadEvaluationPage, loadPageExperiment } from './data/sanity'
import { PagePayload } from './types'

export async function middleware(request: NextRequest) {
  const sanityPage = await loadPageExperiment(request.nextUrl.pathname)
  const experiment = sanityPage?.experiment

  if (!experiment) {
    // Return next() if page is not part of an experiment
    return NextResponse.next()
  }
  // Fetch Amplitude evaluation based on page experiment
  const evaluation = await fetchAmplitudeEvalutation(experiment)

  if (!evaluation || experiment.variant === evaluation?.[experiment.key].key) {
    // Return next() if page experiment is the same as Amplitude evaluation
    return NextResponse.next()
  }
  // Fetch treatment page
  const sanityTreatmentPage = await loadEvaluationPage({
    key: experiment.key,
    variant: evaluation[experiment.key].key,
  })

  if (sanityTreatmentPage?.pathname.current) {
    // Rewrite to treatment page
    return NextResponse.rewrite(
      new URL(sanityTreatmentPage?.pathname.current, request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manage|blocks|favicons|fonts|images|studio-docs).*)',
  ],
}

async function fetchAmplitudeEvalutation(
  experiment: PagePayload['experiment'],
) {
  const deploymentKey = process.env.NEXT_PUBLIC_AMPLITUDE_DEPLOYMENT_KEY
  const endpoint = new URL('https://api.lab.amplitude.com/v1/vardata')

  if (!experiment || !deploymentKey) {
    return null
  }

  endpoint.searchParams.set('flag_key', experiment.key)
  endpoint.searchParams.set('device_id', Math.random().toString(36))

  const result = await fetch(endpoint.href, {
    method: 'GET',
    headers: {
      Authorization: `Api-Key ${deploymentKey}`,
    },
  })

  if (!result.ok) {
    console.error(result)
    return null
  }

  const data = await result.json()

  return data
}
