import { portfolioData } from "@/data/portfolio-data";
import type { Achievement } from "@/types";

function AchievementCard({ achievement }: { achievement: Achievement }) {
  return (
    <div className="glass-card text-center">
      <p className="gradient-text text-4xl font-bold">{achievement.metric}</p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        {achievement.description}
      </p>
    </div>
  );
}

export function AchievementsSection() {
  const { achievements } = portfolioData;

  return (
    <section id="achievements" className="bg-surface">
      <div className="section-container">
        <h2 className="section-title">
          Key <span className="gradient-text">Achievements</span>
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
