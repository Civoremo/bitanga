import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";

/**
 * Typography system.
 *
 * - `display` (Space Grotesk): expressive headings and hero copy.
 * - `sans` (Inter): body text and UI.
 * - `mono` (JetBrains Mono): code, labels, and technical accents.
 *
 * Each font is exposed as a CSS variable and wired into Tailwind's
 * `fontFamily` config so utilities like `font-display` resolve correctly.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const fontDisplay = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const fontVariables = `${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`;
