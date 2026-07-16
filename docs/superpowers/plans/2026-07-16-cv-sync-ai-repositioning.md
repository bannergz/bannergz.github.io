# CV Sync + AI Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sync the site with the updated CV, reposition it AI-forward, and fix the missing SEO metadata caused by `layout.tsx` being a Client Component.

**Architecture:** Everything flows from `src/data/portfolio-data.ts` — sections read from it and render. Tasks 1–3 update that data layer (each guarded by its own tests), Task 4 finishes an abandoned Server/Client split to unlock `export const metadata`, Tasks 5–7 update the consuming components.

**Tech Stack:** Next.js 16 (App Router, `output: "export"`), React 19, Tailwind CSS 4, TypeScript, Jest + ts-jest + Testing Library.

**Spec:** `docs/superpowers/specs/2026-07-16-portfolio-cv-sync-ai-repositioning-design.md`

## Global Constraints

- **Confidentiality (binding on all copy):** No internal repo names, hostnames, service inventories, auth providers, or infrastructure vendors from `D:\YAVENDIO`. Describe what was built and at what scale only.
- **Attribution (binding on all copy):** The internal agentic harness was authored by a colleague. Banner is contributor #2. The only permitted framing is **"Contributor to and power user of"** — never "built" or "authored" the harness.
- **Never invent experience.** Every bullet traces to the CV PDF or to verified git evidence. If a claim cannot be sourced, drop it.
- **Dashes:** periods use the en dash `–` (U+2013), matching existing data (`"Nov 2022 – Present"`). The tagline uses an em dash `—` (U+2014).
- **Tests ship in the same commit as the code they cover.** Never a follow-up commit.
- **Every commit leaves `rtk npm.cmd test` green.** Data changes in Tasks 1–3 break assertions in component tests owned by later tasks; each task fixes the assertions it breaks rather than deferring them. CI (lint + test + build) must pass at every commit.
- **Branch:** `feat/cv-sync-ai-repositioning`. Never commit to `develop` or `main`.
- **Component keys are load-bearing.** `ExperienceSection` keys on `entry.company`, `SkillsSection` on `category.title`, `AchievementsSection` on `achievement.metric`, and `HeroSection` (after Task 5) on `stat.value`. All four must stay unique.
- **No metric appears in both `heroStats` and `achievements`.** Each number earns its place once. Task 3 enforces this with a test.
- **Spec amendment (approved):** the spec scoped hero stats out of the data layer; this plan moves them in (Task 1 + Task 5). Everything else in the spec governs as written.

---

### Task 1: Identity & positioning data

Adds the `tagline` field that resolves the duplicated-paragraph defect (Hero and About both render `summary` today), flips the title/specializations to AI-forward, and lifts the hero stats out of JSX into the data layer.

The `heroStats` move is a deliberate amendment to the spec, which had scoped it out. Without it, Task 3's de-duplication test would have to hand-copy the hero's values into a magic array and could never actually detect drift — and leaving the hero hardcoded while Task 6 fixes the identical bug in the Footer would be incoherent.

**Files:**
- Modify: `src/types/portfolio.ts` — the `PortfolioData` interface
- Modify: `src/data/portfolio-data.ts` — the `name`/`title`/`summary` block, plus the `languages` and `specializations` arrays
- Test: `test/data/portfolio-data.test.ts`
- Test: `test/components/HeroSection.test.tsx` (title assertion only)

**Interfaces:**
- Consumes: nothing (first task).
- Produces:
  - `PortfolioData.tagline: string` — read by `HeroSection` (Task 5) and by `metadata.description` (Task 4). `PortfolioData.summary` stays `string` and becomes About-only.
  - `HeroStat { value: string; label: string }` and `PortfolioData.heroStats: HeroStat[]` — compared against `achievements` in Task 3, rendered by `HeroSection` in Task 5.

- [ ] **Step 1: Write the failing tests**

In `test/data/portfolio-data.test.ts`, replace the existing `"has the correct title"` test with these three:

