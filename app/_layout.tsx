import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, AuthProvider, PetProvider } from '../context';
import { useFonts, SourceSans3_400Regular, SourceSans3_600SemiBold, SourceSans3_700Bold } from '@expo-google-fonts/source-sans-3';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { CustomSplashScreen } from '../components/SplashScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SourceSans3_400Regular,
    SourceSans3_600SemiBold,
    SourceSans3_700Bold,
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      // Give splash screen a minimum display time
      setTimeout(() => {
        SplashScreen.hideAsync();
        setAppReady(true);
      }, 2000);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !appReady) {
    return <CustomSplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AuthProvider>
          <PetProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="tabs" />
            </Stack>
          </PetProvider>
        </AuthProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}
