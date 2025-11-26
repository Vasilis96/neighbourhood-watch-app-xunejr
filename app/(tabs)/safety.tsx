
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockSafetyTracking } from '@/data/mockData';

export default function SafetyTrackingScreen() {
  const [isTracking, setIsTracking] = useState(false);
  const [destination, setDestination] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const startTracking = () => {
    if (!destination || !estimatedTime) {
      Alert.alert('Missing Information', 'Please enter destination and estimated arrival time');
      return;
    }

    setIsTracking(true);
    Alert.alert(
      'Safety Tracking Started',
      'Your trusted contacts have been notified and will be alerted if you don\'t arrive on time.',
      [{ text: 'OK' }]
    );
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
            setIsTracking(false);
            setDestination('');
            setEstimatedTime('');
            Alert.alert('Great!', 'Your contacts have been notified of your safe arrival.');
          },
        },
      ]
    );
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
              <Text style={styles.inputLabel}>Estimated Arrival Time</Text>
              <View style={styles.inputContainer}>
                <IconSymbol
                  ios_icon_name="clock.fill"
                  android_material_icon_name="schedule"
                  size={20}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 30 minutes"
                  placeholderTextColor={colors.textSecondary}
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                />
              </View>
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
          <View style={styles.activeCard}>
            <View style={styles.activeHeader}>
              <View style={styles.pulseContainer}>
                <View style={styles.pulse} />
                <View style={[styles.pulse, styles.pulseDelay]} />
                <IconSymbol
                  ios_icon_name="location.fill"
                  android_material_icon_name="my_location"
                  size={24}
                  color={colors.card}
                />
              </View>
              <Text style={styles.activeTitle}>Tracking Active</Text>
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
                  <Text style={styles.infoValue}>{destination}</Text>
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
                  <Text style={styles.infoValue}>{estimatedTime}</Text>
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
                  <Text style={styles.infoValue}>3 trusted contacts</Text>
                </View>
              </View>
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
                Your location is shared with trusted contacts during your journey
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
                Contacts are alerted if you don&apos;t arrive within the expected time
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
                Confirm your safe arrival to notify your contacts
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
  pulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.card,
    opacity: 0.3,
  },
  pulseDelay: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  activeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.card,
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
