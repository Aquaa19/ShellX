import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Theme } from '../tokens';
import { Divider, MonoText } from '../atoms';
import { 
  AppBackground, 
  DottedGridOverlay, 
  AuthTerminalWindow, 
  AuthBrandPanel, 
  GoogleSignInButton, 
  AuthTerminalOutput 
} from '../components';
import { MOCK_AUTH_TERMINAL_OUTPUT } from '../data';
import { useAuthContext } from '../context';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, isSigningIn } = useAuthContext();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-In error:', err);
    }
  };

  return (
    <AppBackground>
      <DottedGridOverlay />
      
      {/* Decorative radial atmospheric glow blob */}
      <View 
        style={styles.glowBlob} 
        accessible={false} 
        importantForAccessibility="no-hide-descendants" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AuthTerminalWindow filename="auth_session.sh">
            <AuthBrandPanel />
            
            <View style={styles.actionSection}>
              <GoogleSignInButton onPress={handleGoogleSignIn} disabled={isSigningIn} />
            </View>

            <View style={styles.dividerContainer}>
              <Divider />
            </View>

            <AuthTerminalOutput lines={MOCK_AUTH_TERMINAL_OUTPUT} />
          </AuthTerminalWindow>

          <MonoText 
            size={Theme.fontSize.labelXS} 
            color={Theme.colors.text.tertiary} 
            style={styles.footerText}
          >
            Secure isolated sandbox environment
          </MonoText>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  glowBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Theme.colors.primary.glow,
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -150 }, 
      { translateY: -150 }
    ],
    ...Theme.noShadow,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  actionSection: {
    width: '100%',
    marginVertical: Theme.spacing.md,
  },
  dividerContainer: {
    width: '100%',
    marginVertical: Theme.spacing.md,
  },
  footerText: {
    marginTop: Theme.spacing.xl,
  },
});