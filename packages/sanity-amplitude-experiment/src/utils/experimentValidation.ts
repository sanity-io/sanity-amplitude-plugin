import {ValidationContext} from 'sanity'

export async function validateExperiment(
  value: Record<string, unknown> | undefined,
  context: ValidationContext,
) {
  const {document, getClient} = context
  const client = getClient({apiVersion: '2024-04-17'})
  const id = document?._id.replace(/^drafts\./, '')

  if (!value) {
    return true
  }

  const params = {
    draft: `drafts.${id}`,
    published: id,
    type: document?._type,
    experimentId: value?.id,
    experimentVariant: value?.variant,
  }
  const query = `
    *[!(_id in [$draft, $published]) &&
      _type == $type &&
      experiment.id == $experimentId &&
      experiment.variant == $experimentVariant
    ][0] {
      _id
    }
  `

  const result = await client.fetch(query, params)

  if (result?._id && value) {
    return `Another ${document?._type} document is already using the ${value.key} experiment with variant ${value.variant}. Please select another variant.`
  }

  return true
}
