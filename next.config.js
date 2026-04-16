// /** @type {import('next').NextConfig} */
// const withPWA = require("@ducanh2912/next-pwa").default;

// const pwaConfig = withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
// });


// const nextConfig = {
//   reactStrictMode: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   env: {
//     NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
//       process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     NEXT_PUBLIC_FIREBASE_PROJECT_ID:
//       process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
//       process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
//       process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//     NEXT_PUBLIC_FIREBASE_DATABASE_URL:
//       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//     NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
//       process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//   },
// };

// module.exports = pwaConfig(nextConfig);







/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // This allows production builds to successfully complete 
    // even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

module.exports = nextConfig;