import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

export const CustomSplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for the heart
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="pets" size={60} color={Colors.white} />
          </View>
          <Animated.View
            style={[
              styles.heartIcon,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <MaterialIcons name="favorite" size={32} color={Colors.error} />
          </Animated.View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>Pet Blood Donor</Text>
        <Text style={styles.tagline}>Saving Lives Together</Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <Ionicons name="water" size={20} color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Sizes.spacing.xxl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  heartIcon: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontFamily: 'SourceSans3_700Bold',
    fontSize: 32,
    color: Colors.white,
    marginBottom: Sizes.spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: 'SourceSans3_400Regular',
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Sizes.spacing.xxl,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizes.spacing.sm,
    marginTop: Sizes.spacing.xl,
  },
  loadingText: {
    fontFamily: 'SourceSans3_600SemiBold',
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
});
