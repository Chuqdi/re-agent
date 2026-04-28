/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default;

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

// module.exports = nextConfig


module.exports = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false,
})(nextConfig);