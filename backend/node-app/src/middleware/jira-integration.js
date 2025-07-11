const axios = require('axios');
const moment = require('moment');

class JiraService {
  constructor(baseUrl, apiToken) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
    this.axios = axios.create({
      baseURL: baseUrl,
      timeout: 20000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      }
    });
  }

  async getReport(username, startDate, endDate, useResolved = true) {
    const start = moment(startDate).startOf('day');
    const end = moment(endDate).endOf('day');

    const dateField = useResolved ? 'resolved' : 'updated';
    const jql = `project = NOC 
      AND status in ("Решено", "Закрыт")
      AND assignee = "${username}" 
      AND ${dateField} >= "${start.format('YYYY-MM-DD HH:mm')}" 
      AND ${dateField} <= "${end.format('YYYY-MM-DD HH:mm')}" 
      ORDER BY ${dateField} DESC`;

    console.log('Executing JQL:', jql); // Отладочная информация

    return this._makeRequest(jql, username, start, end);
  }

  async getDailyReport(username, daysAgo = 1) {
    const startDate = moment().subtract(daysAgo, 'days').startOf('day');
    const endDate = moment().endOf('day');
    return this.getReport(username, startDate, endDate, false); // Используем updated для дневного отчёта
  }

  async _makeRequest(jql, username, startDate, endDate) {
    try {
      const response = await this.axios.post('/rest/api/2/search', {
        jql,
        fields: [
          'key', 'summary', 'status', 'timespent',
          'assignee', 'updated', 'resolutiondate', 'issuetype'
        ],
        maxResults: 200
      });

      const tasks = response.data.issues.map(issue => ({
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        statusCategory: issue.fields.status.statusCategory?.key || 'undefined',
        spent: this._formatTime(issue.fields.timespent || 0),
        spentSeconds: issue.fields.timespent || 0,
        assignee: issue.fields.assignee?.displayName || username,
        resolutionDate: issue.fields.resolutiondate,
        updated: issue.fields.updated,
        url: `${this.baseUrl}/browse/${issue.key}`,
        issuetype: issue.fields.issuetype.name,
        isCompleted: ["Решено", "Закрыт"].includes(issue.fields.status.name)
      }));

      const totalSpent = tasks.reduce((sum, task) => sum + task.spentSeconds, 0);

      return {
        user: username,
        period: `${startDate.format('YYYY-MM-DD')} - ${endDate.format('YYYY-MM-DD')}`,
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.isCompleted).length,
        totalSpent: this._formatTime(totalSpent),
        tasks,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Jira API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  _formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0h';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}` : `${minutes}m`;
  }
}

module.exports = JiraService;
