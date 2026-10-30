import type { NextConfig } from 'next';

/**
 * Fully static site: `next build` writes plain HTML/CSS/JS to ./out, which any static host can serve.
 * There is no server, database, admin panel or API. (Redirects and response headers are not available in a static
 * export — configure them at the host; see README "Hosting".)
 */
const config: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
