import type { Project } from "@/lib/projects";

/**
 * Presentational card for a portfolio project. The gradient "canvas" is a
 * lightweight CSS stand-in for a per-project thumbnail or WebGL preview.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-accent/50">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 font-mono text-xs font-medium text-white backdrop-blur-sm">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 font-mono text-xs font-medium text-white/80">
          {project.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {project.client}
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-muted-foreground">
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