```ts
  it("has the correct title", () => {
    expect(portfolioData.title).toBe(
      "Software Architect | AI & Agentic Systems | Fintech at Scale"
    );
  });

  it("has a tagline distinct from and shorter than the summary", () => {
    expect(portfolioData.tagline).toBeTruthy();
    expect(portfolioData.tagline).not.toBe(portfolioData.summary);
    expect(portfolioData.tagline.length).toBeLessThan(
      portfolioData.summary.length
    );
  });

  it("leads positioning with AI", () => {
    expect(portfolioData.title).toContain("AI");
    expect(portfolioData.specializations[0]).toBe("Agentic AI Systems");
  });

  it("has four hero stats with unique values (HeroSection keys on value)", () => {
    expect(portfolioData.heroStats).toHaveLength(4);
    const values = portfolioData.heroStats.map((s) => s.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it("leads the hero stats with experience and closes with the AI metric", () => {
    expect(portfolioData.heroStats[0].value).toBe("8+");
    expect(portfolioData.heroStats[3].value).toBe("300%");
    expect(portfolioData.heroStats[3].label).toBe("AI Efficiency Gain");
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `rtk npx.cmd jest test/data/portfolio-data.test.ts`
Expected: FAIL. `title` mismatch, and TypeScript errors on `portfolioData.tagline` and `portfolioData.heroStats` — neither property exists yet.

- [ ] **Step 3: Add `tagline` and `heroStats` to the types**

In `src/types/portfolio.ts`, add the `HeroStat` interface above `PortfolioData` (place it after the existing `Achievement` interface, matching the file's convention of one interface per concept):

```ts
export interface HeroStat {
  value: string;
  label: string;
}
```

Then add `tagline` and `heroStats` to `PortfolioData`:

```ts
export interface PortfolioData {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  contact: ContactInfo;
  heroStats: HeroStat[];
  skillCategories: SkillCategory[];
  experience: ExperienceEntry[];
  achievements: Achievement[];
  education: EducationEntry[];
  languages: LanguageEntry[];
  specializations: string[];
}
```

- [ ] **Step 4: Re-export `HeroStat` from the types barrel**

`src/types/index.ts` names every type explicitly — there is no wildcard, so a new type is invisible to `@/types` consumers until it is listed. Task 5 imports `HeroStat` from `@/types` and would fail to compile without this. Replace the export block with:

```ts
export type {
  ContactInfo,
  SkillCategory,
  ExperienceEntry,
  Achievement,
  HeroStat,
  EducationEntry,
  LanguageEntry,
  PortfolioData
} from "./portfolio";
```

- [ ] **Step 5: Update the data**

In `src/data/portfolio-data.ts`, replace the `name` / `title` / `summary` block (the first three properties of the object) with:

```ts
  name: "Banner Gonzales",
  title: "Software Architect | AI & Agentic Systems | Fintech at Scale",
  tagline:
    "I architect fintech platforms for millions of users — and build the agentic AI systems engineering teams run on.",
  summary:
    "Systems Engineer with over 8 years architecting high-traffic financial platforms, now building the agentic AI systems and developer platforms that engineering teams run on. Principal Engineer at YaVendio, working across a polyglot fleet of Rust, TypeScript, and Python services. Previously Technical Lead at Yape, where I led the design of microservices and event-driven systems serving millions of users within the BCP financial ecosystem. I work where distributed-systems rigor meets agentic AI: spec-driven development, multi-agent workflows, and platforms that make teams measurably faster.",
```

Next, insert `heroStats` immediately after the `contact` object and before `skillCategories`, matching the property order declared on the interface:

```ts
  heroStats: [
    { value: "8+", label: "Years Experience" },
    { value: "20+", label: "Enterprise APIs" },
    { value: "Millions", label: "Users Impacted" },
    { value: "300%", label: "AI Efficiency Gain" },
  ],
```

These are the values the Hero renders today except the last: `5x` / `App Optimization` becomes `300%` / `AI Efficiency Gain`. `5x` is not lost — it stays in Achievements. The `300%` figure comes from the CV's YaVendio bullet, and promoting it here is what puts the AI positioning above the fold.

The Hero component still hardcodes its own stats until Task 5; that is expected. Nothing asserts the coupling until then.

Then replace the `languages` and `specializations` arrays (the last two properties of the object) with:

```ts
  languages: [
    { language: "Spanish", level: "Native" },
    { language: "English", level: "Proficient" },
  ],
  specializations: [
    "Agentic AI Systems",
    "Microservices Architecture",
    "Domain Driven Design",
    "Technical Leadership",
  ],
```

- [ ] **Step 6: Keep the Hero test green**

Changing `title` breaks the title assertion in `test/components/HeroSection.test.tsx`. Task 5 rewrites that file wholesale, but leaving it red here would mean four consecutive commits with a failing suite and red CI. Every commit stays green. Update just that one assertion now:

```tsx
  it("renders the title", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        "Software Architect | AI & Agentic Systems | Fintech at Scale"
      )
    ).toBeInTheDocument();
  });
