/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default;

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = nextConfig;

module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/www\.google\.com\/recaptcha/,
      handler: "NetworkOnly",
    },
  ],
})(nextConfig);
