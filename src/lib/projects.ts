export type Project = {
  slug: string;
  title: string;
  client: string;
  year: number;
  category: "Web" | "3D / WebGL" | "Product" | "Brand";
  summary: string;
  tags: string[];
  /** Accent gradient used for the project card canvas/placeholder. */
  gradient: [string, string];
  featured?: boolean;
};

/**
 * Portfolio case studies. Replace with real work; shape is intentionally
 * simple so it can later be sourced from a CMS or MDX without UI changes.
 */
export const projects: Project[] = [
  {
    slug: "aurora-configurator",
    title: "Aurora 3D Configurator",
    client: "Aurora Labs",
    year: 2025,
    category: "3D / WebGL",
    summary:
      "A real-time product configurator rendering physically-based materials in the browser at 60fps, with shareable permalinks for every configuration.",
    tags: ["React Three Fiber", "GLSL", "Next.js", "WebGL"],
    gradient: ["#7c3aed", "#2dd4bf"],
    featured: true,
  },
  {
    slug: "meridian-dataviz",
    title: "Meridian Data Canvas",
    client: "Meridian Analytics",
    year: 2024,
    category: "Web",
    summary:
      "An interactive data-visualization platform streaming millions of points to a GPU-accelerated canvas with smooth pan, zoom, and filtering.",
    tags: ["TypeScript", "WebGL", "D3", "Web Workers"],
    gradient: ["#2563eb", "#22d3ee"],
    featured: true,
  },
  {
    slug: "nebula-brand",
    title: "Nebula Immersive Brand Site",
    client: "Nebula",
    year: 2024,
    category: "Brand",
    summary:
      "A scroll-driven immersive brand experience pairing shader-based backgrounds with accessible, performant content.",
    tags: ["Three.js", "GSAP", "Accessibility", "Next.js"],
    gradient: ["#db2777", "#f59e0b"],
    featured: true,
  },
  {
    slug: "forge-design-system",
    title: "Forge Design System",
    client: "Forge",
    year: 2023,
    category: "Product",
    summary:
      "A themeable, fully-tested component library and documentation site powering a multi-product suite.",
    tags: ["React", "Testing", "Storybook", "Design Tokens"],
    gradient: ["#0ea5e9", "#6366f1"],
  },
  {
    slug: "atlas-wayfinding",
    title: "Atlas 3D Wayfinding",
    client: "Atlas Venues",
    year: 2023,
    category: "3D / WebGL",
    summary:
      "An interactive 3D venue map with real-time routing, rendered from floorplan data and optimized for mobile devices.",
    tags: ["Three.js", "Pathfinding", "Mobile", "Performance"],
    gradient: ["#16a34a", "#84cc16"],
  },
  {
    slug: "pulse-realtime",
    title: "Pulse Realtime Dashboard",
    client: "Pulse",
    year: 2022,
    category: "Web",
    summary:
      "A low-latency operations dashboard with live charts, optimistic UI, and resilient websocket sync.",
    tags: ["TypeScript", "WebSockets", "Charts", "Next.js"],
    gradient: ["#f97316", "#ef4444"],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