```

Touch nothing else in that file — the Hero component itself is Task 5's.

- [ ] **Step 7: Run the full suite to verify it passes**

Run: `rtk npm.cmd test`
Expected: all suites PASS.

- [ ] **Step 8: Commit**

```bash
rtk git add src/types/portfolio.ts src/types/index.ts src/data/portfolio-data.ts test/data/portfolio-data.test.ts test/components/HeroSection.test.tsx
rtk git commit -m "feat: add tagline and heroStats to data, reposition title AI-forward"
```

---

### Task 2: Experience sync

The factual core: a new current role, a closed Yape tenure, and two renamed employers.

**Files:**
- Modify: `src/data/portfolio-data.ts` — the `experience` array
- Test: `test/data/portfolio-data.test.ts`
- Test: `test/components/ExperienceSection.test.tsx` (asserts `"Everis Perú"` and `"IBM Perú"` today — this task renames both)

Line numbers are deliberately omitted: Task 1 already shifted this file. Anchor on the property name.

**Interfaces:**
- Consumes: `ExperienceEntry` from `src/types/portfolio.ts` (unchanged shape: `period`, `role`, `company`, `highlights`).
- Produces: `experience[0]` is YaVendio / Principal Engineer — `ExperienceSection` derives the "Current" badge from `index === 0`, so ordering is the contract.

- [ ] **Step 1: Write the failing tests**

In `test/data/portfolio-data.test.ts`, replace the existing `"has experience entries"` test with:

```ts
  it("has experience entries", () => {
    expect(portfolioData.experience.length).toBe(5);
    expect(portfolioData.experience[0].company).toBe("YaVendio");
  });

  it("shows YaVendio as the current role", () => {
    expect(portfolioData.experience[0].role).toBe("Principal Engineer");
    expect(portfolioData.experience[0].period).toContain("Present");
  });

  it("closes the Yape tenure", () => {
    const yape = portfolioData.experience.find((e) => e.company === "Yape");
    expect(yape?.period).toBe("Nov 2022 – Mar 2026");
    expect(yape?.period).not.toContain("Present");
  });

  it("has exactly one current role", () => {
    const current = portfolioData.experience.filter((e) =>
      e.period.includes("Present")
    );
    expect(current).toHaveLength(1);
  });

  it("uses current employer names", () => {
    const companies = portfolioData.experience.map((e) => e.company);
    expect(companies).toContain("NTT DATA");
    expect(companies).not.toContain("Everis Perú");
  });

  it("has unique company names (ExperienceSection keys on company)", () => {
    const companies = portfolioData.experience.map((e) => e.company);
    expect(new Set(companies).size).toBe(companies.length);
  });

  it("never claims authorship of the internal AI harness", () => {
    const allHighlights = portfolioData.experience
      .flatMap((e) => e.highlights)
      .join(" ");
    expect(allHighlights).toContain("Contributor to and power user of");
    expect(allHighlights).not.toMatch(/(built|authored|created) the .*harness/i);
  });
```

- [ ] **Step 2: Update the ExperienceSection component tests**

`test/components/ExperienceSection.test.tsx` asserts the old employer names and will break. Replace its `"renders all companies"`, `"renders current position badge"`, and `"renders job roles"` tests with:

```tsx
  it("renders all companies", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("YaVendio")).toBeInTheDocument();
    expect(screen.getByText("Yape")).toBeInTheDocument();
    expect(screen.getByText("Globant Perú")).toBeInTheDocument();
    expect(screen.getByText("NTT DATA")).toBeInTheDocument();
    expect(screen.getByText("IBM")).toBeInTheDocument();
  });

  it("badges exactly one role as current", () => {
    render(<ExperienceSection />);
    expect(screen.getAllByText("Current")).toHaveLength(1);
  });

  it("renders job roles", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Principal Engineer")).toBeInTheDocument();
    const techLeadElements = screen.getAllByText("Software Technical Lead");
    expect(techLeadElements).toHaveLength(2);
    expect(
      screen.getByText("Software Application Java Developer")
    ).toBeInTheDocument();
  });
```

The `"Software Technical Lead"` count stays at 2 (Yape + Globant) — YaVendio is Principal Engineer, so it does not change that number.

- [ ] **Step 3: Run tests to verify they fail**

Run: `rtk npx.cmd jest test/data/portfolio-data.test.ts test/components/ExperienceSection.test.tsx`
Expected: FAIL. Data: `expect(received).toBe(expected) // Expected: 5, Received: 4`. Component: unable to find text `"YaVendio"` / `"NTT DATA"`.

- [ ] **Step 4: Update the experience data**

In `src/data/portfolio-data.ts`, replace the whole `experience: [...]` array with:

