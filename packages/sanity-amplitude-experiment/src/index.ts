import {definePlugin} from 'sanity'
import pkgjson from '../package.json'
import amplitudeExperiments from './schemas/amplitude-experiments'
import {CustomStudioLayout} from './components/StudioLayout'

const pluginName = pkgjson.name

/**
 * Usage in `sanity.config.ts` (or .js)
 *
 * ```ts
 * import {defineConfig} from 'sanity'
 * import {amplitudeExperiment} from '@tinloof/sanity-plugin-amplitude-experiment'
 *
 * export default defineConfig({
 *   // ...
 *   plugins: [amplitudeExperiment()],
 * })
 * ```
 */
export const amplitudeExperiment = definePlugin(() => {
  return {
    name: pluginName,
    studio: {
      components: {
        layout: CustomStudioLayout,
      },
    },
    schema: {
      types: [amplitudeExperiments],
    },
  }
})
