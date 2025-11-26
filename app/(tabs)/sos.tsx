
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { mockEmergencyContacts } from '@/data/mockData';

export default function SOSScreen() {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handlePressIn = () => {
    setIsPressed(true);
    setCountdown(3);
    
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();

    startPulse();

    let count = 3;
    countdownTimer.current = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count === 0) {
        if (countdownTimer.current) {
          clearInterval(countdownTimer.current);
        }
        triggerEmergency();
      }
    }, 1000);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    stopPulse();

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
      countdownTimer.current = null;
    }
    setCountdown(3);
  };

  const triggerEmergency = () => {
    setEmergencyMode(true);
    stopPulse();
    
    Alert.alert(
      'Emergency Alert Sent!',
      'Emergency services have been notified and your trusted contacts have been alerted with your location.',
      [
        {
          text: 'Cancel Emergency',
          style: 'cancel',
          onPress: () => {
            setEmergencyMode(false);
            setIsPressed(false);
            scaleAnim.setValue(1);
          },
        },
      ]
    );
  };

  const callEmergency = () => {
    Alert.alert(
      'Call Emergency Services',
      'This will call 112 (Emergency Services)',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Now',
          style: 'destructive',
          onPress: () => {
            console.log('Calling 112...');
            Alert.alert('Simulated Call', 'In a real app, this would dial 112');
          },
        },
      ]
    );
  };

  const alertNeighbors = () => {
    Alert.alert(
      'Alert Neighbors',
      'Send an emergency alert to nearby neighbors and your trusted contacts?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: () => {
            console.log('Alerting neighbors...');
            Alert.alert('Alert Sent!', 'Your neighbors and trusted contacts have been notified.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency SOS</Text>
        <Text style={styles.headerSubtitle}>Press and hold for emergency</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.instructionsCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.info}
          />
          <Text style={styles.instructionsText}>
            Press and hold the SOS button for 3 seconds to trigger an emergency alert
          </Text>
        </View>

        <View style={styles.sosContainer}>
          <Animated.View
            style={[
              styles.sosButtonWrapper,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.sosButton,
                isPressed && styles.sosButtonPressed,
                emergencyMode && styles.sosButtonEmergency,
              ]}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <Animated.View
                style={[
                  styles.sosButtonInner,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <IconSymbol
                  ios_icon_name="exclamationmark.triangle.fill"
                  android_material_icon_name="warning"
                  size={80}
                  color={colors.card}
                />
                {isPressed && countdown > 0 && (
                  <Text style={styles.countdownText}>{countdown}</Text>
                )}
                {emergencyMode && (
                  <Text style={styles.emergencyText}>ACTIVE</Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.sosLabel}>
            {isPressed ? 'Hold to activate...' : emergencyMode ? 'Emergency Active' : 'Press & Hold SOS'}
          </Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={callEmergency}>
            <View style={[styles.actionIconContainer, { backgroundColor: colors.error }]}>
              <IconSymbol
                ios_icon_name="phone.fill"
                android_material_icon_name="phone"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Call Emergency Services</Text>
              <Text style={styles.actionSubtitle}>Dial 112 immediately</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={alertNeighbors}>
            <View style={[styles.actionIconContainer, { backgroundColor: colors.warning }]}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.card}
              />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Alert Neighbors</Text>
              <Text style={styles.actionSubtitle}>Send in-app emergency alert</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.contactsSection}>
          <Text style={styles.contactsTitle}>Emergency Contacts</Text>
          {mockEmergencyContacts.map((contact, index) => (
            <React.Fragment key={index}>
              <View style={styles.contactCard}>
                <View style={styles.contactIcon}>
                  <IconSymbol
                    ios_icon_name="person.fill"
                    android_material_icon_name="person"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => {
                    console.log('Calling:', contact.phone);
                    Alert.alert('Simulated Call', `Calling ${contact.name} at ${contact.phone}`);
                  }}
                >
                  <IconSymbol
                    ios_icon_name="phone.fill"
                    android_material_icon_name="phone"
                    size={18}
                    color={colors.card}
                  />
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
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
    backgroundColor: colors.error,
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
  content: {
    flex: 1,
    padding: 16,
  },
  instructionsCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  sosContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  sosButtonWrapper: {
    marginBottom: 16,
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 24px rgba(244, 67, 54, 0.4)',
    elevation: 8,
  },
  sosButtonPressed: {
    backgroundColor: '#D32F2F',
  },
  sosButtonEmergency: {
    backgroundColor: '#B71C1C',
  },
  sosButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    position: 'absolute',
    fontSize: 72,
    fontWeight: '800',
    color: colors.card,
  },
  emergencyText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: '800',
    color: colors.card,
  },
  sosLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 24,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  contactsSection: {
    marginBottom: 100,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
