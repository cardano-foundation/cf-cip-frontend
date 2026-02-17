# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for [cips.cardano.org](https://cips.cardano.org) — displays Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs). Markdown content is fetched from the [cardano-foundation/CIPs](https://github.com/cardano-foundation/CIPs) GitHub repo at build time and statically generated.

## Commands

```bash
npm run dev              # Dev server with Turbopack
npm run build            # Full build: fetch GitHub data + Next.js build (requires GITHUB_TOKEN)
npm run build-no-fetch   # Build without re-fetching GitHub data (uses existing content/)
npm run lint             # ESLint (next/core-web-vitals)
```

No test runner is configured.

## Environment

`GITHUB_TOKEN` — GitHub Personal Access Token, required for `npm run build` (the fetch scripts). See `.env.example`.

## Architecture

**Framework:** Next.js 15 (App Router) + React 19 + TypeScript, deployed on Netlify.

**Content pipeline:**
1. Build scripts in `scripts/` fetch CIP/CPS markdown + metadata from GitHub API into `content/` and `data/`
2. `content-collections.ts` defines 4 collections (`cip`, `cipAnnex`, `cps`, `cpsAnnex`) with Zod schemas and a remark/rehype processing pipeline (GFM, math/KaTeX, Mermaid diagrams, syntax highlighting via shiki, autolink headings)
3. Collections are imported as `allCips`, `allCps`, etc. from `content-collections` and used in pages for static generation via `generateStaticParams()`

**Routing:**
- `/cip/[slug]` — CIP detail page (e.g., `/cip/CIP-0001`)
- `/cps/[slug]` — CPS detail page
- `/contributors` — GitHub contributors
- `/` — About/homepage
- Legacy rewrite: `/cips/cip:code` → `/cip/CIP-:code`

**State management:** React Context only — `SidebarStateProvider` (search + CIP/CPS toggle), `CommandPaletteProvider`, `ThemeProvider` (next-themes dark mode).

**UI stack:** shadcn/ui components in `components/ui/`, Radix UI primitives, Tailwind CSS 4, Geist font, lucide-react icons.

**Custom remark/rehype plugins** in `lib/`:
- `remark-remove-toc.ts` — strips auto-generated TOC from markdown
- `remark-relative-links.ts` — converts absolute GitHub links to relative site links
- `rehype-relative-images.ts` — resolves image paths for CIP/CPS content
- `rehype-unique-ids.ts` — ensures unique heading IDs across the page

## Key Conventions

- Cardano Foundation brand colors: `cf-blue-*`, `cf-green-*`, `cf-red-*`, `cf-yellow-*` (defined in `tailwind.config.js`, safelisted for dynamic status badge classes)
- Status badge colors are computed in `content-collections.ts` via `statusBadgeColor()` based on CIP/CPS status (Proposed/Draft, Active/Solved, Inactive, Open)
- `cn()` utility from `lib/utils.ts` (clsx + tailwind-merge) for conditional class merging
- Server Components by default; `'use client'` only for interactive components (sidebar, command palette, TOC, theme toggle)
- CIP frontmatter fields use PascalCase (e.g., `Title`, `Status`, `Authors`, `CIP`)
