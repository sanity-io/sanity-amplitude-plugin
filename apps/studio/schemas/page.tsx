import {definePathname} from '@tinloof/sanity-studio'
import {defineField, defineType} from 'sanity'

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
      type: 'amplitude-experiment',
      group: 'A/B testing',
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
