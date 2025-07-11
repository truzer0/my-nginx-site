import React from 'react';
import './JiraReport.css';
function JiraReport({ report }) {
  if (!report) return null;
  return (
    <div className="report-container">
      <div className="report-header">
        <h2>Ежедневный отчет Jira</h2>
        <div className="report-period">{report.period}</div>
      </div>
      
      <div className="report-summary">
        <div className="summary-card">
          <h3>Всего задач</h3>
          <div className="value">{report.totalTasks}</div>
        </div>
        <div className="summary-card">
          <h3>Выполнено</h3>
          <div className="value">{report.completedTasks}</div>
        </div>
        <div className="summary-card">
          <h3>Осталось</h3>
          <div className="value">{report.remainingTasks}</div>
        </div>
        <div className="summary-card">
          <h3>Затрачено времени</h3>
          <div className="value">{report.totalSpent}</div>
        </div>
      </div>
      
      <h3>Список задач</h3>
      <table>
        <thead>
          <tr>
            <th>Задача</th>
            <th>Статус</th>
            <th>Затрачено</th>
            <th>Исполнитель</th>
          </tr>
        </thead>
        <tbody>
          {report.tasks.map(task => (
            <tr key={task.id}>
              <td>
                <a 
                  href={task.url} 
                  className="task-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {task.key}: {task.summary}
                </a>
              </td>
              <td className={`status-${task.statusCategory}`}>
                {task.status}
              </td>
              <td>{task.spent}</td>
              <td>{task.assignee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default JiraReport;
