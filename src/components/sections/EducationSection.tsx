import { portfolioData } from "@/data/portfolio-data";

export function EducationSection() {
  const { education, specializations } = portfolioData;

  return (
    <section id="education" className="bg-white">
      <div className="section-container">
        <h2 className="section-title">
          Education & <span className="gradient-text">Certifications</span>
        </h2>
        <p className="section-subtitle">
          Continuous learning and specialization in modern software engineering.
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Formal education */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-primary">
              Formal Education
            </h3>
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

          {/* Specialization courses */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-primary">
              Specialization Courses
            </h3>
            <div className="glass-card">
              <ul className="space-y-4">
                {specializations.map((spec) => (
                  <li key={spec} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <svg
                        className="h-4 w-4 text-accent"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-primary">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
