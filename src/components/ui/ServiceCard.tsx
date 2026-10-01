import type { Service } from "@/lib/services";

const icons: Record<Service["icon"], ReactSvg> = {
  cube: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </>
  ),
  code: (
    <>
      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  layers: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
    </>
  ),
};

type ReactSvg = React.ReactNode;

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card p-7 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {icons[service.icon]}
        </svg>
      </div>

      <h3 className="font-display text-xl font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="mt-1 font-mono text-xs uppercase tracking-wider text-accent">
        {service.tagline}
      </p>
      <p className="mt-4 text-sm text-muted-foreground">{service.description}</p>

      <ul className="mt-6 space-y-2.5">
        {service.deliverables.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-muted-foreground"
          >
            <svg
              className="mt-0.5 shrink-0 text-accent"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
