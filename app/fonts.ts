import localFont from "next/font/local";

/**
 * Deezer Product Font Family
 * Loaded from local font files with all weight variants
 */
export const deezerFont = localFont({
  src: [
    {
      path: "../deezer-font/DeezerProduct-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../deezer-font/DeezerProduct-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../deezer-font/DeezerProduct-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../deezer-font/DeezerProduct-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../deezer-font/DeezerProduct-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-deezer",
  display: "swap",
});
