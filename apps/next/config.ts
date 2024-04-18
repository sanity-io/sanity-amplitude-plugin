const config = {
  sanity: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || '',
    // Not exposed to the front-end, used solely by the server
    token: process.env.SANITY_API_TOKEN || '',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-06-21',
    revalidateSecret: process.env.SANITY_REVALIDATE_SECRET || '',
    studioUrl: '/studio',
  },
  siteName: 'A/B Testing Demo',
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || '',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || '',
}

export default config
