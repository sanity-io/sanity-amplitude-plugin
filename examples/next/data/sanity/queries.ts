import {groq} from "next-sanity";

export const PAGE_QUERY = groq`*[slug.current == $pathname && _type != "sanity.fileAsset" && _type != "sanity.imageAsset"][0]`;

export const PAGE_EXPERIMENT_QUERY = groq`*[slug.current == $pathname && experiment != null][0] {
  experiment
}`;

export const PAGE_EVALUATION_QUERY = groq`*[experiment.key == $experimentKey && experiment.variant == $experimentVariant][0] {
  slug
}`;