```ts
  experience: [
    {
      period: "Jun 2026 – Present",
      role: "Principal Engineer",
      company: "YaVendio",
      highlights: [
        "Technical leadership of an engineering team responsible for multiple platform capabilities.",
        "Built a self-updating developer portal aggregating documentation and OpenAPI specifications across 60+ internal services, with automated documentation-health scoring and SSO-gated access.",
        "Designed an authenticated architecture-documentation platform with C4 modeling, validated in CI on every change.",
        "Authored the organization's Rust microservice scaffold — hexagonal architecture, persistence, observability bootstrap, and container-based integration testing — adopted as the fleet standard.",
        "Introduced continuous performance benchmarking across three production services and codified it as an organization-wide engineering standard.",
        "Contributor to and power user of the internal agentic AI harness — skills, subagents, and safety hooks for Claude-based workflows — used across the engineering organization.",
        "Daily delivery across a polyglot fleet of Rust, TypeScript, and Python services, spanning backend, frontend, and infrastructure.",
      ],
    },
    {
      period: "Nov 2022 – Mar 2026",
      role: "Software Technical Lead",
      company: "Yape",
      highlights: [
        "Technical leadership of an engineering team responsible for multiple capabilities of the Yape ecosystem used by millions of users.",
        "Design of solution architectures using the C4 Model and principles of DDD and microservices architecture.",
        "Responsible for more than 19 APIs in a microservices architecture integrated with BCP's financial systems.",
        "Design of event-driven solutions for processing financial transactions.",
        "Implementation of backend services with Spring Boot, Quarkus, and NodeJS.",
        "Definition of architectural guidelines for cross-organizational teams.",
        "Monitoring and observability of critical systems using Dynatrace, Datadog, Grafana, Kibana, and PagerDuty.",
        "Resolution of critical production incidents in high-availability and high-concurrency systems.",
      ],
    },
    {
      period: "Jan 2021 – Nov 2022",
      role: "Software Technical Lead",
      company: "Globant Perú",
      highlights: [
        "Technical leadership of the team responsible for core capabilities of the Yape ecosystem.",
        "Design and development of financial microservices for critical customer experience (CX) functionalities.",
        "Product monitoring using Dynatrace and Kibana tools.",
        "Design of REST APIs for high-volume transaction services.",
        "Development of more than 15 business APIs using microservices architecture.",
        "Implementation of clean and decoupled architectural patterns.",
        "Integration with the bank's core financial system.",
      ],
    },
    {
      period: "Feb 2020 – Jan 2021",
      role: "Software Application Java Developer",
      company: "NTT DATA",
      highlights: [
        "Technical team leader at BCP, achieving quarterly project goals with functionalities such as credit card payments, challenge authentication, and enrollment flows.",
        "Development, testing, and delivery of reactive applications.",
        "Product analysis and definition based on microservices architecture.",
        "Responsible for more than 10 APIs with microservices architecture.",
        "Roadmap planning and monitoring.",
      ],
    },
    {
      period: "Apr 2019 – Feb 2020",
      role: "Software University Practices",
      company: "IBM",
      highlights: [
        "Development of enterprise solutions for corporate systems.",
        "Development of backend services in Java.",
        "Integration with enterprise systems and corporate databases.",
        "Development of REST APIs for internal applications.",
        "Participation in technology modernization projects.",
        "Development of custom bots using Automation Anywhere RPA tool.",
      ],
    },
  ],
```

Note the Globant highlight 2 change: the previously-named internal Yape capabilities (Refunds, Profile Management, Blacklisting, Unenrollment, Enterprise Auth) collapse into the CV's own generalized wording. This is the confidentiality constraint, and it matches what the updated CV already says.

- [ ] **Step 5: Run tests to verify they pass**

Run: `rtk npx.cmd jest test/data/portfolio-data.test.ts test/components/ExperienceSection.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
rtk git add src/data/portfolio-data.ts test/data/portfolio-data.test.ts test/components/ExperienceSection.test.tsx
rtk git commit -m "feat: sync experience with updated CV (YaVendio, Yape end date, NTT DATA)"
```

---

### Task 3: Skills & achievements

Adds the AI skill category in first position, and de-duplicates Achievements against the Hero stats bar.

**Files:**
- Modify: `src/data/portfolio-data.ts` — the `skillCategories` and `achievements` arrays
- Test: `test/data/portfolio-data.test.ts`
- Test: `test/components/SkillsSection.test.tsx` (asserts `"Databases"` today — this task renames it)
- Test: `test/components/AchievementsSection.test.tsx` (asserts `"Millions"` and `"20+"` today — this task removes both)

**Interfaces:**
- Consumes: `SkillCategory`, `Achievement` from `src/types/portfolio.ts` (shapes unchanged).
- Produces: `achievements` with exactly 5 entries and unique `metric` values — `AchievementsSection` renders `xl:grid-cols-5` and keys on `metric`. `skillCategories[0]` is the AI category.

- [ ] **Step 1: Write the failing tests**

In `test/data/portfolio-data.test.ts`, replace the existing `"has achievements"` test with:

```ts
  it("has exactly five achievements (AchievementsSection renders xl:grid-cols-5)", () => {
    expect(portfolioData.achievements).toHaveLength(5);
  });

  it("has unique achievement metrics (AchievementsSection keys on metric)", () => {
    const metrics = portfolioData.achievements.map((a) => a.metric);
    expect(new Set(metrics).size).toBe(metrics.length);
  });

  it("does not repeat the hero stats in achievements", () => {
    const heroValues = portfolioData.heroStats.map((s) => s.value);
    const metrics = portfolioData.achievements.map((a) => a.metric);
    const overlap = metrics.filter((m) => heroValues.includes(m));
    expect(overlap).toEqual([]);
  });

  it("leads skills with the AI category", () => {
    expect(portfolioData.skillCategories[0].title).toBe("AI & Agentic Systems");
  });

  it("lists Rust among the skills", () => {
    const allSkills = portfolioData.skillCategories.flatMap((c) => c.skills);
    expect(allSkills).toContain("Rust");
  });

  it("has unique skill category titles (SkillsSection keys on title)", () => {
    const titles = portfolioData.skillCategories.map((c) => c.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
```

- [ ] **Step 2: Update the SkillsSection component tests**

`test/components/SkillsSection.test.tsx` asserts `"Databases"`, which this task renames. Replace its `"renders all skill categories"` and `"renders individual skills"` tests with:

