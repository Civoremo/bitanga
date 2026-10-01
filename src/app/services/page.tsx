import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Services offered by Bitanga — interactive 3D & WebGL, web engineering, creative direction, and bespoke technical solutions.",
};

const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "We dig into your goals, users, and constraints to define what success looks like and where the hard problems are.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "We prototype interactions and visuals early — validating the experience and the tech before committing.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "We engineer production-grade, tested, accessible software with performance budgets baked in from day one.",
  },
  {
    step: "04",
    title: "Launch & evolve",
    description:
      "We ship, measure, and iterate — with observability and documentation so your team can run with it.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section className="pb-0">
        <div className="max-w-3xl">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-accent">
            Services
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            From bold concepts to shipped products
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            We combine creative direction, interaction design, and deep
            engineering to deliver experiences that showcase your brand and
            solve real technical challenges.
          </p>
        </div>
      </Section>

      <Section className="pt-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service, i) => (
            <Reveal as="div" key={service.slug} delay={(i % 2) * 80}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="How we work"
        title="A process built for clarity and momentum"
        className="border-t border-border"
      >
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((phase) => (
            <li
              key={phase.step}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="font-mono text-sm font-semibold text-accent">
                {phase.step}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {phase.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {phase.description}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-border">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to start?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tell us what you&apos;re building and we&apos;ll scope it with you.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={`mailto:${site.email}`}
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Get in touch
            </a>
            <Link
              href="/portfolio"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              See our work
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
