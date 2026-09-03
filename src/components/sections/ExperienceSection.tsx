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
    <li className="relative pl-8 pb-12 last:pb-0 md:pl-12">
      {/* Timeline line */}
      <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-accent to-accent/20 md:left-4" />

      {/* Timeline dot */}
      <div
        className={`absolute top-1 left-0 -translate-x-1/2 md:left-4 ${
          isFirst ? "h-4 w-4" : "h-3 w-3"
        } rounded-full border-2 border-accent ${
          isFirst ? "bg-accent" : "bg-ink"
        }`}
      />

      {/* Content card */}
      <div className={`panel-card ${isFirst ? "border-accent/40" : ""}`}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="col-label">{entry.period}</span>
          {isFirst && (
            <span className="rounded-sm bg-positive/15 px-2 py-0.5 font-mono text-xs font-medium text-positive">
              Current
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-fg">{entry.role}</h3>
        <p className="mt-1 text-base font-medium text-accent">
          {entry.company}
        </p>

        <ul className="mt-4 space-y-2">
          {entry.highlights.map((highlight, i) => (
            <li key={i} className="flex gap-3 text-sm text-text-muted">
              <svg
                aria-hidden="true"
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
    </li>
  );
}

export function ExperienceSection() {
  const { experience, achievements, summary } = portfolioData;

  return (
    <section id="experience" className="bg-ink">
      <div className="section-container">
        <h2 className="section-title">
          Professional <span className="text-accent">Experience</span>
        </h2>
        <p className="section-subtitle">{summary}</p>

        {/* Las cifras tenían sección propia. Solas no dicen de dónde salen,
            así que ahora encabezan la línea de tiempo que las explica. */}
        <ul className="mb-14 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 sm:grid-cols-3 lg:grid-cols-5">
          {achievements.map((achievement) => (
            <li key={achievement.metric} className="flex flex-col gap-1.5">
              <span className="figure-accent text-3xl">{achievement.metric}</span>
              <span className="text-sm leading-snug text-pretty text-text-muted">
                {achievement.description}
              </span>
            </li>
          ))}
        </ul>

        <ol className="mx-auto max-w-3xl">
          {experience.map((entry, index) => (
            <TimelineItem key={entry.company} entry={entry} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
}
