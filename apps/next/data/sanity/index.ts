import { PagePayload } from '@/types'
import { loadQuery } from './loadQuery'
import {
  PAGE_EXPERIMENT_QUERY,
  PAGE_EVALUATION_QUERY,
  PAGE_QUERY,
} from './queries'

export async function loadPage(pathname: string) {
  return loadQuery<PagePayload | null>({
    query: PAGE_QUERY,
    params: { pathname },
  })
}

export async function loadPageExperiment(pathname: string) {
  return loadQuery<PagePayload | null>({
    query: PAGE_EXPERIMENT_QUERY,
    params: { pathname },
  })
}

export async function loadEvaluationPage({
  key,
  variant,
}: {
  key: string
  variant: string
}) {
  return loadQuery<PagePayload | null>({
    query: PAGE_EVALUATION_QUERY,
    params: { experimentKey: key, experimentVariant: variant },
  })
}
