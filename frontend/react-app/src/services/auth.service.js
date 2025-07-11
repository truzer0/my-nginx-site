import api from './api.service';
export default {
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  
  async getUserInfo() {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  async checkAdminRights() {
    const response = await api.get('/api/users/me/admin-button');
    return response.data;
  }
};
