/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Sent on every response. No CSP here on purpose: the site uses inline
  // styles and Next's inline bootstrap, so a policy worth having needs a
  // nonce, and a loose one is just theatre.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // stop browsers second-guessing a declared content type
          { key: "X-Content-Type-Options", value: "nosniff" },
          // no framing: the admin dashboard is the thing worth clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // send the origin to other sites, the full path only to our own
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // nothing here needs a camera, a mic or a location
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // https only, once the domain is live on https
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

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
