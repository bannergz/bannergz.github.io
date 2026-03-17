import { portfolioData } from "@/data/portfolio-data";
import type { SkillCategory } from "@/types";

function SkillCard({ category }: { category: SkillCategory }) {
  return (
    <div className="glass-card group">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl" role="img" aria-label={category.title}>
          {category.icon}
        </span>
        <h3 className="text-lg font-bold text-primary">{category.title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg bg-surface-dark px-3 py-1.5 text-sm font-medium text-secondary transition-colors group-hover:bg-accent/10 group-hover:text-accent"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { skillCategories } = portfolioData;

  return (
    <section id="skills" className="bg-surface">
      <div className="section-container">
        <h2 className="section-title">
          Technical <span className="gradient-text">Expertise</span>
        </h2>
        <p className="section-subtitle">
          A comprehensive toolkit for designing, building, and scaling
          enterprise-grade financial platforms.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category) => (
            <SkillCard key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
