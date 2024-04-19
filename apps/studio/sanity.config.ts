import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {amplitudeExperiment} from '@tinloof/sanity-amplitude-experiment'
import schemas from './schemas'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || ''
const dataset = process.env.SANITY_STUDIO_DATASET || ''

export default defineConfig({
  name: 'default',
  title: 'Sanity Amplitude Demo',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool(), amplitudeExperiment()],
  schema: {
    types: schemas,
  },
})
