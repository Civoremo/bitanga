/** Global site metadata and navigation, kept in one place for reuse. */
export const site = {
  name: "Bitanga",
  tagline: "Creative engineering studio",
  description:
    "Bitanga is a creative engineering studio crafting immersive, high-performance web experiences — blending design, real-time 3D, and robust technical solutions.",
  url: "https://bitanga.studio",
  email: "hello@bitanga.studio",
  social: {
    github: "https://github.com/Civoremo/bitanga",
    x: "https://x.com/bitanga",
    linkedin: "https://www.linkedin.com/company/bitanga",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/portfolio" },
  { label: "Services", href: "/services" },
];
