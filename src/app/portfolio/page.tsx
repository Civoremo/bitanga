import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects from Bitanga — real-time 3D, data visualization, immersive brand sites, and production web applications.",
};

export default function PortfolioPage() {
  return (
    <>
      <Section className="pb-0">
        <div className="max-w-3xl">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-accent">
            Portfolio
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Work that merges design and engineering
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            A selection of projects where we pushed the browser — rendering
            real-time 3D, visualizing data at scale, and crafting interfaces
            that feel alive while staying fast and accessible.
          </p>
        </div>
      </Section>

      <Section className="pt-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal as="div" key={project.slug} delay={(i % 3) * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
