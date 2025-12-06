import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { DatabaseService } from './src/services/DatabaseService';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log('App: Initializing DatabaseService...');
        await DatabaseService.init();
        console.log('App: DatabaseService initialized');
        setDbReady(true);
      } catch (error) {
        console.error('Failed to initialize DB', error);
        setError(error);
      }
    };
    init();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', marginBottom: 10 }}>Failed to load app</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading Database...</Text>
      </View>
    );
  }

  return <AppNavigator />;
}
