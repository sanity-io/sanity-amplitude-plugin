import { groq } from 'next-sanity'

export const PAGE_QUERY = groq`*[pathname.current == $pathname][0]`

export const PAGE_EXPERIMENT_QUERY = groq`*[pathname.current == $pathname && experiment != null][0] {
  experiment
}`

export const PAGE_EVALUATION_QUERY = groq`*[experiment.key == $experimentKey && experiment.variant == $experimentVariant][0] {
  pathname
}`
