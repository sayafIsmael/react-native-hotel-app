import create from 'zustand';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

type AuthState = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>(set => ({
  isAuthenticated: false,
  login: async (username, password) => {
    try {
      const response = await axios.post('/login', { username, password });
      const { accessToken, refreshToken } = response.data;
      await SInfo.setItem('accessToken', accessToken, {});
      await SInfo.setItem('refreshToken', refreshToken, {});
      set({ isAuthenticated: true });
    } catch (error) {
      set({ isAuthenticated: false });
      console.error('Authentication error:', error);
      throw new Error('Authentication failed');
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = await SInfo.getItem('refreshToken', {});
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      const response = await axios.post('/refresh', { refreshToken });
      const { accessToken } = response.data;
      await SInfo.setItem('accessToken', accessToken, {});
      set((state) => ({ ...state, isAuthenticated: true }));
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new Error('Failed to refresh token');
    }
  },
}));

(async () => {
  try {
    const accessToken = await SInfo.getItem('accessToken', {});
    if (accessToken) {
      useAuthStore.setState({ isAuthenticated: true });
    }
  } catch (error) {
    console.error('Token retrieval error:', error);
  }
})();
