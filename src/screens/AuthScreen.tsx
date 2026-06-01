import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Theme } from '../tokens';
import { Divider, MonoText } from '../atoms';
import { IconTextInput } from '../atoms/inputs/IconTextInput';
import { PrimaryActionButton } from '../atoms/buttons/PrimaryActionButton';
import { 
  AppBackground, 
  DottedGridOverlay, 
  AuthTerminalWindow, 
  AuthBrandPanel, 
  GoogleSignInButton, 
  AuthTerminalOutput,
  OutputLine,
  ShellXSpinner,
  TrueDarkCanvas,
  ScanlineOverlay
} from '../components';
import { MOCK_AUTH_TERMINAL_OUTPUT } from '../data';
import { useAuthContext } from '../context';

export const AuthScreen: React.FC = () => {
  const { signInWithGoogle, isSigningIn, signInWithEmail, signUpWithEmail } = useAuthContext();
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [terminalLines, setTerminalLines] = useState<OutputLine[]>(MOCK_AUTH_TERMINAL_OUTPUT);

  const logErrorToTerminal = (errorMsg: string) => {
    setTerminalLines(prev => [
      ...prev,
      { text: `[ ERROR ] ${errorMsg}`, role: 'error' }
    ]);
  };

  const logInfoToTerminal = (msg: string) => {
    setTerminalLines(prev => [
      ...prev,
      { text: msg, role: 'default' }
    ]);
  };

  const handleGoogleSignIn = async () => {
    try {
      logInfoToTerminal('Initiating Google authentication...');
      await signInWithGoogle();
    } catch (err: any) {
      logErrorToTerminal(err.message || 'Google Sign-In failed.');
    }
  };

  const handleAuthSubmit = async () => {
    if (!email.trim() || !password) {
      logErrorToTerminal('Email and password fields are required.');
      return;
    }

    if (authMode === 'register' && !displayName.trim()) {
      logErrorToTerminal('Full Name is required to register profile.');
      return;
    }

    // Standard email pattern matching
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      logErrorToTerminal('Invalid email format.');
      return;
    }

    if (password.length < 6) {
      logErrorToTerminal('Password must be at least 6 characters.');
      return;
    }

    try {
      if (authMode === 'login') {
        logInfoToTerminal(`Executing sign_in --user=${email.trim()}...`);
        await signInWithEmail(email, password);
      } else {
        logInfoToTerminal(`Executing create_user --name="${displayName.trim()}"...`);
        await signUpWithEmail(email, password, displayName);
      }
    } catch (err: any) {
      let cleanMessage = err.message || 'An authentication error occurred.';
      if (err.code === 'auth/invalid-credential') {
        cleanMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        cleanMessage = 'Email address already in use.';
      } else if (err.code === 'auth/invalid-email') {
        cleanMessage = 'Malformed email address.';
      } else if (err.code === 'auth/weak-password') {
        cleanMessage = 'Password is too weak.';
      }
      logErrorToTerminal(cleanMessage);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => (prev === 'login' ? 'register' : 'login'));
    setEmail('');
    setPassword('');
    setDisplayName('');
    setTerminalLines(MOCK_AUTH_TERMINAL_OUTPUT);
  };

  return (
    <AppBackground>
      <DottedGridOverlay />
      
      {/* Decorative radial atmospheric glow blob */}
      <View 
        style={styles.glowBlob} 
        accessible={false} 
        importantForAccessibility="no-hide-descendants" 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AuthTerminalWindow filename={authMode === 'login' ? 'auth_session.sh' : 'create_account.sh'}>
            <AuthBrandPanel 
              tagline={authMode === 'login' ? 'Initialize your workspace.' : 'Register secure profile credentials.'} 
            />
            
            <View style={styles.formContainer}>
              {authMode === 'register' && (
                <IconTextInput
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Full Name"
                  style={styles.inputField}
                  disabled={isSigningIn}
                />
              )}
              <IconTextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                keyboardType="email-address"
                style={styles.inputField}
                disabled={isSigningIn}
              />
              <IconTextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={true}
                style={styles.inputField}
                disabled={isSigningIn}
              />

              <PrimaryActionButton
                label={authMode === 'login' ? 'Sign In' : 'Create Account'}
                onPress={handleAuthSubmit}
                loading={isSigningIn}
                fullWidth={true}
                style={styles.submitBtn}
              />

              <TouchableOpacity onPress={toggleAuthMode} disabled={isSigningIn} style={styles.toggleContainer}>
                <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.primary.default}>
                  {authMode === 'login' 
                    ? 'Need an account? Create one _' 
                    : 'Already registered? Sign In _'}
                </MonoText>
              </TouchableOpacity>
            </View>

            <View style={styles.dividerContainer}>
              <Divider />
            </View>

            <View style={styles.actionSection}>
              <GoogleSignInButton onPress={handleGoogleSignIn} disabled={isSigningIn} />
            </View>

            <AuthTerminalOutput lines={terminalLines} />
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

      {isSigningIn && (
        <View style={[StyleSheet.absoluteFill, styles.spinnerOverlay]}>
          <TrueDarkCanvas />
          <DottedGridOverlay />
          <ScanlineOverlay />
          <View style={styles.fullscreenSpinnerContainer}>
            <ShellXSpinner label="Authenticating" />
          </View>
        </View>
      )}
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
  formContainer: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  inputField: {
    marginBottom: Theme.spacing.sm,
  },
  submitBtn: {
    marginTop: Theme.spacing.md,
  },
  toggleContainer: {
    alignItems: 'center',
    marginTop: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
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
  spinnerOverlay: {
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenSpinnerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});