import { portfolioData } from "@/data/portfolio-data";

export function EducationSection() {
  const { education } = portfolioData;

  return (
    <section id="education" className="bg-white">
      <div className="section-container">
        <h2 className="section-title">
          Formal <span className="gradient-text">Education</span>
        </h2>
        <p className="section-subtitle">Systems engineering foundation.</p>

        <div className="max-w-xl">
          {education.map((entry) => (
            <div key={entry.institution} className="glass-card">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                {entry.period}
              </span>
              <h4 className="mt-3 text-lg font-bold text-primary">
                {entry.degree}
              </h4>
              <p className="mt-1 text-text-muted">{entry.institution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
