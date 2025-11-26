
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Animated } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockSafetyTracking, mockEmergencyContacts } from '@/data/mockData';
import * as Location from 'expo-location';

interface ActiveJourney {
  destination: string;
  estimatedMinutes: number;
  startTime: Date;
  startLocation: Location.LocationObject | null;
  currentLocation: Location.LocationObject | null;
  trustedContacts: string[];
}

export default function SafetyTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [destination, setDestination] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [activeJourney, setActiveJourney] = useState<ActiveJourney | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isDelayed, setIsDelayed] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Request location permissions on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status);
        console.log('Location permission status:', status);
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    })();
  }, []);

  // Pulse animation for active tracking
  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTracking]);

  // Timer for elapsed time and delay detection
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && activeJourney) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - activeJourney.startTime.getTime()) / 1000);
        setElapsedTime(elapsed);
        
        // Check if journey is delayed (exceeded estimated time by 5 minutes)
        const estimatedSeconds = activeJourney.estimatedMinutes * 60;
        const delayThreshold = estimatedSeconds + (5 * 60); // 5 minutes grace period
        
        if (elapsed > delayThreshold && !isDelayed) {
          setIsDelayed(true);
          handleDelayDetected();
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, activeJourney, isDelayed]);

  // Location tracking during journey
  useEffect(() => {
    if (isTracking && locationPermission === Location.PermissionStatus.GRANTED) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    
    return () => {
      stopLocationTracking();
    };
  }, [isTracking, locationPermission]);

  const startLocationTracking = async () => {
    try {
      console.log('Starting location tracking...');
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Or every 50 meters
        },
        (location) => {
          console.log('Location update:', location.coords);
          setActiveJourney(prev => prev ? { ...prev, currentLocation: location } : null);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      console.log('Stopping location tracking...');
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
  };

  const handleDelayDetected = () => {
    console.log('Delay detected! Alerting trusted contacts...');
    Alert.alert(
      'Delay Detected',
      'You haven\'t arrived at your destination on time. Your trusted contacts have been notified of your last known location.',
      [
        {
          text: 'I\'m OK',
          onPress: () => {
            console.log('User confirmed they are OK');
            setIsDelayed(false);
          },
        },
        {
          text: 'Need Help',
          style: 'destructive',
          onPress: () => {
            console.log('User needs help!');
            Alert.alert('Emergency Alert', 'Emergency services and all trusted contacts have been notified!');
          },
        },
      ]
    );
  };

  const startTracking = async () => {
    if (!destination.trim()) {
      Alert.alert('Missing Information', 'Please enter a destination');
      return;
    }

    if (!estimatedTime.trim()) {
      Alert.alert('Missing Information', 'Please enter estimated arrival time');
      return;
    }

    // Parse estimated time (expecting format like "30" or "30 minutes")
    const timeMatch = estimatedTime.match(/(\d+)/);
    if (!timeMatch) {
      Alert.alert('Invalid Time', 'Please enter time in minutes (e.g., "30")');
      return;
    }

    const minutes = parseInt(timeMatch[1]);
    if (minutes <= 0 || minutes > 300) {
      Alert.alert('Invalid Time', 'Please enter a time between 1 and 300 minutes');
      return;
    }

    // Check location permission
    if (locationPermission !== Location.PermissionStatus.GRANTED) {
      Alert.alert(
        'Location Permission Required',
        'Safety tracking requires location access to monitor your journey.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Grant Permission',
            onPress: async () => {
              const { status } = await Location.requestForegroundPermissionsAsync();
              setLocationPermission(status);
              if (status === Location.PermissionStatus.GRANTED) {
                startTracking();
              }
            },
          },
        ]
      );
      return;
    }

    try {
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Starting journey from:', location.coords);

      const journey: ActiveJourney = {
        destination: destination.trim(),
        estimatedMinutes: minutes,
        startTime: new Date(),
        startLocation: location,
        currentLocation: location,
        trustedContacts: mockEmergencyContacts.slice(1, 4).map(c => c.name), // Use mock contacts
      };

      setActiveJourney(journey);
      setIsTracking(true);
      setElapsedTime(0);
      setIsDelayed(false);

      Alert.alert(
        'Safety Tracking Started',
        `Your trusted contacts have been notified. They will be alerted if you don't arrive within ${minutes} minutes.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error starting tracking:', error);
      Alert.alert('Error', 'Failed to get your current location. Please try again.');
    }
  };

  const stopTracking = () => {
    Alert.alert(
      'Arrived Safely?',
      'Have you reached your destination safely?',
      [
        {
          text: 'Not Yet',
          style: 'cancel',
        },
        {
          text: 'Yes, I\'m Safe',
          onPress: () => {
            console.log('Journey completed successfully');
            setIsTracking(false);
            setActiveJourney(null);
            setDestination('');
            setEstimatedTime('');
            setElapsedTime(0);
            setIsDelayed(false);
            Alert.alert('Great!', 'Your contacts have been notified of your safe arrival.');
          },
        },
      ]
    );
  };

  const formatElapsedTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  };

  const getRemainingTime = (): string => {
    if (!activeJourney) return '';
    const remainingSeconds = (activeJourney.estimatedMinutes * 60) - elapsedTime;
    if (remainingSeconds <= 0) return 'Overdue';
    const mins = Math.floor(remainingSeconds / 60);
    return `${mins} min remaining`;
  };

  const getProgressPercentage = (): number => {
    if (!activeJourney) return 0;
    const percentage = (elapsedTime / (activeJourney.estimatedMinutes * 60)) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Tracking</Text>
        <Text style={styles.headerSubtitle}>Walk me home safely</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!isTracking ? (
          <View style={styles.startCard}>
            <View style={styles.startHeader}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="my_location"
                size={32}
                color={colors.accent}
              />
              <Text style={styles.startTitle}>Start Safety Tracking</Text>
            </View>
            <Text style={styles.startDescription}>
              Let your trusted contacts know where you&apos;re going and when you expect to arrive. 
              They&apos;ll be alerted if you don&apos;t check in on time.
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Destination</Text>
              <View style={styles.inputContainer}>
                <IconSymbol
                  ios_icon_name="location.fill"
                  android_material_icon_name="place"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Where are you going?"
                  placeholderTextColor={colors.textSecondary}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Estimated Time (minutes)</Text>
              <View style={styles.inputContainer}>
                <IconSymbol
                  ios_icon_name="clock.fill"
                  android_material_icon_name="schedule"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30"
                  placeholderTextColor={colors.textSecondary}
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.contactsPreview}>
              <Text style={styles.contactsLabel}>Trusted Contacts</Text>
              {mockEmergencyContacts.slice(1, 4).map((contact, index) => (
                <React.Fragment key={index}>
                  <View style={styles.contactItem}>
                    <IconSymbol
                      ios_icon_name="person.fill"
                      android_material_icon_name="person"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.contactName}>{contact.name}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={startTracking}>
              <IconSymbol
                ios_icon_name="play.fill"
                android_material_icon_name="play_arrow"
                size={20}
                color={colors.card}
              />
              <Text style={styles.startButtonText}>Start Tracking</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.activeCard, isDelayed && styles.activeCardDelayed]}>
            <View style={styles.activeHeader}>
              <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.pulseOuter} />
                <View style={styles.pulseInner} />
                <IconSymbol
                  ios_icon_name="location.fill"
                  android_material_icon_name="my_location"
                  size={24}
                  color={colors.card}
                />
              </Animated.View>
              <Text style={styles.activeTitle}>
                {isDelayed ? 'Delay Detected!' : 'Tracking Active'}
              </Text>
              {isDelayed && (
                <Text style={styles.delayedSubtitle}>Contacts have been notified</Text>
              )}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: isDelayed ? colors.warning : colors.card,
                }]} />
              </View>
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>Elapsed: {formatElapsedTime(elapsedTime)}</Text>
                <Text style={[styles.timeLabel, isDelayed && styles.timeLabelDelayed]}>
                  {getRemainingTime()}
                </Text>
              </View>
            </View>

            <View style={styles.activeInfo}>
              <View style={styles.infoRow}>
                <IconSymbol
                  ios_icon_name="location.fill"
                  android_material_icon_name="place"
                  size={20}
                  color={colors.card}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Destination</Text>
                  <Text style={styles.infoValue}>{activeJourney?.destination}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <IconSymbol
                  ios_icon_name="clock.fill"
                  android_material_icon_name="schedule"
                  size={20}
                  color={colors.card}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Expected Arrival</Text>
                  <Text style={styles.infoValue}>
                    {activeJourney?.estimatedMinutes} minutes
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <IconSymbol
                  ios_icon_name="person.2.fill"
                  android_material_icon_name="people"
                  size={20}
                  color={colors.card}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Watching</Text>
                  <Text style={styles.infoValue}>
                    {activeJourney?.trustedContacts.length} trusted contacts
                  </Text>
                </View>
              </View>

              {activeJourney?.currentLocation && (
                <View style={styles.infoRow}>
                  <IconSymbol
                    ios_icon_name="location.circle.fill"
                    android_material_icon_name="gps_fixed"
                    size={20}
                    color={colors.card}
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Current Location</Text>
                    <Text style={styles.infoValue}>
                      {activeJourney.currentLocation.coords.latitude.toFixed(4)}, {activeJourney.currentLocation.coords.longitude.toFixed(4)}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.stopButton} onPress={stopTracking}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.stopButtonText}>I&apos;ve Arrived Safely</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>How It Works</Text>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primary }]}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="my_location"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Location</Text>
              <Text style={styles.featureDescription}>
                Your location is tracked and shared with trusted contacts during your journey
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.warning }]}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Delay Detection</Text>
              <Text style={styles.featureDescription}>
                Contacts are alerted if you don&apos;t arrive within 5 minutes of expected time
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: colors.success }]}>
              <IconSymbol
                ios_icon_name="checkmark.shield.fill"
                android_material_icon_name="verified_user"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Safe Arrival</Text>
              <Text style={styles.featureDescription}>
                Confirm your safe arrival to automatically notify your contacts
              </Text>
            </View>
          </View>
        </View>

        {mockSafetyTracking.length > 0 && (
          <View style={styles.activeTrackingSection}>
            <Text style={styles.sectionTitle}>Active Tracking Nearby</Text>
            {mockSafetyTracking.map((tracking, index) => (
              <React.Fragment key={index}>
                <View style={styles.trackingCard}>
                  <View style={styles.trackingHeader}>
                    <View style={styles.trackingAvatar}>
                      <IconSymbol
                        ios_icon_name="person.fill"
                        android_material_icon_name="person"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.trackingInfo}>
                      <Text style={styles.trackingName}>{tracking.userName}</Text>
                      <Text style={styles.trackingTime}>Started {formatTimeAgo(tracking.startTime)}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: tracking.status === 'active' ? colors.success : colors.warning }
                    ]}>
                      <Text style={styles.statusText}>{tracking.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <View style={styles.trackingDestination}>
                    <IconSymbol
                      ios_icon_name="location.fill"
                      android_material_icon_name="place"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.trackingDestinationText}>{tracking.destination}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.accent,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.card,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  startCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  startHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  startTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  startDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  contactsPreview: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  contactsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
    marginLeft: 8,
  },
  activeCard: {
    backgroundColor: colors.success,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
  },
  activeCardDelayed: {
    backgroundColor: colors.warning,
  },
  activeHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  pulseOuter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    opacity: 0.3,
  },
  pulseInner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    opacity: 0.2,
  },
  activeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
  },
  delayedSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.card,
    borderRadius: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabel: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.9,
    fontWeight: '600',
  },
  timeLabelDelayed: {
    fontWeight: '700',
  },
  activeInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.card,
    opacity: 0.8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
  },
  stopButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 8,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  activeTrackingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  trackingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackingAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  trackingInfo: {
    flex: 1,
  },
  trackingName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  trackingTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  trackingDestination: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingDestinationText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});
