import { portfolioData } from "@/data/portfolio-data";

export function ContactSection() {
  const { name, contact, education, languages } = portfolioData;

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line bg-ink"
    >
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance text-fg lg:text-4xl">
            Let&apos;s Work <span className="text-accent">Together</span>
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Looking for a Principal Engineer or Software Architect to drive
            your platform and AI strategy? I&apos;d love to discuss how I can
            contribute to your organization&apos;s success.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href={`mailto:${contact.email}`}
              className="btn-primary w-full sm:w-auto"
            >
              <svg
                aria-hidden="true"
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
              {contact.email}
            </a>
            <a
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full sm:w-auto"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn Profile
            </a>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-line bg-panel p-6">
              <svg
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-accent"
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
              <p className="col-label mt-3">Email</p>
              <a href={`mailto:${contact.email}`} className="mt-1 block text-sm text-text-muted transition-colors hover:text-accent">
                {contact.email}
              </a>
            </div>
            <div className="rounded-lg border border-line bg-panel p-6">
              <svg
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <p className="col-label mt-3">Phone</p>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="mt-1 block text-sm text-text-muted transition-colors hover:text-accent">
                {contact.phone}
              </a>
            </div>
            <div className="rounded-lg border border-line bg-panel p-6">
              <svg
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-accent"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <p className="col-label mt-3">LinkedIn</p>
              <a
                href={`https://${contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-text-muted transition-colors hover:text-accent"
              >
                {name}
              </a>
            </div>
          </div>

          {/* Formacion e idiomas vivian en la seccion About, que ya no existe.
              Son datos de ficha, y esta es la ficha. */}
          <dl className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-text-muted sm:flex-row sm:justify-center sm:gap-8">
            <div>
              <dt className="col-label">Education</dt>
              {education.map((entry) => (
                <dd key={entry.institution} className="mt-1">
                  {entry.degree} &middot; {entry.institution} &middot; {entry.period}
                </dd>
              ))}
            </div>
            <div>
              <dt className="col-label">Languages</dt>
              <dd className="mt-1">
                {languages.map((lang) => `${lang.language} — ${lang.level}`).join(" · ")}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
