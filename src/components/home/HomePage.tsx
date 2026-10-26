import Link from "next/link";
import { portfolioData } from "@/data/portfolio-data";
import { CurrentYear } from "@/components/layout/CurrentYear";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { C4Split } from "./C4Split";
import { C4Stage } from "./C4Stage";
import { WorkIndex } from "./WorkIndex";
import styles from "./home.module.css";

const CV_HREF = "/files/CV%20EN%20-%20Gonzales%20Zambrano%20Enrique%20Banner.pdf";

/** The strip runs twice so its loop has no seam. */
const STRIP = [
  { src: "busca", w: 760, h: 502 },
  { src: "listen", w: 657, h: 760 },
  { src: "trae", w: 510, h: 760 },
  { src: "read", w: 699, h: 760 },
  { src: "cuida", w: 760, h: 514 },
  { src: "quieto", w: 760, h: 760 },
  { src: "junto", w: 760, h: 491 },
];

export function HomePage() {
  const { name, tagline, summary, contact, experience, achievements, skillCategories, education, languages } =
    portfolioData;
  const whatsapp = contact.phone.replace(/\D/g, "");
  const buildYear = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <C4Split>
        <C4Stage />

        <div className={styles.col}>
          <section id="hero" className={styles.hero} data-level="1">
            <nav aria-label="Main">
              <a href="#career">Career</a>
              <a href="#work">Work</a>
              <a href="#tools">Tools</a>
              <ThemeToggle />
              <a className={styles.btn} href="#contact">
                Get in touch
              </a>
            </nav>
            <p className={styles.sub}>{tagline}</p>
            <h1>
              <span>Banner</span> <span>Gonzales</span>
            </h1>
          </section>

          <section id="about" className={styles.letter} data-level="1" aria-label="About">
            <div className={styles.inner}>
              <div className={styles.av}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
                <img src="/sam/portrait.webp" alt="Sam, Banner's German Shepherd, illustrated with round glasses." width={900} height={900} loading="lazy" />
              </div>
              <p>{summary}</p>
              <p>
                I think in diagrams. So this page is one: the panel beside you zooms from the context I work in{" "}
                <mark>down to the code</mark>.
              </p>
              <p className={styles.sig}>
                {name}
                <span className={styles.role}>Software architect · Lima, Peru</span>
              </p>
            </div>
          </section>

          <section id="career" className={styles.career} data-level="2" aria-labelledby="career-title">
            <div className={styles.careerInner}>
              <h2 id="career-title" className={styles.giant}>
                Career
              </h2>
              <div className={styles.bars}>
                {experience.map((job, i) => (
                  <details key={job.company} open={i === 0}>
                    <summary>
                      <b>{job.role}</b>
                      <span>
                        {job.company} · {job.period}
                      </span>
                    </summary>
                    <ul>
                      {job.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section id="work" className={styles.work} data-level="3">
            <h2 className={styles.h2}>Selected work</h2>
            <WorkIndex />
            <p className={styles.note}>Point at a name: the diagram lights the component it became.</p>
          </section>

          <section id="figures" className={styles.figures} data-level="3">
            <h2 className={styles.h2}>What moved</h2>
            {achievements.map((a) => (
              <div key={a.metric} className={styles.fig}>
                <b>{a.metric}</b>
                <p>{a.description}</p>
              </div>
            ))}
          </section>

          <section id="tools" className={styles.skills} data-level="4">
            <h2 className={styles.h2}>Tools I reach for</h2>
            <div className={styles.names}>
              {skillCategories.map((c) => (
                <div key={c.title}>
                  <h3>{c.title}</h3>
                  <ul>
                    {c.skills.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className={styles.free}>
              Free tools I keep: the <Link href="/architecture">Software Architecture Atlas</Link> and a{" "}
              <Link href="/calcula-tus-impuestos" hrefLang="es">
                2026 Peruvian income-tax calculator
              </Link>
              .
            </p>
          </section>
        </div>
      </C4Split>

      <section id="contact" className={styles.contact} aria-labelledby="contact-title">
        <div className={styles.strip} aria-hidden="true">
          {[...STRIP, ...STRIP].map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized
            <img key={i} src={`/sam/${img.src}.webp`} alt="" width={img.w} height={img.h} loading="lazy" />
          ))}
        </div>
        <div className={styles.contactIn}>
          <h2 id="contact-title">Let&apos;s design the next one</h2>
          <p className={styles.lead}>
            Architecture reviews, platform and AI-workflow design, or a Principal or Software Architect role. Sam,
            the German Shepherd above, has been with me since I was 13; my ventures carry her name.
          </p>
          <div className={styles.cells}>
            <a href={`mailto:${contact.email}`}>
              Email<small>{contact.email}</small>
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp<small>{contact.phone}</small>
            </a>
            <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer">
              LinkedIn<small>{contact.linkedin.replace("linkedin.com/", "")}</small>
            </a>
          </div>
          <p className={styles.fine}>
            <a href={CV_HREF} download="CV EN - Gonzales Zambrano Enrique Banner.pdf">
              Download my CV
            </a>
            . Code on{" "}
            <a href="https://github.com/bannergz" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            . {languages.map((l) => `${l.language} ${l.level.toLowerCase()}`).join(", ")}.{" "}
            {education[0].degree}, {education[0].institution}.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images are unoptimized */}
        <img src="/sam/malecon.webp" alt="" width={1500} height={1000} loading="lazy" />
        <div className={styles.ftop}>
          <ul>
            <li>
              <a href="#career">Career</a>
            </li>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#tools">Tools</a>
            </li>
          </ul>
          <ul>
            <li>
              <Link href="/architecture">Software Architecture Atlas</Link>
            </li>
            <li>
              <Link href="/calcula-tus-impuestos" hrefLang="es">
                Calculadora de Impuesto a la Renta 2026
              </Link>
            </li>
          </ul>
          <ul>
            <li>Lima, Peru</li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>
        <div>
          <div className={styles.fname} aria-hidden="true">
            {name}
          </div>
          <div className={styles.legal}>
            <span>
              © <CurrentYear buildYear={buildYear} /> {name} · Illustrations of Sam made with AI
            </span>
            <span>
              Made with{" "}
              <svg className={styles.heart} viewBox="0 0 24 22" role="img" aria-label="love">
                <path d="M12 21 2.6 11.6A5.6 5.6 0 0 1 12 4.1a5.6 5.6 0 0 1 9.4 7.5Z" />
              </svg>{" "}
              in Lima, with Sam
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