```tsx
  it("renders all skill categories", () => {
    render(<SkillsSection />);
    expect(screen.getByText("AI & Agentic Systems")).toBeInTheDocument();
    expect(screen.getByText("Software Architecture")).toBeInTheDocument();
    expect(screen.getByText("Backend & Frameworks")).toBeInTheDocument();
    expect(screen.getByText("Cloud & Infrastructure")).toBeInTheDocument();
    const observabilityElements = screen.getAllByText("Observability");
    expect(observabilityElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Data & Persistence")).toBeInTheDocument();
    expect(screen.getByText("Testing & Quality")).toBeInTheDocument();
    expect(screen.getByText("Engineering Practices")).toBeInTheDocument();
  });

  it("renders individual skills", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Agentic Workflows")).toBeInTheDocument();
    expect(screen.getByText("Rust")).toBeInTheDocument();
    expect(screen.getByText("Microservices Architecture")).toBeInTheDocument();
    expect(screen.getByText("Java (Spring Boot, Quarkus)")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
    expect(screen.getByText("TDD / BDD")).toBeInTheDocument();
  });
```

`getAllByText("Observability")` stays plural: the string is both a category title and a skill inside "Cloud & Infrastructure".

- [ ] **Step 3: Update the AchievementsSection component tests**

`test/components/AchievementsSection.test.tsx` asserts `"Millions"` and `"20+"`, which move out to the Hero. Replace its `"renders achievement metrics"` test with:

```tsx
  it("renders achievement metrics", () => {
    render(<AchievementsSection />);
    expect(screen.getByText("5x")).toBeInTheDocument();
    expect(screen.getByText("250%")).toBeInTheDocument();
    expect(screen.getByText("19+")).toBeInTheDocument();
    expect(screen.getByText("60+")).toBeInTheDocument();
    expect(screen.getByText("Org-wide")).toBeInTheDocument();
  });

  it("does not duplicate the hero stats", () => {
    render(<AchievementsSection />);
    expect(screen.queryByText("Millions")).not.toBeInTheDocument();
    expect(screen.queryByText("20+")).not.toBeInTheDocument();
  });
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `rtk npx.cmd jest test/data/portfolio-data.test.ts test/components/SkillsSection.test.tsx test/components/AchievementsSection.test.tsx`
Expected: FAIL. Data: `skillCategories[0].title` is `"Software Architecture"`, and `"does not repeat the hero stats"` fails because `"Millions"` and `"20+"` are still achievements. Components: unable to find `"AI & Agentic Systems"`, `"Data & Persistence"`, `"60+"`, `"Org-wide"`.

- [ ] **Step 5: Replace skillCategories**

In `src/data/portfolio-data.ts`, replace the whole `skillCategories: [...]` array with:

```ts
  skillCategories: [
    {
      title: "AI & Agentic Systems",
      icon: "🤖",
      skills: [
        "Agentic Workflows",
        "Multi-Agent Orchestration",
        "Claude / LLM Integration",
        "LangChain",
        "LangGraph",
        "RAG",
        "Spec-Driven Development",
        "MCP (Model Context Protocol)",
        "AI Code Review",
      ],
    },
    {
      title: "Software Architecture",
      icon: "🏗️",
      skills: [
        "Microservices Architecture",
        "Event-Driven Architecture",
        "Domain Driven Design (DDD)",
        "Hexagonal Architecture",
        "Clean Architecture",
        "C4 Model",
        "BIAN",
        "API Design (REST/GraphQL)",
      ],
    },
    {
      title: "Backend & Frameworks",
      icon: "⚙️",
      skills: [
        "Rust",
        "Java (Spring Boot, Quarkus)",
        "NodeJS / NestJS",
        "Python",
        "Reactive Programming (RxJava, WebFlux)",
        "Functional Programming",
      ],
    },
    {
      title: "Cloud & Infrastructure",
      icon: "☁️",
      skills: ["AWS", "Azure", "Docker", "Microservices", "Observability"],
    },
    {
      title: "Observability",
      icon: "📊",
      skills: ["Datadog", "Dynatrace", "Kibana", "PagerDuty", "Grafana"],
    },
    {
      title: "Data & Persistence",
      icon: "🗄️",
      skills: [
        "PostgreSQL",
        "Oracle",
        "MongoDB",
        "SQL Server",
        "DB2",
        "CosmosDB",
        "Redis",
        "Caffeine",
        "Prisma",
        "Hibernate",
        "Flyway",
      ],
    },
    {
      title: "Testing & Quality",
      icon: "🧪",
      skills: [
        "JUnit5",
        "Mockito",
        "Jest",
        "Testcontainers",
        "SonarQube",
        "Checkstyle",
        "Fortify",
        "Continuous Benchmarking",
      ],
    },
    {
      title: "Engineering Practices",
      icon: "🔧",
      skills: [
        "TDD / BDD",
        "CI/CD",
        "Agile (Scrum, Kanban)",
        "Design Thinking",
      ],
    },
  ],
```

- [ ] **Step 6: Replace achievements**

In the same file, replace the whole `achievements: [...]` array with:

```ts
  achievements: [
    {
      metric: "5x",
      description: "Optimization of applications and products.",
    },
    {
      metric: "250%",
      description: "Efficiency improvement in the customer service process.",
    },
    {
      metric: "19+",
      description:
        "APIs managed in production integrated with BCP's financial systems.",
    },
    {
      metric: "60+",
      description:
        "Internal services aggregated into a self-updating developer documentation portal with automated health scoring.",
    },
    {
      metric: "Org-wide",
      description:
        "Continuous performance benchmarking introduced across production services and codified as an engineering standard.",
    },
  ],
