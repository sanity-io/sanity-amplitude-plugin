const config = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  sanity: {
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2023-06-21",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    revalidateSecret: process.env.SANITY_REVALIDATE_SECRET || "",
    studioUrl: "/studio",
    // Not exposed to the front-end, used solely by the server
    token: process.env.SANITY_API_TOKEN || "",
  },
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "",
  siteName: "Base",
};

export default config;
