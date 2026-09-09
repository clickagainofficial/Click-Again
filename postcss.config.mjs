/**
 * Tailwind is only imported by app/admin/admin.css, so the public pages
 * keep their hand-written CSS and never load a utility framework.
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
