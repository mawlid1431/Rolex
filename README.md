# Rolex (SG)

Singapore (`en-sg`) Rolex marketing site built with Next.js.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Base UI / shadcn |
| Motion | GSAP, Framer Motion |
| Package manager | Bun |

No Python. App code is TypeScript / React only.

## Quick start

```bash
# From this folder (rolex/)
bun install
cp .env.example .env
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Production build |
| `bun start` | Serve the production build |
| `bun run lint` | Run ESLint |

## Environment

Copy `.env.example` → `.env` (`.env` is gitignored).

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Site origin for metadata / absolute URLs | `http://localhost:3000` |

## Pages

Routes under `/en-sg/...` (see `lib/site.ts` → `ROUTES`):

- Home
- New watches — Perpetual Padellone
- Yacht-Master II (model page)
- Watchmaking — A unique approach
- About Rolex — Sustainable development
- Wishlist

All navigation stays inside this app.

## Project layout

```
app/                 # Routes (App Router), fonts, global styles
components/
  cms/               # Block registry + page renderer
  sections/          # One component per CMS section type
  navigation/        # Header, menus, search, language pane
  layout/            # Footer and shell pieces
  media/             # Picture / video helpers
lib/
  cms/               # Parse, types, media helpers
  site.ts            # Locale, routes, link resolution
public/              # Images, logos, videos
```

**How pages work:** CMS-style JSON drives each page. `components/cms/registry.tsx` maps section names (e.g. `CoverImage`, `RollerGallery`) to React components in `components/sections/`.

## Notes

- Locale is fixed to **en-sg**.
- Keep secrets out of git — only commit `.env.example`, never `.env`.
- For Next.js behavior in this repo, see `AGENTS.md`.
