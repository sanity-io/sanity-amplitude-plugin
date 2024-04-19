import {defineField, defineType} from 'sanity'
import {ExperimentInput} from '../components/ExperimentInput'
import {validateExperiment} from '../utils/experimentValidation'

/**
 * @public
 */
export const name = 'amplitude-experiment' as const

export default defineField({
  name,
  title: 'Amplitude Experiment',
  type: 'object',
  fields: [
    {
      name: 'key',
      type: 'string',
    },
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'variant',
      type: 'string',
    },
  ],
  components: {
    input: ExperimentInput,
  },
  validation: (Rule) => Rule.custom(async (value, context) => validateExperiment(value, context)),
})
