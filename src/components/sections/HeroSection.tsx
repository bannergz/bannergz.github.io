import { portfolioData } from "@/data/portfolio-data";

export function HeroSection() {
  const { name, title, summary, contact } = portfolioData;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent-light/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="section-container relative z-10 pt-20">
        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald" />
              <span className="text-sm font-medium text-accent-light">
                Available for new opportunities
              </span>
            </div>
          </div>

          <h1 className="animate-slide-up text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {name}
          </h1>

          <p className="mt-4 animate-slide-up text-xl font-medium text-accent-light md:text-2xl">
            {title}
          </p>

          <p className="mt-6 max-w-2xl animate-slide-up text-lg leading-relaxed text-gray-300">
            {summary}
          </p>

          <div className="mt-10 flex animate-slide-up flex-wrap gap-4">
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
              href={`https://${contact.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
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
            <a href="#experience" className="btn-outline border-white/30 text-white hover:bg-white hover:text-primary">
              View Experience
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 md:grid-cols-4">
            <div>
              <p className="text-3xl font-bold text-white">6+</p>
              <p className="mt-1 text-sm text-gray-400">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">20+</p>
              <p className="mt-1 text-sm text-gray-400">Enterprise APIs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">Millions</p>
              <p className="mt-1 text-sm text-gray-400">Users Impacted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5x</p>
              <p className="mt-1 text-sm text-gray-400">App Optimization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
