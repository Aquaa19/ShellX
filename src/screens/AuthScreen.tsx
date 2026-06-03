import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Theme } from '../tokens';
import { Divider, MonoText, SafeText, LabelCapsText } from '../atoms';
import { IconTextInput } from '../atoms/inputs/IconTextInput';
import { PrimaryActionButton } from '../atoms/buttons/PrimaryActionButton';
import { SecondaryActionButton } from '../atoms/buttons/SecondaryActionButton';
import { MaterialIcon } from '../atoms/icons/MaterialIcon';
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

const PREBUILT_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/png?seed=Tux',
  'https://api.dicebear.com/7.x/bottts/png?seed=Buster',
  'https://api.dicebear.com/7.x/bottts/png?seed=Rover',
  'https://api.dicebear.com/7.x/bottts/png?seed=Coco',
  'https://api.dicebear.com/7.x/bottts/png?seed=Gizmo',
  'https://api.dicebear.com/7.x/bottts/png?seed=Shadow',
  'https://api.dicebear.com/7.x/bottts/png?seed=Sparky',
  'https://api.dicebear.com/7.x/bottts/png?seed=Rusty',
];

export const AuthScreen: React.FC = () => {
  const { 
    user, 
    isOnboarded, 
    signInWithGoogle, 
    isSigningIn, 
    signInWithEmail, 
    signUpWithEmail, 
    completeOnboarding 
  } = useAuthContext();
  
  // Steps: 'login' | 'register_credentials' | 'accept_policies' | 'set_profile'
  const [authStep, setAuthStep] = useState<'login' | 'register_credentials' | 'accept_policies' | 'set_profile'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [terminalLines, setTerminalLines] = useState<OutputLine[]>(MOCK_AUTH_TERMINAL_OUTPUT);

  // If user is authenticated but not onboarded (e.g. Google Sign-In redirect), force policy acceptance step
  useEffect(() => {
    if (user && !isOnboarded) {
      setAuthStep('accept_policies');
    }
  }, [user, isOnboarded]);

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

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          logErrorToTerminal(response.errorMessage || 'Image picker error.');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) setAvatarUrl(uri);
        }
      }
    );
  };

  const handleNextToPolicies = () => {
    if (!email.trim() || !password) {
      logErrorToTerminal('Email and password fields are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      logErrorToTerminal('Invalid email format.');
      return;
    }
    if (password.length < 6) {
      logErrorToTerminal('Password must be at least 6 characters.');
      return;
    }
    setAuthStep('accept_policies');
    setTerminalLines([]);
  };

  const handleAcceptPolicies = async () => {
    if (user && !isOnboarded) {
      // Google user policy acceptance
      try {
        logInfoToTerminal('Registering policy acceptance agreement...');
        const autoUsername = user.email ? user.email.split('@')[0] : `student_${user.uid.slice(0, 5)}`;
        await completeOnboarding(autoUsername, user.photoURL || '');
      } catch (err: any) {
        logErrorToTerminal(err.message || 'Failed to complete Google onboarding.');
      }
    } else {
      // Email signup transition to profile setup
      setAuthStep('set_profile');
    }
  };

  const handleFinishEmailSignup = async () => {
    if (!displayName.trim()) {
      logErrorToTerminal('Username is required.');
      return;
    }
    try {
      logInfoToTerminal(`Executing create_user --name="${displayName.trim()}"...`);
      await signUpWithEmail(email, password, displayName, avatarUrl);
    } catch (err: any) {
      let cleanMessage = err.message || 'An authentication error occurred.';
      if (err.code === 'auth/email-already-in-use') {
        cleanMessage = 'Email address already in use.';
      } else if (err.code === 'auth/weak-password') {
        cleanMessage = 'Password is too weak.';
      }
      logErrorToTerminal(cleanMessage);
    }
  };

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password) {
      logErrorToTerminal('Email and password fields are required.');
      return;
    }
    try {
      logInfoToTerminal(`Executing sign_in --user=${email.trim()}...`);
      await signInWithEmail(email, password);
    } catch (err: any) {
      let cleanMessage = err.message || 'An authentication error occurred.';
      if (err.code === 'auth/invalid-credential') {
        cleanMessage = 'Invalid email or password.';
      }
      logErrorToTerminal(cleanMessage);
    }
  };

  const resetFlow = () => {
    setAuthStep('login');
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAvatarUrl('');
    setTerminalLines(MOCK_AUTH_TERMINAL_OUTPUT);
  };

  return (
    <AppBackground>
      <DottedGridOverlay />
      
      <View style={styles.glowBlob} accessible={false} importantForAccessibility="no-hide-descendants" />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <AuthTerminalWindow 
            filename={
              authStep === 'login' 
                ? 'auth_session.sh' 
                : authStep === 'register_credentials' 
                  ? 'step_1_credentials.sh' 
                  : authStep === 'accept_policies' 
                    ? 'step_2_policies.sh' 
                    : 'step_3_profile.sh'
            }
          >
            <AuthBrandPanel 
              tagline={
                authStep === 'login' 
                  ? 'Initialize your workspace.' 
                  : authStep === 'register_credentials' 
                    ? 'Step 1: Enter email and password.' 
                    : authStep === 'accept_policies' 
                      ? 'Step 2: Read and accept policies.' 
                      : 'Step 3: Choose username and avatar.'
              } 
            />
            
            <View style={styles.formContainer}>
              {authStep === 'login' && (
                <>
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
                    label="Sign In"
                    onPress={handleEmailSignIn}
                    loading={isSigningIn}
                    fullWidth={true}
                    style={styles.submitBtn}
                  />
                  <TouchableOpacity onPress={() => setAuthStep('register_credentials')} disabled={isSigningIn} style={styles.toggleContainer}>
                    <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.primary.default}>
                      Need an account? Create one _
                    </MonoText>
                  </TouchableOpacity>
                  <View style={styles.dividerContainer}>
                    <Divider />
                  </View>
                  <View style={styles.actionSection}>
                    <GoogleSignInButton onPress={handleGoogleSignIn} disabled={isSigningIn} />
                  </View>
                </>
              )}

              {authStep === 'register_credentials' && (
                <>
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
                    label="Next  _>"
                    onPress={handleNextToPolicies}
                    fullWidth={true}
                    style={styles.submitBtn}
                  />
                  <TouchableOpacity onPress={resetFlow} disabled={isSigningIn} style={styles.toggleContainer}>
                    <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.primary.default}>
                      Already registered? Sign In _
                    </MonoText>
                  </TouchableOpacity>
                </>
              )}

              {authStep === 'accept_policies' && (
                <>
                  <View style={styles.policyBox}>
                    <LabelCapsText color={Theme.colors.primary.default} style={styles.policyTitle}>
                      User Agreement & Privacy Policy
                    </LabelCapsText>
                    <MonoText size={11} color={Theme.colors.text.secondary} style={styles.policyLine}>
                      1. You agree to use ShellX strictly for educational Linux practicals and scripting.
                    </MonoText>
                    <MonoText size={11} color={Theme.colors.text.secondary} style={styles.policyLine}>
                      2. You will not attempt network scanning, DDoS execution, or malicious container escaping.
                    </MonoText>
                    <MonoText size={11} color={Theme.colors.text.secondary} style={styles.policyLine}>
                      3. All inputs are monitored by the security sentinel audit logger.
                    </MonoText>
                  </View>
                  <PrimaryActionButton
                    label="Accept & Continue"
                    onPress={handleAcceptPolicies}
                    fullWidth={true}
                    style={styles.submitBtn}
                  />
                  <TouchableOpacity onPress={resetFlow} disabled={isSigningIn} style={styles.toggleContainer}>
                    <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.semantic.error}>
                      Decline & Reset _
                    </MonoText>
                  </TouchableOpacity>
                </>
              )}

              {authStep === 'set_profile' && (
                <>
                  <IconTextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="Username / Handle"
                    style={styles.inputField}
                    disabled={isSigningIn}
                  />
                  
                  <View style={styles.pickerContainer}>
                    <LabelCapsText color={Theme.colors.text.secondary} style={styles.fieldLabel}>
                      Profile Picture
                    </LabelCapsText>
                    <View style={styles.pickerRow}>
                      <View style={styles.previewContainer}>
                        {avatarUrl ? (
                          <Image source={{ uri: avatarUrl }} style={styles.previewImage} />
                        ) : (
                          <MaterialIcon name="person" size={24} color={Theme.colors.text.secondary} />
                        )}
                      </View>
                      <SecondaryActionButton
                        label="CHOOSE FROM GALLERY"
                        onPress={handlePickImage}
                        leftIcon={<MaterialIcon name="photo-library" size={18} color={Theme.colors.primary.default} />}
                        style={styles.pickerBtn}
                      />
                    </View>
                  </View>

                  <View style={styles.prebuiltContainer}>
                    <LabelCapsText color={Theme.colors.text.secondary} style={styles.fieldLabel}>
                      Prebuilt Options
                    </LabelCapsText>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.prebuiltScrollContent}
                    >
                      {PREBUILT_AVATARS.map((url, index) => {
                        const isSelected = avatarUrl === url;
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => setAvatarUrl(url)}
                            style={[
                              styles.prebuiltAvatarTouch,
                              isSelected && styles.prebuiltAvatarSelected,
                            ]}
                          >
                            <Image source={{ uri: url }} style={styles.prebuiltAvatarImage} />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <PrimaryActionButton
                    label="Finish & Create Account"
                    onPress={handleFinishEmailSignup}
                    loading={isSigningIn}
                    fullWidth={true}
                    style={styles.submitBtn}
                  />
                  <TouchableOpacity onPress={resetFlow} disabled={isSigningIn} style={styles.toggleContainer}>
                    <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.semantic.error}>
                      Cancel & Reset _
                    </MonoText>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <AuthTerminalOutput lines={terminalLines} />
          </AuthTerminalWindow>

          <MonoText size={Theme.fontSize.labelXS} color={Theme.colors.text.tertiary} style={styles.footerText}>
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
  policyBox: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface.raised,
    borderRadius: Theme.borderRadius.default,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    marginBottom: Theme.spacing.md,
  },
  policyTitle: {
    marginBottom: Theme.spacing.sm,
  },
  policyLine: {
    marginBottom: Theme.spacing.xs,
    lineHeight: 16,
  },
  pickerContainer: {
    marginTop: Theme.spacing.sm,
    width: '100%',
  },
  fieldLabel: {
    marginBottom: Theme.spacing.xs,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  previewContainer: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  pickerBtn: {
    flex: 1,
  },
  prebuiltContainer: {
    marginTop: Theme.spacing.md,
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  prebuiltScrollContent: {
    paddingVertical: Theme.spacing.xs,
    gap: Theme.spacing.sm,
  },
  prebuiltAvatarTouch: {
    width: 44,
    height: 44,
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    backgroundColor: Theme.colors.surface.raised,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  prebuiltAvatarSelected: {
    borderColor: Theme.colors.primary.default,
    borderWidth: 2,
  },
  prebuiltAvatarImage: {
    width: '100%',
    height: '100%',
  },
});