```

`"Millions"` and `"20+"` move out of Achievements and live only in the Hero stats bar (Task 5). `"Org-wide"` as a non-numeric metric is consistent with the existing design — `"Millions"` occupied that slot before and rendered through the same `gradient-text text-4xl` treatment.

- [ ] **Step 7: Run tests to verify they pass**

Run: `rtk npx.cmd jest test/data/portfolio-data.test.ts test/components/SkillsSection.test.tsx test/components/AchievementsSection.test.tsx`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
rtk git add src/data/portfolio-data.ts test/data/portfolio-data.test.ts test/components/SkillsSection.test.tsx test/components/AchievementsSection.test.tsx
rtk git commit -m "feat: add AI skill category, dedupe achievements against hero stats"
```

---

### Task 4: SEO metadata

The highest-impact fix in the plan. `src/app/layout-content.tsx` already exists, already contains the correct client half, and is imported by nothing — someone started this refactor and abandoned it. Finishing it is what unlocks `export const metadata`.

**Files:**
- Modify: `src/app/layout.tsx` (full rewrite)
- Modify: `jest.config.ts:15-17`
- Create: `test/mocks/next-font.ts`
- Create: `test/app/metadata.test.ts`
- Read-only: `src/app/layout-content.tsx` (used as-is, no changes)

**Interfaces:**
- Consumes: `portfolioData.name`, `.title`, `.tagline`, `.contact`, `.experience[0]`, `.languages` (Tasks 1–2). `LayoutContent` from `./layout-content` — signature `({ children }: { children: React.ReactNode }) => JSX.Element`.
- Produces: `export const metadata: Metadata` from `src/app/layout.tsx`.

- [ ] **Step 1: Add the font mock**

`next/font/google` is compiled by Next's SWC plugin. This project runs plain `ts-jest` (no `next/jest`), so importing `layout.tsx` in a test would execute `Inter()` and throw. Mock it.

Create `test/mocks/next-font.ts`:

```ts
export const Inter = () => ({
  variable: "--font-inter",
  className: "font-inter",
  style: { fontFamily: "Inter" },
});
```

This file does not match Jest's default `testMatch` patterns, so it will not be collected as a test suite.

- [ ] **Step 2: Wire the mock into Jest**

In `jest.config.ts`, extend `moduleNameMapper`:

```ts
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next/font/google$": "<rootDir>/test/mocks/next-font.ts",
  },
```

- [ ] **Step 3: Write the failing test**

Create `test/app/metadata.test.ts`:

```ts
import { metadata } from "@/app/layout";
import { portfolioData } from "@/data/portfolio-data";

describe("root metadata", () => {
  it("has a title containing the name", () => {
    expect(String(metadata.title)).toContain(portfolioData.name);
  });

  it("has a non-empty description", () => {
    expect(metadata.description).toBeTruthy();
    expect(metadata.description).toBe(portfolioData.tagline);
  });

  it("has a metadataBase so relative asset URLs resolve", () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
  });

  it("has OpenGraph with an image", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.images).toBeDefined();
  });

  it("has a Twitter card", () => {
    expect(metadata.twitter).toBeDefined();
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `rtk npx.cmd jest test/app/metadata.test.ts`
Expected: FAIL with `metadata` undefined — `layout.tsx` is a Client Component and exports no metadata.

- [ ] **Step 5: Rewrite layout.tsx**

Replace the entire contents of `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { LayoutContent } from "./layout-content";
import { portfolioData } from "@/data/portfolio-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://bannergz.github.io";
const OG_IMAGE = "/BannerGonzalesWhite.png";
const PAGE_TITLE = `${portfolioData.name} — ${portfolioData.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: PAGE_TITLE,
  description: portfolioData.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    title: PAGE_TITLE,
    description: portfolioData.tagline,
    url: SITE_URL,
    siteName: portfolioData.name,
    images: [{ url: OG_IMAGE, alt: portfolioData.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: portfolioData.tagline,
    images: [OG_IMAGE],
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: portfolioData.name,
  jobTitle: portfolioData.experience[0].role,
  worksFor: {
    "@type": "Organization",
    name: portfolioData.experience[0].company,
  },
  url: SITE_URL,
  email: `mailto:${portfolioData.contact.email}`,
  description: portfolioData.tagline,
  sameAs: [
    `https://${portfolioData.contact.linkedin}`,
    "https://github.com/bannergz",
  ],
  knowsLanguage: portfolioData.languages.map((lang) => lang.language),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
