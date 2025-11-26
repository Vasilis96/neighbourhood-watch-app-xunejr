
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// This is required for the auth session to work properly on web
WebBrowser.maybeCompleteAuthSession();

// Google OAuth configuration
// NOTE: In a production app, you would need to:
// 1. Create a Google Cloud project
// 2. Enable Google+ API
// 3. Create OAuth 2.0 credentials (Web client ID, iOS client ID, Android client ID)
// 4. Add authorized redirect URIs
// For this prototype, we'll use a demo configuration

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// Discovery document for Google OAuth
const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email: boolean;
}

export const useGoogleAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'natively',
    path: 'auth',
  });

  console.log('Google Auth Redirect URI:', redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Token,
      usePKCE: false, // Google doesn't require PKCE for implicit flow
    },
    discovery
  );

  return {
    request,
    response,
    promptAsync,
    redirectUri,
  };
};

// Simulate fetching user info from Google
export const fetchGoogleUserInfo = async (accessToken: string): Promise<GoogleUser> => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
    return userInfo;
  } catch (error) {
    console.error('Error fetching Google user info:', error);
    throw error;
  }
};

// For prototype purposes, simulate a successful Google sign-in
export const simulateGoogleSignIn = (): GoogleUser => {
  return {
    id: 'google_' + Math.random().toString(36).substr(2, 9),
    email: 'demo.user@gmail.com',
    name: 'Demo User',
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    verified_email: true,
  };
};
