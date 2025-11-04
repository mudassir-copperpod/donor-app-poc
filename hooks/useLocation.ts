import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  location: Location.LocationObject | null;
  permissionStatus: Location.PermissionStatus | null;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    permissionStatus: null,
    isLoading: false,
    error: null,
  });

  /**
   * Check permission status on mount
   */
  useEffect(() => {
    checkPermissions();
  }, []);

  /**
   * Check location permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setState(prev => ({ ...prev, permissionStatus: status }));
    } catch (error) {
      console.error('Failed to check location permissions:', error);
    }
  }, []);

  /**
   * Request location permissions
   */
  const requestPermissions = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      setState(prev => ({
        ...prev,
        permissionStatus: status,
        isLoading: false,
        error: status !== Location.PermissionStatus.GRANTED 
          ? 'Location permissions denied' 
          : null,
      }));
      
      return { success: status === Location.PermissionStatus.GRANTED, status };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permissions';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Get current location
   */
  const getCurrentLocation = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Check permissions first
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Location permissions not granted');
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setState(prev => ({
        ...prev,
        location,
        isLoading: false,
        error: null,
      }));
      
      return { success: true, location };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  /**
   * Calculate distance between two coordinates (in miles)
   */
  const calculateDistance = useCallback((
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }, []);

  /**
   * Get distance from current location to a point
   */
  const getDistanceFromCurrent = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        if (!state.location) {
          const result = await getCurrentLocation();
          if (!result.success || !result.location) {
            throw new Error('Could not get current location');
          }
          
          const distance = calculateDistance(
            result.location.coords.latitude,
            result.location.coords.longitude,
            latitude,
            longitude
          );
          
          return { success: true, distance };
        }
        
        const distance = calculateDistance(
          state.location.coords.latitude,
          state.location.coords.longitude,
          latitude,
          longitude
        );
        
        return { success: true, distance };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to calculate distance';
        return { success: false, error: errorMessage };
      }
    },
    [state.location, getCurrentLocation, calculateDistance]
  );

  /**
   * Sort locations by distance from current location
   */
  const sortByDistance = useCallback(
    async (locations: Array<{ latitude: number; longitude: number; [key: string]: any }>) => {
      try {
        if (!state.location) {
          const result = await getCurrentLocation();
          if (!result.success || !result.location) {
            return locations; // Return unsorted if can't get location
          }
        }

        const currentLat = state.location?.coords.latitude;
        const currentLon = state.location?.coords.longitude;

        if (!currentLat || !currentLon) return locations;

        const locationsWithDistance = locations.map(loc => ({
          ...loc,
          distance: calculateDistance(currentLat, currentLon, loc.latitude, loc.longitude),
        }));

        return locationsWithDistance.sort((a, b) => a.distance - b.distance);
      } catch (error) {
        console.error('Failed to sort by distance:', error);
        return locations;
      }
    },
    [state.location, getCurrentLocation, calculateDistance]
  );

  /**
   * Watch location (continuous updates)
   */
  const watchLocation = useCallback(async (
    callback: (location: Location.LocationObject) => void
  ) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== Location.PermissionStatus.GRANTED) {
        throw new Error('Location permissions not granted');
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          setState(prev => ({ ...prev, location }));
          callback(location);
        }
      );

      return subscription;
    } catch (error) {
      console.error('Failed to watch location:', error);
      return null;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    location: state.location,
    permissionStatus: state.permissionStatus,
    isLoading: state.isLoading,
    error: state.error,
    hasPermission: state.permissionStatus === Location.PermissionStatus.GRANTED,
    
    // Methods
    requestPermissions,
    checkPermissions,
    getCurrentLocation,
    calculateDistance,
    getDistanceFromCurrent,
    sortByDistance,
    watchLocation,
    clearError,
  };
};
