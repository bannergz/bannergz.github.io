# Portfolio: CV Sync + AI Repositioning — Design

**Date:** 2026-07-16
**Status:** Approved, pending implementation plan
**Branch:** `develop` (deploy workflow triggers on `main`, so nothing ships until merge)

## Problem

The site (`portfolio-data.ts`) has drifted from the updated CV at
`public/files/CV EN - Gonzales Zambrano Enrique Banner.pdf`, in three ways:

1. **Factually stale.** The CV shows Principal Engineer at YaVendio since Jun 2026. The site
   still shows Technical Lead at Yape as "Present" with a "Current" badge. Yape now ends
   Mar 2026. `Everis Perú` was rebranded to `NTT DATA`.
2. **Positioning gap.** The CV leads with `SOFTWARE ARCHITECT | TECHNICAL LEAD | AI` and a
   Core Strengths block (agentic orchestration, multi-agent systems, spec-driven development).
   The site mentions AI zero times. This is the differentiator and it is invisible.
3. **No SEO.** `src/app/layout.tsx` is a Client Component, which makes `export const metadata`
   impossible in Next.js. The site has no `<title>`, no description, no OpenGraph. Shared on
   LinkedIn or WhatsApp it renders as a bare URL.

Alongside these, four UX defects: five competing CTAs in the hero; `summary` rendered verbatim
in both Hero and About; Achievements repeating the hero stats bar values; animations that
ignore `prefers-reduced-motion`.

## Decisions

These were settled during brainstorming and constrain everything below:

| Decision | Choice |
|---|---|
| Site purpose | Still open to opportunities — keep the availability badge and "Hire Me", update current role |
| AI weight | AI-forward and protagonist — more aggressive than the CV itself |
| Visual scope | Data + fixes + hero rewrite. Keep the existing visual language (slate/blue, glass cards) |
| YaVendio content | Sourced from real evidence in `D:\YAVENDIO`, framed as scale and impact |
| Confidentiality | No internal repo names, URLs, or infrastructure topology |

### Confidentiality rule (binding on all copy)

`D:\YAVENDIO` is the employer's internal work. This site is public, permanent, and indexed.
Every claim must describe **what was built and at what scale**, never the internal topology.

- Allowed: "self-updating developer portal aggregating docs and OpenAPI specs across 60+ internal services"
- Forbidden: internal hostnames, repo names, vendor/product names of internal infrastructure,
  service inventories, auth provider names, cluster details

### Attribution rule (binding on all copy)

Git history shows the internal agentic harness was authored by a colleague (141 commits) with
Banner as contributor #2 (18 commits). The site MUST NOT claim he built it. The defensible
claim is **"contributor to and power user of"**. This costs nothing: the three sole-authored
projects below are stronger material and are 100% his.

Evidence backing the YaVendio bullets (verified via git):

- Developer portal — 55 of 58 commits (remaining 3 are a bot)
- Architecture docs platform — 16 of 16 commits
- Rust microservice scaffold — 13 of 13 commits
- Continuous benchmarking introduced across 3 production services, then codified as an org rule
- ~288 commits across 20 repos since Jun 2026

## Design

### 1. Types — `src/types/portfolio.ts`

Add one field to `PortfolioData`:

```ts
tagline: string;   // short, punchy — Hero only
summary: string;   // long-form — About only (existing field, unchanged shape)
```

This is what removes the duplicated-paragraph defect. No other type changes.

### 2. Data — `src/data/portfolio-data.ts`

**title:** `Software Architect | AI & Agentic Systems | Fintech at Scale`

**tagline (new):**
> I architect fintech platforms for millions of users — and build the agentic AI systems
> engineering teams run on.

**summary (rewritten, AI-forward, About only):**
> Systems Engineer with over 8 years architecting high-traffic financial platforms, now building
> the agentic AI systems and developer platforms that engineering teams run on. Principal Engineer
> at YaVendio, working across a polyglot fleet of Rust, TypeScript, and Python services.
> Previously Technical Lead at Yape, where I led the design of microservices and event-driven
> systems serving millions of users within the BCP financial ecosystem. I work where
> distributed-systems rigor meets agentic AI: spec-driven development, multi-agent workflows,
> and platforms that make teams measurably faster.

**experience — 5 entries (was 4).** New entry first:

```
period:  "Jun 2026 – Present"
role:    "Principal Engineer"
company: "YaVendio"
highlights:
  - Technical leadership of an engineering team responsible for multiple platform capabilities.
  - Built a self-updating developer portal aggregating documentation and OpenAPI specifications
    across 60+ internal services, with automated documentation-health scoring and SSO-gated access.
  - Designed an authenticated architecture-documentation platform with C4 modeling, validated in
    CI on every change.
  - Authored the organization's Rust microservice scaffold — hexagonal architecture, persistence,
    observability bootstrap, and container-based integration testing — adopted as the fleet standard.
  - Introduced continuous performance benchmarking across three production services and codified it
    as an organization-wide engineering standard.
  - Contributor to and power user of the internal agentic AI harness — skills, subagents, and safety
    hooks for Claude-based workflows — used across the engineering organization.
  - Daily delivery across a polyglot fleet of Rust, TypeScript, and Python services, spanning
    backend, frontend, and infrastructure.
```

Remaining entries — corrections only, highlights otherwise unchanged:

| Company | Change |
|---|---|
| Yape | period → `Nov 2022 – Mar 2026` (loses the "Current" badge automatically — it is index-derived) |
| Globant Perú | highlight 2 → CV's generalized wording: "financial microservices for critical customer experience (CX) functionalities" (drops the named internal Yape capabilities — confidentiality rule) |
| Everis Perú | company → `NTT DATA` |
| IBM Perú | company → `IBM` |

