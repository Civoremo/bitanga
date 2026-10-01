export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  /** Icon key rendered by the ServiceCard (simple inline SVG switch). */
  icon: "cube" | "code" | "spark" | "layers";
};

/** Services offered by the studio. */
export const services: Service[] = [
  {
    slug: "interactive-3d",
    title: "Interactive 3D & WebGL",
    tagline: "Real-time experiences in the browser",
    description:
      "Product configurators, immersive brand sites, and data-driven 3D — built with Three.js and React Three Fiber, tuned for performance on every device.",
    deliverables: [
      "Real-time 3D scenes & configurators",
      "Custom GLSL shaders & post-processing",
      "Performance budgets & 60fps tuning",
      "WebXR / AR explorations",
    ],
    icon: "cube",
  },
  {
    slug: "web-engineering",
    title: "Web Engineering",
    tagline: "Fast, accessible, production-grade apps",
    description:
      "Full-stack applications built on Next.js and TypeScript with a focus on accessibility, SEO, and maintainability — from prototype to scale.",
    deliverables: [
      "Next.js & TypeScript applications",
      "Design systems & component libraries",
      "API design & integrations",
      "Testing, CI/CD, and observability",
    ],
    icon: "code",
  },
  {
    slug: "creative-direction",
    title: "Creative Direction",
    tagline: "Design that moves",
    description:
      "Art direction, motion design, and interaction design that give brands a distinctive, memorable presence without sacrificing usability.",
    deliverables: [
      "Art direction & visual identity",
      "Motion & interaction design",
      "Prototyping & concept development",
      "Design systems & tokens",
    ],
    icon: "spark",
  },
  {
    slug: "technical-solutions",
    title: "Technical Solutions",
    tagline: "Hard problems, solved",
    description:
      "When off-the-shelf won't cut it, we architect bespoke solutions — from real-time data pipelines to custom rendering engines and tooling.",
    deliverables: [
      "Architecture & technical strategy",
      "Real-time & data-intensive systems",
      "Custom tooling & automation",
      "Audits & performance consulting",
    ],
    icon: "layers",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
