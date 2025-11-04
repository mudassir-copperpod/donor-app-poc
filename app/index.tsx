import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    console.log('[Index] Auth state:', { isLoading, isAuthenticated });
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('[Index] Navigating to /tabs');
        router.replace('/tabs');
      } else {
        console.log('[Index] Navigating to /auth/login');
        router.replace('/auth/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
