# Bitanga

A creative engineering studio portfolio — a canvas-heavy, interactive site that showcases both creative and technical expertise. Built with Next.js, TypeScript, and Three.js.

## Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router) + React 18
- **Language:** TypeScript (strict)
- **3D / Canvas:** [Three.js](https://threejs.org) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling:** Tailwind CSS with CSS-variable design tokens
- **Theming:** Light/dark/system via [next-themes](https://github.com/pacocoursey/next-themes)
- **Fonts:** `next/font` — Space Grotesk (display), Inter (sans), JetBrains Mono (mono)
- **Testing:** [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com) (jsdom)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Next.js 15.5 requires Node `^20.19`, `^22.13`, or `>=24`.

## Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the dev server                 |
| `npm run build`         | Production build                     |
| `npm start`             | Serve the production build           |
| `npm run lint`          | Lint with ESLint                     |
| `npm run typecheck`     | Type-check with `tsc`                |
| `npm test`              | Run the test suite once              |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Run tests with a coverage report     |

## Structure

```
src/
  app/                 # App Router routes
    layout.tsx         # Root layout: fonts, theme provider, nav, footer
    page.tsx           # Home (canvas-heavy hero + previews)
    portfolio/         # Work / portfolio page
    services/          # Services offered page
    globals.css        # Theme tokens + base styles
  components/
    three/             # React Three Fiber scene + canvas (client, lazy-loaded)
    ui/                # Navbar, Footer, cards, theme toggle, primitives
  hooks/               # Reusable client hooks (e.g. prefers-reduced-motion)
  lib/                 # Data (projects, services), site config, fonts, utils
```

## Notes

- The hero WebGL canvas is lazy-loaded client-side (`next/dynamic`, `ssr: false`)
  so the 3D bundle stays out of the initial payload.
- Motion respects `prefers-reduced-motion`: animations and auto-rotation are
  disabled for users who opt out.
- Design tokens live as HSL CSS variables in `globals.css` and are consumed by
  Tailwind, so theming stays centralized.
