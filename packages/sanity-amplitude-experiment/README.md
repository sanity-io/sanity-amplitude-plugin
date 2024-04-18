# @tinloof/sanity-amplitude-experiment

A plugin to easily connect your Amplitude experiments with your Sanity documents.

## Installation

```sh
npm install @tinloof/sanity-amplitude-experiment
```

## Requirements

- A Sanity project
- An [Amplitude](https://amplitude.com/) account (Growth plan)
- An Amplitude [Management API key](https://www.docs.developers.amplitude.com/guides/amplitude-keys-guide/?h=keys#scim-key)

## Basic usage

#### 1. Configure the plugin in `sanity.config.ts`

```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {amplitudeExperiment} from '@tinloof/sanity-amplitude-experiment'
import schemas from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.SANITY_STUDIO_DATASET || ''

export default defineConfig({
  projectId,
  dataset,
  plugins: [structureTool(), amplitudeExperiment()],
  schema: {
    types: schemas,
  },
})
```

#### 2. Add the `amplitude-experiment` field to your document

```ts
import {defineField, defineType} from 'sanity'

export default defineType({
  type: 'document',
  name: 'page',
  fields: [
    defineField({
      type: 'string',
      name: 'title',
      group: 'content',
    }),
    defineField({
      name: 'experiment',
      type: 'amplitude-experiment',
    }),
  ],
})
```

#### 3. Configure your Management API key

<video controls src="https://github.com/tinloof/sanity-amplitude-experiment/assets/10447155/7ee32742-a8ba-4b52-b0c5-bae5de4fcb1d">
</video>
