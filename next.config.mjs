/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // /services went live before the section was renamed to Solutions, so the
  // old paths keep working instead of turning into 404s.
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      {
        // slugs never contain a dot, files always do. Matching is
        // case-insensitive, so without this the images in /public/Services
        // were being redirected too.
        source: "/services/:slug([^./]+)",
        destination: "/solutions/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
