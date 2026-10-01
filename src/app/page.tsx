import Link from "next/link";
import { HeroCanvasMount } from "@/components/three/HeroCanvasMount";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { featuredProjects } from "@/lib/projects";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const stats = [
  { value: "60fps", label: "Real-time rendering" },
  { value: "100%", label: "TypeScript, tested" },
  { value: "A11y", label: "Accessible by default" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <HeroCanvasMount />
        </div>
        {/* Readability scrim over the canvas. */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

        <div className="container-page relative z-10">
          <div className="max-w-3xl animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {site.tagline}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              We design and build{" "}
              <span className="text-gradient">immersive</span> web experiences.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {site.name} is a creative engineering studio pairing bold design
              with real-time 3D and rock-solid technical solutions — from
              concept to production.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/portfolio"
                className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
              >
                View our work
              </Link>
              <Link
                href="/services"
                className="rounded-md border border-border bg-card/70 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:bg-muted"
              >
                Services
              </Link>
            </div>

            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-2xl font-bold sm:text-3xl">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Featured work */}
      <Section
        eyebrow="Selected work"
        title="Projects that blend craft and engineering"
        description="A sample of recent work spanning real-time 3D, data visualization, and immersive brand experiences."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <Reveal as="div" key={project.slug} delay={i * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            See all projects
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </Section>

      {/* Services */}
      <Section
        eyebrow="What we do"
        title="Services built for ambitious teams"
        description="We partner across the full lifecycle — strategy, design, and engineering — to ship experiences that stand out and stand up in production."
        className="border-t border-border"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal as="div" key={service.slug} delay={i * 80}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.18),transparent_60%)]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Have an ambitious idea? Let&apos;s build it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tell us about your project and we&apos;ll get back to you within
              two business days.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Start a project
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