```

Note: no `width`/`height` on the OG image. `BannerGonzalesWhite.png` is a 12 KB wordmark, not a 1200×630 social card — declaring those dimensions would assert something false. A real OG image is a tracked follow-up.

- [ ] **Step 6: Run the test to verify it passes**

Run: `rtk npx.cmd jest test/app/metadata.test.ts`
Expected: PASS.

- [ ] **Step 7: Verify the build still exports statically**

Run: `rtk npm.cmd run build`
Expected: build succeeds. `layout.tsx` is now a Server Component; `layout-content.tsx` carries `"use client"` and owns the `usePathname` call.

- [ ] **Step 8: Verify the metadata actually renders**

Run: `rtk grep -l "og:title" out/index.html`
Expected: a match. Also confirm `out/index.html` contains a `<title>` tag and `application/ld+json`. If empty, the metadata export is not being picked up — stop and diagnose before committing.

- [ ] **Step 9: Commit**

```bash
rtk git add src/app/layout.tsx jest.config.ts test/mocks/next-font.ts test/app/metadata.test.ts
rtk git commit -m "fix: restore SEO metadata by making layout a Server Component"
```

---

### Task 5: Hero rewrite

**Files:**
- Modify: `src/components/sections/HeroSection.tsx` — the destructure, the summary paragraph, the CTA block, and the last stat tile
- Test: `test/components/HeroSection.test.tsx`

Anchor on content, not line numbers: each step below shifts the ones after it.

**Interfaces:**
- Consumes: `portfolioData.tagline` and `portfolioData.heroStats` (Task 1), `.name`, `.title`, `.contact.linkedin`. `HeroStat` is importable from `@/types`.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Write the failing tests**

Replace the entire contents of `test/components/HeroSection.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/sections/HeroSection";
import { portfolioData } from "@/data/portfolio-data";

describe("HeroSection", () => {
  it("renders the name", () => {
    render(<HeroSection />);
    expect(screen.getByText("Banner Gonzales")).toBeInTheDocument();
  });

  it("renders the title", () => {
    render(<HeroSection />);
    expect(
      screen.getByText(
        "Software Architect | AI & Agentic Systems | Fintech at Scale"
      )
    ).toBeInTheDocument();
  });

  it("renders the tagline, not the long summary", () => {
    render(<HeroSection />);
    expect(screen.getByText(portfolioData.tagline)).toBeInTheDocument();
    expect(screen.queryByText(portfolioData.summary)).not.toBeInTheDocument();
  });

  it("renders availability badge", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Available for new opportunities")
    ).toBeInTheDocument();
  });

  it("renders a single primary CTA plus secondary actions", () => {
    render(<HeroSection />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
    expect(screen.getByText("Download CV")).toBeInTheDocument();
    expect(screen.getByLabelText("LinkedIn profile")).toBeInTheDocument();
  });

  it("drops the redundant View Experience CTA", () => {
    render(<HeroSection />);
    expect(screen.queryByText("View Experience")).not.toBeInTheDocument();
  });

  it("renders every hero stat from the data layer", () => {
    render(<HeroSection />);
    portfolioData.heroStats.forEach((stat) => {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.label)).toBeInTheDocument();
    });
  });

  it("renders the AI stat that carries the positioning", () => {
    render(<HeroSection />);
    expect(screen.getByText("300%")).toBeInTheDocument();
    expect(screen.getByText("AI Efficiency Gain")).toBeInTheDocument();
  });
});
```

The first test drives the values from the data, so it cannot go stale. The second pins the one stat the positioning depends on — if someone drops it, that should fail loudly rather than silently pass a data-driven loop.

- [ ] **Step 2: Run tests to verify they fail**

Run: `rtk npx.cmd jest test/components/HeroSection.test.tsx`
Expected: FAIL on the title, tagline, `Download CV`/`LinkedIn profile`, `View Experience`, and `300%` assertions.

- [ ] **Step 3: Render the tagline instead of the summary**

In `src/components/sections/HeroSection.tsx`, change the destructure at the top of the component to:

```tsx
  const { name, title, tagline, contact, heroStats } = portfolioData;
```

`summary` is dropped from the destructure — it now lives only in About. Then replace the paragraph that renders `{summary}` with:

```tsx
          <p className="mt-6 max-w-2xl animate-slide-up text-lg leading-relaxed text-gray-300">
            {tagline}
          </p>
```

- [ ] **Step 4: Collapse the CTA cluster**

Replace the entire CTA block — the `<div className="mt-10 flex animate-slide-up flex-wrap gap-4">` through its matching closing `</div>`, containing all four current CTAs — with:

```tsx
          <div className="mt-10 flex animate-slide-up flex-wrap items-center gap-4">
            <a href="#contact" className="btn-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Get in Touch
            </a>
            <a
              href="/files/CV%20EN%20-%20Gonzales%20Zambrano%20Enrique%20Banner.pdf"
              download="CV EN - Gonzales Zambrano Enrique Banner.pdf"
              className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download CV
            </a>
            <a
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 text-white transition-all duration-300 hover:bg-white hover:text-primary"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
```

- [ ] **Step 5: Render the stats bar from data**

The four stat tiles are hardcoded in JSX today — the same drift bug Task 6 fixes in the Footer. Task 1 already moved the values into `portfolioData.heroStats`. Replace the entire stats grid (the `<div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">` through its matching closing `</div>`, containing all four hardcoded tiles) with:

```tsx
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.value}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
```

`key={stat.value}` is safe: Task 1's test asserts those values are unique. The grid classes are unchanged — four stats still lay out `grid-cols-2` on mobile and `md:grid-cols-4` on desktop.

