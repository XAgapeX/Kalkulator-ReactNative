import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kalkulator</Text>
      <Text style={styles.author}>Katarzyna</Text>
      <ActivityIndicator size="large" color="#A8C66C" style={{ marginTop: 30 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#A8C66C',
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    color: '#fff',
    fontSize: 22,
    fontStyle: 'italic',
  },
});
