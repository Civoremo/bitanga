import Link from "next/link";
import { navItems, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold">
            {site.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{site.tagline}</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 inline-block text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </div>

        <div className="flex gap-12">
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Explore
            </p>
            <ul className="mt-3 space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.social.x}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex h-14 items-center justify-between text-xs text-muted-foreground">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono">Built with Next.js &amp; Three.js</p>
        </div>
      </div>
    </footer>
  );
}
