import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sushmi & Nijin Wedding — 13 August 2026",
  description:
    "Wedding celebration website for Sushmi Rajan and Nijin Raveendran. Join us on 13 August 2026 at Sree Ragam Convention Centre, Kerala.",
  keywords: ["wedding", "Sushmi", "Nijin", "Kerala", "2026"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
