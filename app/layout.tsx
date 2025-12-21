import type { Metadata, Viewport } from "next";
import { deezerFont } from "./fonts";
import "./globals.css";
import { Providers } from "./components/providers";

export const metadata: Metadata = {
  title: "Deezer Legends - Generate Your Music Trading Card",
  description:
    "Transform any Deezer profile into a stunning holographic trading card. Discover your music legend status and share it with the world.",
  keywords: [
    "deezer",
    "music",
    "trading card",
    "holographic",
    "legend",
    "profile",
    "stats",
  ],
  authors: [{ name: "Deezer Legends" }],
  openGraph: {
    title: "Deezer Legends",
    description: "Generate your unique holographic music trading card",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deezer Legends",
    description: "Generate your unique holographic music trading card",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${deezerFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