**skillCategories — 8 categories, AI first.** Grid is `md:grid-cols-2 lg:grid-cols-3`, so 8 cards
lay out 3/3/2 cleanly.

1. `🤖 AI & Agentic Systems` (**new, first**) — Agentic Workflows, Multi-Agent Orchestration,
   Claude / LLM Integration, LangChain, LangGraph, RAG, Spec-Driven Development,
   MCP (Model Context Protocol), AI Code Review
2. `🏗️ Software Architecture` — unchanged
3. `⚙️ Backend & Frameworks` — **add Rust** (first) and Python; Reactive Programming gains WebFlux
4. `☁️ Cloud & Infrastructure` — unchanged
5. `📊 Observability` — unchanged
6. `🗄️ Data & Persistence` (**renamed** from "Databases") — existing databases + Redis, Caffeine,
   Prisma, Hibernate, Flyway
7. `🧪 Testing & Quality` (**new**) — JUnit5, Mockito, Jest, Testcontainers, SonarQube, Checkstyle,
   Fortify, Continuous Benchmarking
8. `🔧 Engineering Practices` — unchanged

**achievements — exactly 5, all metrics unique.** Both constraints are load-bearing:
`AchievementsSection` uses `key={achievement.metric}` (duplicates would collide as React keys)
and the grid is `xl:grid-cols-5`. No value here may repeat a Hero stat.

| metric | description |
|---|---|
| `5x` | Optimization of applications and products. |
| `250%` | Efficiency improvement in the customer service process. |
| `19+` | APIs managed in production integrated with BCP's financial systems. |
| `60+` | Internal services aggregated into a self-updating developer documentation portal with automated health scoring. |
| `Org-wide` | Continuous performance benchmarking introduced across production services and codified as an engineering standard. |

`Org-wide` as a non-numeric metric is consistent with the existing design — `Millions` already
occupies that slot today and renders through the same `gradient-text text-4xl` treatment.

**specializations** → `Agentic AI Systems`, `Microservices Architecture`, `Domain Driven Design`,
`Technical Leadership` (keeps 4 for the `sm:grid-cols-2` balance).

**languages** → English level `Professional` → `Proficient` (matches CV).

### 3. SEO — `src/app/layout.tsx`

`src/app/layout-content.tsx` already exists and already does the right thing: it is the extracted
client half (the `usePathname` / `/noris` branch). Nothing imports it. This refactor was started
and abandoned. Finish it.

- `layout.tsx` drops `"use client"`, becomes a Server Component, keeps the `Inter` font and
  `globals.css` import, and renders `<LayoutContent>{children}</LayoutContent>`.
- `layout-content.tsx` is imported and used as-is — no changes needed to it.
- Add `export const metadata: Metadata` with `metadataBase: new URL("https://bannergz.github.io")`,
  title, description, OpenGraph (type `profile`), Twitter `summary_large_image`, and canonical.
- Add JSON-LD `Person` schema via `<script type="application/ld+json">`. Compatible with
  `output: "export"`.

OG image: reuse `public/BannerGonzalesWhite.png` as a stopgap. It is a 12 KB wordmark, not a
1200×630 social card. **Follow-up, out of scope:** author a proper OG image.

### 4. Hero — `src/components/sections/HeroSection.tsx`

- Renders `tagline`, not `summary`. (`summary` now appears only in About.)
- CTAs 4 → 2 + 1 icon: **Get in Touch** (primary), **Download CV** (secondary), **LinkedIn**
  (icon-only). Remove "View Experience" — the header nav already covers it.
- Stats bar → `8+ Years Experience` · `20+ Enterprise APIs` · `Millions Users Impacted` ·
  `300% AI Efficiency`. The 300% figure comes from the CV's YaVendio bullet; promoting it to the
  stats bar is what makes the AI positioning land above the fold.

### 5. Footer — `src/components/layout/Footer.tsx`

Hardcodes `"Technical Lead & Software Architect"` outside the data layer. Replace with
`portfolioData.title` so it can never drift again.

### 6. Accessibility — `src/app/globals.css`

Add a `prefers-reduced-motion: reduce` block neutralizing `.animate-fade-in` / `.animate-slide-up`
and `scroll-behavior: smooth`.

## Tests

Updated in the same commit as the code, never after.

- `test/data/portfolio-data.test.ts` — title assertion; `experience.length` 4 → 5;
  `experience[0].company` `"Yape"` → `"YaVendio"`.
- `test/components/HeroSection.test.tsx` — title; drop the `"View Experience"` assertion;
  stats assertions (`5x` → `300%`); assert `tagline` renders and `summary` does not.

New tests to add:

- `portfolio-data.test.ts` — achievement `metric` values are unique (guards the React key);
  achievements length is exactly 5 (guards `xl:grid-cols-5`).
- A test asserting `layout.tsx` exports `metadata` with a non-empty title and description —
  this is the regression that caused the SEO gap in the first place.

## Out of scope

Explicitly not touched: color palette, typography, glass-card treatment, the `/noris` page,
scroll-triggered animation, dark mode, a real OG image, and the CV PDF itself.

## Known issue, outside this repo

**The CV PDF omits Rust.** It lists `Programming Languages: Java, NodeJS`. The evidence
contradicts this: the Rust microservice scaffold is sole-authored, plus 20 commits to a Rust
service and contributions to the team's Rust guidelines. The site will list Rust. The PDF should
be corrected separately — until then the two artifacts disagree on a real skill.

## Deploy

`.github/workflows/deploy.yml` triggers on push to `main`. Work lands on `develop`; nothing
reaches production until merge. CI gates: lint, test, build.
