import type { Metadata, Viewport } from "next";
import { deezerFont } from "./fonts";
import "./globals.css";
import { Providers } from "./components/providers";

export const metadata: Metadata = {
  title: {
    default: "Deezer Legends - Générez Votre Carte de Légende Musicale",
    template: "%s | Deezer Legends",
  },
  description:
    "Transformez n'importe quel profil Deezer en une superbe carte à collectionner holographique. Découvrez votre statut de légende musicale, visualisez vos artistes préférés sous forme d'attaques, et partagez-la avec le monde. Disponible en Français et Anglais.",
  applicationName: "Deezer Legends",
  verification: {
    google: "4QRu67RELS06oDzjPHno4lJpdTAgdOMnanaIDBy39Ao",
  },
  authors: [{ name: "Maxime Mansiet", url: "https://www.linkedin.com/in/maximemansiet/" }],
  generator: "Next.js",
  keywords: [
    "carte deezer",
    "deezer legends",
    "statistiques musique",
    "carte à collectionner",
    "générateur de carte",
    "musique",
    "artiste",
    "top artistes",
    "carte holographique",
    "profil deezer",
    "music trading card",
    "music stats",
    "holographic card",
    "deezer wrapped",
    "music portfolio",
    "trading card generator",
    "pokemon style card",
    "tcg",
    "music legend",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Maxime Mansiet",
  publisher: "Maxime Mansiet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://deezer-legends.vercel.app",
    title: "Deezer Legends - Générez Votre Carte Légende Musicale",
    description:
      "Transformez votre profil Deezer en une carte à collectionner holographique légendaire. Visualisez vos statistiques musicales comme jamais auparavant !",
    siteName: "Deezer Legends",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aperçu Deezer Legends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deezer Legends - Votre Musique, Votre Carte",
    description:
      "Générez votre carte musicale holographique unique basée sur vos statistiques Deezer.",
    creator: "@maximemansiet",
    images: ["/og-image.png"],
  },
  category: "Music",
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
    <html lang="fr" className="dark">
      <body className={`${deezerFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
