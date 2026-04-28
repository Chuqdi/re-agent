import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";
import { Suspense } from "react";

export const viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Real Estate Agents SaaS",
  description: "Real Estate SaaS MVP for Gmail users",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* <Script src="https://www.google.com/recaptcha/enterprise.js?render=6LfhzW4sAAAAAGKG89mGYv3xOLwF2VpElW9uFgks" />
         */}
        <Suspense fallback={<p>Loading...</p>}>{children}</Suspense>
      </body>
    </html>
  );
}
