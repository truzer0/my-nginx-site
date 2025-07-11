import { create } from 'zustand';
import authService from '../services/auth.service';
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  // Проверка аутентификации при инициализации
  initialize: async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.getUserInfo();
        set({ 
          user: userData,
          isAuthenticated: true,
          isAdmin: userData.role === 'admin',
          loading: false
        });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isAdmin: false, loading: false });
    }
  },
  // Вход в систему
  login: async (credentials) => {
    try {
      const { token, user } = await authService.login(credentials);
      localStorage.setItem('token', token);
      set({ 
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin'
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  // Выход из системы
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false, isAdmin: false });
  }
}));
export default useAuthStore;
