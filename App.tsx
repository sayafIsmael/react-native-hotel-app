import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import {useAuthStore} from './hooks/authStore';
import './apiMock';

const Stack = createStackNavigator();

const App = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen
            name="Hotels"
            component={HomeScreen}
            options={{
              title: 'Home',
              headerTitleAlign: 'center',
            }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Login',
              headerTitleAlign: 'center',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
