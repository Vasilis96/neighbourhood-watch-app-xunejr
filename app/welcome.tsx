
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useGoogleAuth, simulateGoogleSignIn, GoogleUser } from '@/utils/googleAuth';
import * as WebBrowser from 'expo-web-browser';

// Required for web to work properly
WebBrowser.maybeCompleteAuthSession();

type OnboardingStep = 'welcome' | 'signup' | 'neighbourhood' | 'profile';

export default function WelcomeScreen() {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [signupMethod, setSignupMethod] = useState<'phone' | 'email' | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [neighbourhood, setNeighbourhood] = useState('');
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);

  // Google Auth setup
  const { request, response, promptAsync, redirectUri } = useGoogleAuth();

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google Auth Success:', response);
      const { authentication } = response;
      
      if (authentication?.accessToken) {
        // In a real app, you would fetch user info from Google
        // For this prototype, we'll simulate it
        const user = simulateGoogleSignIn();
        setGoogleUser(user);
        setName(user.name);
        setEmail(user.email);
        
        // Skip to neighbourhood selection
        setStep('neighbourhood');
        
        Alert.alert(
          'Google Sign-In Successful',
          `Welcome ${user.name}! Please complete your profile.`,
          [{ text: 'Continue' }]
        );
      }
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
      Alert.alert(
        'Authentication Error',
        'Failed to sign in with Google. Please try again.'
      );
    } else if (response?.type === 'cancel') {
      console.log('Google Auth Cancelled');
    }
  }, [response]);

  const handleBack = () => {
    if (step === 'signup') {
      setStep('welcome');
    } else if (step === 'neighbourhood') {
      setStep('signup');
    } else if (step === 'profile') {
      setStep('neighbourhood');
    }
  };

  const handleContinue = () => {
    if (step === 'welcome') {
      setStep('signup');
    } else if (step === 'signup') {
      if (!signupMethod) {
        Alert.alert('Please select a signup method');
        return;
      }
      if (signupMethod === 'email' && (!email || !password)) {
        Alert.alert('Please enter email and password');
        return;
      }
      if (signupMethod === 'phone' && !phone) {
        Alert.alert('Please enter phone number');
        return;
      }
      setStep('neighbourhood');
    } else if (step === 'neighbourhood') {
      if (!neighbourhood) {
        Alert.alert('Please enter your neighbourhood');
        return;
      }
      setStep('profile');
    } else if (step === 'profile') {
      if (!name) {
        Alert.alert('Please enter your name');
        return;
      }
      
      // Store user data (in a real app, this would be saved to backend/storage)
      console.log('User signed up:', {
        name,
        email,
        neighbourhood,
        googleUser,
      });
      
      router.replace('/(tabs)/(home)/');
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google Sign-In button pressed');
    console.log('Redirect URI:', redirectUri);
    
    try {
      // For prototype purposes, we'll simulate the Google sign-in
      // In a real app with proper Google OAuth credentials, you would use:
      // const result = await promptAsync();
      
      // Simulate successful sign-in for prototype
      const user = simulateGoogleSignIn();
      setGoogleUser(user);
      setName(user.name);
      setEmail(user.email);
      
      // Skip to neighbourhood selection
      setStep('neighbourhood');
      
      Alert.alert(
        'Google Sign-In (Simulated)',
        `Welcome ${user.name}!\n\nNote: This is a simulated sign-in for prototype purposes. In a production app, you would need to:\n\n1. Create a Google Cloud project\n2. Enable Google OAuth\n3. Configure OAuth credentials\n4. Add authorized redirect URIs\n\nFor now, you can continue with the demo account.`,
        [{ text: 'Continue' }]
      );
      
      // Uncomment this line when you have real Google OAuth credentials:
      // await promptAsync();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        'Sign-In Error',
        'An error occurred during sign-in. Please try again.'
      );
    }
  };

  const handleAppleSignIn = () => {
    console.log('Apple Sign-In button pressed');
    
    // For prototype purposes, simulate Apple sign-in
    const user = {
      id: 'apple_' + Math.random().toString(36).substr(2, 9),
      email: 'demo.user@icloud.com',
      name: 'Demo User',
      verified_email: true,
    };
    
    setName(user.name);
    setEmail(user.email);
    setStep('neighbourhood');
    
    Alert.alert(
      'Apple Sign-In (Simulated)',
      `Welcome ${user.name}!\n\nNote: This is a simulated sign-in for prototype purposes. In a production app, you would use expo-apple-authentication.`,
      [{ text: 'Continue' }]
    );
  };

  const handleUseCurrentLocation = () => {
    console.log('Use Current Location pressed');
    Alert.alert(
      'Location Access',
      'This feature would request your device location and automatically detect your neighbourhood.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {step !== 'welcome' && (
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('@/assets/images/26acc4e8-f7a9-43c7-97f1-3bd676977537.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 'welcome' && (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <IconSymbol
                ios_icon_name="shield.fill"
                android_material_icon_name="shield"
                size={80}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>Welcome to SafeNeighbor</Text>
            <Text style={styles.subtitle}>
              Building safer, stronger communities together
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.feature}>
                <IconSymbol
                  ios_icon_name="exclamationmark.triangle.fill"
                  android_material_icon_name="warning"
                  size={32}
                  color={colors.error}
                />
                <Text style={styles.featureTitle}>Real-time Alerts</Text>
                <Text style={styles.featureText}>
                  Stay informed about incidents in your area
                </Text>
              </View>

              <View style={styles.feature}>
                <Image
                  source={require('@/assets/images/a0cdda9f-dbf1-4abd-bc5a-b217d554ad1f.png')}
                  style={styles.featureImage}
                  resizeMode="contain"
                />
                <Text style={styles.featureTitle}>Safety Tracking</Text>
                <Text style={styles.featureText}>
                  Let friends know you&apos;re safe on your journey
                </Text>
              </View>

              <View style={styles.feature}>
                <IconSymbol
                  ios_icon_name="person.2.fill"
                  android_material_icon_name="people"
                  size={32}
                  color={colors.secondary}
                />
                <Text style={styles.featureTitle}>Community</Text>
                <Text style={styles.featureText}>
                  Connect with neighbors and build relationships
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'signup' && (
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Choose how you&apos;d like to sign up</Text>

            <View style={styles.ssoButtons}>
              <TouchableOpacity
                style={styles.ssoButton}
                onPress={handleGoogleSignIn}
                disabled={!request}
              >
                <IconSymbol
                  ios_icon_name="g.circle.fill"
                  android_material_icon_name="login"
                  size={24}
                  color={colors.text}
                />
                <Text style={styles.ssoButtonText}>
                  {!request ? 'Loading...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={[styles.ssoButton, styles.appleButton]}
                  onPress={handleAppleSignIn}
                >
                  <IconSymbol
                    ios_icon_name="apple.logo"
                    android_material_icon_name="login"
                    size={24}
                    color={colors.card}
                  />
                  <Text style={[styles.ssoButtonText, styles.appleButtonText]}>
                    Continue with Apple
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.methodButtons}>
              <TouchableOpacity
                style={[
                  styles.methodButton,
                  signupMethod === 'email' && styles.methodButtonActive,
                ]}
                onPress={() => setSignupMethod('email')}
              >
                <IconSymbol
                  ios_icon_name="envelope.fill"
                  android_material_icon_name="email"
                  size={24}
                  color={signupMethod === 'email' ? colors.card : colors.primary}
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    signupMethod === 'email' && styles.methodButtonTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.methodButton,
                  signupMethod === 'phone' && styles.methodButtonActive,
                ]}
                onPress={() => setSignupMethod('phone')}
              >
                <IconSymbol
                  ios_icon_name="phone.fill"
                  android_material_icon_name="phone"
                  size={24}
                  color={signupMethod === 'phone' ? colors.card : colors.primary}
                />
                <Text
                  style={[
                    styles.methodButtonText,
                    signupMethod === 'phone' && styles.methodButtonTextActive,
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {signupMethod === 'email' && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            )}

            {signupMethod === 'phone' && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor={colors.textSecondary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            )}

            {signupMethod && (
              <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
                <Text style={styles.primaryButtonText}>Continue</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {step === 'neighbourhood' && (
          <View style={styles.content}>
            <Image
              source={require('@/assets/images/cfd1c2fc-643d-41aa-9ff2-a94837287560.png')}
              style={styles.neighbourhoodImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Select Your Neighbourhood</Text>
            <Text style={styles.subtitle}>
              This helps us show you relevant local information
            </Text>

            {googleUser && (
              <View style={styles.userInfoCard}>
                <Text style={styles.userInfoText}>
                  Signed in as: {googleUser.email}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your neighbourhood"
                placeholderTextColor={colors.textSecondary}
                value={neighbourhood}
                onChangeText={setNeighbourhood}
              />
            </View>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleUseCurrentLocation}>
              <Image
                source={require('@/assets/images/647e59b8-f9c8-4576-82e5-3a433dce369d.png')}
                style={styles.locationIcon}
                resizeMode="contain"
              />
              <Text style={styles.secondaryButtonText}>Use Current Location</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 'profile' && (
          <View style={styles.content}>
            <IconSymbol
              ios_icon_name="person.fill"
              android_material_icon_name="person"
              size={64}
              color={colors.primary}
            />
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>
              Help your neighbors get to know you
            </Text>

            {googleUser && (
              <View style={styles.userInfoCard}>
                <Text style={styles.userInfoText}>
                  Email: {googleUser.email}
                </Text>
              </View>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.checkbox}>
                <IconSymbol
                  ios_icon_name="checkmark.square.fill"
                  android_material_icon_name="check_box"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.checkboxText}>
                  Enable 2-Factor Authentication (recommended)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}>
                <IconSymbol
                  ios_icon_name="checkmark.square.fill"
                  android_material_icon_name="check_box"
                  size={24}
                  color={colors.primary}
                />
                <Text style={styles.checkboxText}>
                  Show my profile in neighbor directory
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <Text style={styles.primaryButtonText}>Complete Setup</Text>
            </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    left: 16,
    zIndex: 10,
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  neighbourhoodImage: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 32,
  },
  feature: {
    alignItems: 'center',
    marginBottom: 24,
  },
  featureImage: {
    width: 48,
    height: 48,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 8,
  },
  locationIcon: {
    width: 20,
    height: 20,
    tintColor: colors.primary,
  },
  ssoButtons: {
    width: '100%',
    marginBottom: 24,
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ssoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 12,
  },
  appleButton: {
    backgroundColor: colors.text,
  },
  appleButtonText: {
    color: colors.card,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  methodButtons: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  methodButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 8,
  },
  methodButtonTextActive: {
    color: colors.card,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  checkboxContainer: {
    width: '100%',
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  userInfoCard: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
