import { portfolioData } from "@/data/portfolio-data";
import type { Achievement } from "@/types";

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="panel-card flex flex-col gap-3">
      <p className="figure-accent text-4xl">{achievement.metric}</p>
      <p className="text-sm leading-relaxed text-text-muted">
        {achievement.description}
      </p>
    </div>
  );
}

export function AchievementsSection() {
  const { achievements } = portfolioData;

  return (
    <section id="achievements" className="bg-ink">
      <div className="section-container">
        <h2 className="section-title">
          Key <span className="text-accent">Achievements</span>
        </h2>
        <p className="section-subtitle">
          Measurable impact delivered across enterprise fintech platforms.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.metric}
              achievement={achievement}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
