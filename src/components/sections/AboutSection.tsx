import { portfolioData } from "@/data/portfolio-data";

export function AboutSection() {
  const { summary, specializations, languages } = portfolioData;

  return (
    <section id="about" className="bg-ink">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="section-title">
              About <span className="text-accent">Me</span>
            </h2>
            <p className="text-lg leading-relaxed text-text-muted">{summary}</p>
            <p className="mt-4 text-lg leading-relaxed text-text-muted">
              I&apos;m open to Principal Engineer, Staff Engineer, or Software
              Architect roles where agentic AI and distributed-systems rigor
              meet — particularly in fintech or platform organizations
              operating at scale.
            </p>

            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold tracking-wider text-text-muted uppercase">
                Languages
              </h3>
              <div className="flex flex-wrap gap-3">
                {languages.map((lang) => (
                  <span key={lang.language} className="tag">
                    {lang.language} — {lang.level}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold text-fg">
              Specialization Areas
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specializations.map((spec) => (
                <div
                  key={spec}
                  className="panel-card flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <svg
                      className="h-5 w-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-fg">
                    {spec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
