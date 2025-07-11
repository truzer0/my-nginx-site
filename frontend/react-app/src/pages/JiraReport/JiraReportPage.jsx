import React, { useState, useEffect } from 'react';
import JiraReport from '../../components/jira/JiraReport';
import { fetchJiraReport } from '../../services/jira.service';
import './JiraReportPage.css';
function JiraReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchJiraReport();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadReport();
  }, []);
  if (loading) return <div className="loading-spinner">Загрузка отчета...</div>;
  if (error) return <div className="error-message">Ошибка: {error}</div>;
  return (
    <div className="jira-report-page">
      <h1>Ежедневный отчет Jira</h1>
      <JiraReport report={report} />
    </div>
  );
}
export default JiraReportPage;
