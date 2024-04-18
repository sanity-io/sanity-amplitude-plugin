import {definePathname} from '@tinloof/sanity-studio'
import {defineField, defineType} from 'sanity'
import {ExperimentInput} from '../components/ExperimentInput'
import {validateExperiment} from '../utils/experimentValidation'

export default defineType({
  type: 'document',
  name: 'page',
  groups: [
    {
      name: 'content',
      title: 'Content',
      icon: () => '📄',
    },
    {
      name: 'A/B testing',
      title: 'A/B testing',
      icon: () => '🧪',
    },
  ],
  fields: [
    {...definePathname({name: 'pathname'}), group: 'content'},
    {
      type: 'string',
      name: 'title',
      group: 'content',
    },
    {
      type: 'image',
      name: 'image',
      group: 'content',
    },
    defineField({
      name: 'experiment',
      title: 'Experiment',
      type: 'object',
      group: 'A/B testing',
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
      validation: (Rule) =>
        Rule.custom(async (value, context) => validateExperiment(value, context)),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      image: 'image',
    },
    prepare({title, image}) {
      return {
        title,
        media: image,
      }
    },
  },
})
