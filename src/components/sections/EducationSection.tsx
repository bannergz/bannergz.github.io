import { portfolioData } from "@/data/portfolio-data";

export function EducationSection() {
  const { education } = portfolioData;

  return (
    <section id="education" className="bg-ink">
      <div className="section-container">
        <h2 className="section-title">
          Formal <span className="text-accent">Education</span>
        </h2>
        <p className="section-subtitle">Systems engineering foundation.</p>

        <div className="max-w-xl">
          {education.map((entry) => (
            <div key={entry.institution} className="panel-card">
              <span className="col-label">
                {entry.period}
              </span>
              <h3 className="mt-3 text-lg font-bold text-fg">
                {entry.degree}
              </h3>
              <p className="mt-1 text-text-muted">{entry.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
