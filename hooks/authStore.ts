import create from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  login: async (username, password) => {
    if (username === 'admin' && password === 'password') {
      const token = 'sample_token';
      await AsyncStorage.setItem('token', token);
      set({ isAuthenticated: true, token });
    } else {
      set({ isAuthenticated: false, token: null });
      Alert.alert('Error', 'Username or password does not match. Please try again.');
    }
  },
}));

(async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    useAuthStore.setState({ isAuthenticated: true, token });
  }
})();
