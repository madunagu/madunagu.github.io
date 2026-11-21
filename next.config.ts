import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages serves static files only. `export` produces a plain `out/` site.
  output: 'export',
  // This project uses native <img> tags, but keep images unoptimized so a future
  // switch to next/image still works without a server image optimizer.
  images: { unoptimized: true },
};

export default nextConfig;
