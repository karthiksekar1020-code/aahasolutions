/** Build-time configuration. The site is fully static: the only setting is the public origin used for canonical URLs and the sitemap. */
export const env = {
  siteUrl: (process.env.SITE_URL ?? '').trim().replace(/\/$/, '') || 'http://localhost:3000',
};
