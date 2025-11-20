import React, { useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import CalculatorScreen from './screens/CalculatorScreen';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return <CalculatorScreen />;
}