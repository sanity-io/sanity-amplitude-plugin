import {StudioLogo} from "@/components/StudioLogo";
import config from "@/config";
import {visionTool} from "@sanity/vision";
import {defineConfig} from "sanity";
import {structureTool} from "sanity/structure";
import {presentationTool} from "sanity/presentation";
import {amplitudeExperiment} from "@tinloof/sanity-amplitude-experiment";

import schemas from "./sanity/schemas";

export default defineConfig({
  basePath: config.sanity.studioUrl,
  dataset: config.sanity.dataset,
  icon: StudioLogo,
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft",
        },
      },
    }),
    visionTool({defaultApiVersion: config.sanity.apiVersion}),
    amplitudeExperiment(),
  ],
  projectId: config.sanity.projectId,
  schema: {
    types: schemas,
  },
  title: config.siteName,
});
