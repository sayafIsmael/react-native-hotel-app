import create from 'zustand';
import axios from 'axios';
import SInfo from 'react-native-sensitive-info';

type AuthState = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
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
  }
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
