import { useState } from 'react';

const AchievementsSection = ({ achievements }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="achievements-section">
      <h3 
        className="section-title" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Ваши достижения</span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </h3>
      
      {isExpanded && (
        <ul className="achievements-list">
          {achievements.map((achievement, index) => (
            <li key={index} className="achievement-item">
              <span className="achievement-icon">🏆</span>
              <span>{achievement.title}</span>
              <span className="achievement-date">{achievement.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AchievementsSection;
