/**
 * The home page's C4 diagram: four zoom levels of the career, from the
 * system context down to code. The boxes are drawn in a 600 × 700 viewBox.
 */

export type Level = 1 | 2 | 3 | 4;

export const LEVELS: Record<Level, { name: string; legend: string }> = {
  1: { name: "System context", legend: "Who I work for, and the systems I touch." },
  2: { name: "Containers: the career", legend: "Each company is a container I ran inside." },
  3: { name: "Components: what I built", legend: "Point at a project on the right to light it." },
  4: { name: "Code", legend: "The smallest zoom: how the code is shaped." },
};

export type C4Kind = "person" | "system" | "container" | "component" | "ext";

export interface C4Box {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: C4Kind;
  title: string;
  /** The bracketed line under the title: [Person], [External system]… */
  tag: string;
  lines: string[];
}

export const CONTEXT: C4Box[] = [
  { x: 30, y: 40, w: 240, h: 104, kind: "person", title: "Yape users", tag: "[Person]", lines: ["Millions paying every day in Peru"] },
  { x: 330, y: 40, w: 240, h: 104, kind: "person", title: "Engineering teams", tag: "[Person]", lines: ["Who ship on his platforms"] },
  { x: 160, y: 286, w: 280, h: 128, kind: "system", title: "Banner Gonzales", tag: "[Software architect]", lines: ["Fintech at scale, developer", "platforms and agentic AI"] },
  { x: 30, y: 556, w: 240, h: 104, kind: "ext", title: "BCP core banking", tag: "[External system]", lines: ["Credit, payments, transfers"] },
  { x: 330, y: 556, w: 240, h: 104, kind: "ext", title: "Ecommerce merchants", tag: "[External system]", lines: ["Selling with AI agents"] },
];

export const CONTEXT_RELATIONS: Array<{ d: string; label: string; x: number; y: number }> = [
  { d: "M150 146 L232 282", label: "uses payments he designed", x: 70, y: 218 },
  { d: "M368 284 L450 148", label: "builds the tools for", x: 410, y: 218 },
  { d: "M232 418 L150 552", label: "integrates 19+ APIs with", x: 40, y: 490 },
  { d: "M368 418 L450 552", label: "ships agents for", x: 414, y: 490 },
];

export const CONTAINERS: C4Box[] = [
  { title: "YaVendio · Principal Engineer", tag: "[2026–now] Rust, TypeScript, Python", lines: ["Platforms, C4 docs, agentic AI harness"] },
  { title: "Yape · Software Technical Lead", tag: "[2022–2026] Spring Boot, Quarkus, Node.js", lines: ["Event-driven payments, 19+ APIs with BCP"] },
  { title: "Globant Perú · Technical Lead", tag: "[2021–2022] Microservices", lines: ["15+ business APIs, bank core integration"] },
  { title: "NTT DATA · Java Developer", tag: "[2020–2021] Reactive Java", lines: ["BCP credit-card payments and enrollment"] },
  { title: "IBM · University practices", tag: "[2019–2020] Java, RPA", lines: ["Enterprise services and integrations"] },
].map((box, i) => ({ ...box, x: 60, y: 70 + i * 122, w: 480, h: 92, kind: "container" as const }));

export interface Work {
  key: string;
  title: string;
  /** What the index shows on the right: the kind of work and where. */
  meta: string;
  tag: string;
  lines: string[];
}

/** Level 3 and the work index are the same list: hovering one lights the other. */
export const WORK: Work[] = [
  // Contributor, not author: see the harness invariant in portfolio-data.test.ts.
  { key: "harness", title: "Agentic AI harness", meta: "Contributor · 2026", tag: "[Contributor, power user]", lines: ["<400 → 3,100+ merged", "PRs a month, rolled out", "to all 19 staff"] },
  { key: "portal", title: "Developer portal", meta: "Platform · 2026", tag: "[Self-updating, SSO]", lines: ["60+ services, docs", "health scored"] },
  { key: "rust", title: "Rust service scaffold", meta: "Architecture · 2026", tag: "[Hexagonal, observability]", lines: ["Adopted as the fleet", "standard"] },
  { key: "c4", title: "C4 docs platform", meta: "Architecture · 2026", tag: "[Authenticated, CI-validated]", lines: ["Architecture that cannot", "drift from the code"] },
  { key: "bench", title: "Continuous benchmarks", meta: "Performance · 2026", tag: "[3 production services]", lines: ["Codified as an", "engineering standard"] },
  { key: "yape", title: "Yape promotions landing", meta: "Performance · Yape", tag: "[Yape, Algolia, CDN]", lines: ["First load from 25 s", "down to 5 s"] },
];

export const COMPONENTS: Array<C4Box & { key: string }> = WORK.map((w, i) => ({
  key: w.key,
  x: i % 2 === 0 ? 44 : 310,
  y: 74 + Math.floor(i / 2) * 190,
  w: 246,
  h: 170,
  kind: "component",
  // The diagram box is narrower than the index line.
  title: w.key === "yape" ? "Promotions landing" : w.title,
  tag: w.tag,
  lines: w.lines,
}));
