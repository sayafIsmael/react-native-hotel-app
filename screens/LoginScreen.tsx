import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuthStore } from '../hooks/authStore';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    if (!username || !password) { 
      Alert.alert('Error', 'Please provide both username and password.'); 
      return;
    }
    login(username, password);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        label="Username"
        value={username}
        placeholder='eg: admin'
        onChangeText={setUsername}
        style={{ marginBottom: 20, width: 300 }}
      />
      <TextInput
        label="Password"
        value={password}
        placeholder='eg: password'
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 20, width: 300 }}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        style={{ width: 300, borderRadius: 10 }} 
        contentStyle={{ height: 50 }} 
        labelStyle={{ fontSize: 16 }} 
      >
        Login
      </Button>
    </View>
  );
};

export default LoginScreen;
