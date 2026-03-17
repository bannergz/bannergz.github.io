import { portfolioData } from "@/data/portfolio-data";
import type { ExperienceEntry } from "@/types";

function TimelineItem({
  entry,
  index,
}: {
  entry: ExperienceEntry;
  index: number;
}) {
  const isFirst = index === 0;

  return (
    <div className="relative pl-8 pb-12 last:pb-0 md:pl-12">
      {/* Timeline line */}
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent to-accent/20 md:left-4" />

      {/* Timeline dot */}
      <div
        className={`absolute top-1 left-0 -translate-x-1/2 md:left-4 ${
          isFirst ? "h-4 w-4" : "h-3 w-3"
        } rounded-full border-2 border-accent ${
          isFirst ? "bg-accent" : "bg-white"
        }`}
      />

      {/* Content card */}
      <div className={`glass-card ${isFirst ? "border-accent/30" : ""}`}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            {entry.period}
          </span>
          {isFirst && (
            <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
              Current
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-primary">{entry.role}</h3>
        <p className="mt-1 text-base font-medium text-accent">
          {entry.company}
        </p>

        <ul className="mt-4 space-y-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="flex gap-3 text-sm text-text-muted">
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-accent/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="bg-white">
      <div className="section-container">
        <h2 className="section-title">
          Professional <span className="gradient-text">Experience</span>
        </h2>
        <p className="section-subtitle">
          A track record of leading engineering teams and delivering
          high-impact financial platforms at scale.
        </p>

        <div className="mx-auto max-w-3xl">
          {experience.map((entry, index) => (
            <TimelineItem key={entry.company} entry={entry} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
