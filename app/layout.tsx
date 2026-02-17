import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Real Estate Agents SaaS",
  description: "Real Estate SaaS MVP for Gmail users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <Script src="https://www.google.com/recaptcha/enterprise.js?render=6LfhzW4sAAAAAGKG89mGYv3xOLwF2VpElW9uFgks"/>
      </Head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

