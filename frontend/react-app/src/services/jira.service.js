import api from './api.service';

export default {
  async getReport() {
    const response = await api.get('/api/jira/report-data');
    return response.data;
  },
  
  async searchTasks(query) {
    const response = await api.get(`/api/jira/search?query=${encodeURIComponent(query)}`);
    return response.data;
  }
};
