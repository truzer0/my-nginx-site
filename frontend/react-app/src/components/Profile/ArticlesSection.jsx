import { useState } from 'react';

const ArticlesSection = ({ articles }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="articles-section">
      <h3 
        className="section-title" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>Ваши статьи</span>
        <span>{isExpanded ? '▼' : '▶'}</span>
      </h3>
      
      {isExpanded && (
        <div className="articles-list">
          {articles.map(article => (
            <div key={article.id} className="article-card">
              <h4 className="article-title">{article.title}</h4>
              <p className="article-excerpt">{article.excerpt}</p>
              <div className="article-meta">
                <span className="article-date">{article.date}</span>
                <span className="article-status">{article.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticlesSection;