- [ ] **Step 6: Run tests to verify they pass**

Run: `rtk npx.cmd jest test/components/HeroSection.test.tsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
rtk git add src/components/sections/HeroSection.tsx test/components/HeroSection.test.tsx
rtk git commit -m "feat: rewrite hero with tagline, single primary CTA, and AI stat"
```

---

### Task 6: Footer reads title from data

`Footer.tsx:16` hardcodes `"Technical Lead & Software Architect"` outside the data layer. That string is already stale — it is the exact drift this whole plan exists to fix.

**Files:**
- Modify: `src/components/layout/Footer.tsx` — the destructure and the tagline paragraph
- Create: `test/components/Footer.test.tsx`

**Interfaces:**
- Consumes: `portfolioData.title` (Task 1), `.name`, `.contact`.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Write the failing test**

Create `test/components/Footer.test.tsx`:

```tsx
import { render } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import { portfolioData } from "@/data/portfolio-data";

describe("Footer", () => {
  it("renders the title from the data layer, not a hardcoded string", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.title);
  });

  it("renders the name", () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(portfolioData.name);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `rtk npx.cmd jest test/components/Footer.test.tsx`
Expected: FAIL — the footer renders the hardcoded `"Technical Lead & Software Architect"`, not `portfolioData.title`.

- [ ] **Step 3: Read the title from data**

In `src/components/layout/Footer.tsx`, change the destructure to:

```tsx
  const { name, title, contact } = portfolioData;
```

and replace the paragraph containing the hardcoded `"Technical Lead & Software Architect"` with:

```tsx
            <p className="mt-1 text-sm text-gray-400">
              {name} &mdash; {title}
            </p>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `rtk npx.cmd jest test/components/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/layout/Footer.tsx test/components/Footer.test.tsx
rtk git commit -m "fix: read footer title from data layer to prevent drift"
```

---

### Task 7: Respect prefers-reduced-motion

**Files:**
- Modify: `src/app/globals.css` (append at end of file)

**Interfaces:**
- Consumes: the `.animate-fade-in` / `.animate-slide-up` utilities defined at `globals.css:73-100`.
- Produces: nothing consumed downstream.

- [ ] **Step 1: Append the reduced-motion override**

Add to the very end of `src/app/globals.css`, **outside any `@layer` block**:

```css
/* Unlayered: must beat Tailwind's scroll-smooth utility and the animation
   utilities above, both of which live in cascade layers. */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  .animate-fade-in,
  .animate-slide-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

The placement is load-bearing. Unlayered CSS wins over layered CSS in the cascade, which is how this beats both the `scroll-smooth` class on `<html>` and the `@layer utilities` animations. Putting this inside `@layer utilities` would leave the override at the mercy of layer ordering.

- [ ] **Step 2: Verify in the browser**

Run: `rtk npm.cmd run dev`

In Chrome DevTools: open the Command Menu (Ctrl+Shift+P) → "Show Rendering" → set **Emulate CSS media feature prefers-reduced-motion** to `reduce`. Reload.

Expected: hero content appears immediately with no slide/fade, and anchor-link navigation jumps instead of smooth-scrolling. Toggle back to `no-preference` and confirm the animations return.

This step has no automated test — jsdom does not evaluate media queries, so asserting it in Jest would test the mock rather than the CSS. Verify by hand.

- [ ] **Step 3: Commit**

```bash
rtk git add src/app/globals.css
rtk git commit -m "fix: respect prefers-reduced-motion for animations and scrolling"
```

---

### Task 8: Full verification

**Files:** none modified.

- [ ] **Step 1: Run the full test suite**

Run: `rtk npm.cmd test`
Expected: all suites PASS.

- [ ] **Step 2: Lint**

Run: `rtk npm.cmd run lint`
Expected: no errors.

- [ ] **Step 3: Build**

Run: `rtk npm.cmd run build`
Expected: success, static export to `out/`.

- [ ] **Step 4: Verify the rendered output**

Confirm `out/index.html` contains: a `<title>` with "Banner Gonzales", an `og:title` meta tag, an `application/ld+json` block, "YaVendio", "Principal Engineer", and the tagline. Confirm it does NOT contain "Everis" or "Technical Lead & Software Architect".

- [ ] **Step 5: Eyeball it**

Run: `rtk npm.cmd run dev` and load `http://localhost:3000`.

Check: hero shows one primary CTA; the tagline is short and the long summary appears only in About; the timeline shows YaVendio first with the "Current" badge and Yape without it; no metric appears in both the hero stats bar and Achievements; Skills leads with the AI card.

---

## Follow-ups (out of scope, do not do here)

- **Real OG image.** `BannerGonzalesWhite.png` is a 12 KB wordmark standing in for a 1200×630 social card.
- **The CV PDF omits Rust.** It lists `Programming Languages: Java, NodeJS`. After this plan the site lists Rust and the PDF does not — they disagree on a real skill until the PDF is regenerated.
- **Deploy.** `.github/workflows/deploy.yml` triggers on push to `main`. This branch must be merged for any of it to go live.
