import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Keyboard, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import { Theme } from '../tokens';
import { SecondaryActionButton, BodyText, StatusIndicatorBadge, MaterialIcon } from '../atoms';
import { 
  AppBackground, 
  FocusedHeader,
  ProfileAvatarBlock,
  SettingsConfigCard,
  ServerConfigInput,
  ServerStatusSignal,
  SaveConfigurationButton,
  ShellXSpinner,
  TrueDarkCanvas,
  ScanlineOverlay,
  DottedGridOverlay
} from '../components';
import { useAppContext, useAuthContext, useTerminalConnection, useLessonsContext } from '../context';
import { validateServerConfig, ServerConfigSchema } from '../services/validation';
import type { ConnectionState } from '../types';

export const SettingsScreen: React.FC = () => {
  const { serverConfig, saveServerConfig } = useAppContext();
  const { signOut, isSigningOut, user } = useAuthContext();
  const { pingServer, connectionState, latencyMs } = useTerminalConnection();
  const { resetProgress } = useLessonsContext();
  
  const [ipValue, setIpValue] = useState(serverConfig.ip);
  const [portValue, setPortValue] = useState(serverConfig.port);
  const [sshUserValue, setSshUserValue] = useState(serverConfig.sshUser);
  const [isLocked, setIsLocked] = useState(!!serverConfig.ip);
  
  const [errors, setErrors] = useState<Partial<Record<keyof ServerConfigSchema, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Ping Diagnostic States
  const [isTesting, setIsTesting] = useState(false);
  const [signalState, setSignalState] = useState<ConnectionState>('offline');
  const [signalLatency, setSignalLatency] = useState<number | null>(null);

  useEffect(() => {
    setIpValue(serverConfig.ip);
    setPortValue(serverConfig.port);
    setSshUserValue(serverConfig.sshUser);
    setIsLocked(!!serverConfig.ip);
  }, [serverConfig]);

  useEffect(() => {
    if (!isTesting) {
      setSignalState(connectionState);
      if (connectionState === 'connected') {
        setSignalLatency(latencyMs);
      } else {
        setSignalLatency(null);
      }
    }
  }, [connectionState, latencyMs, isTesting]);

  const handleSave = async () => {
    Keyboard.dismiss();
    setIsSaving(true);
    setErrors({});
    
    const config: ServerConfigSchema = {
      ip: ipValue,
      port: portValue,
      sshUser: sshUserValue,
    };

    const success = await saveServerConfig(config);
    
    if (success) {
      setSaveSuccess(true);
      setIsLocked(true);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Data saved', ToastAndroid.SHORT);
      }
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      const { errors: validationErrors } = validateServerConfig(config);
      setErrors(validationErrors);
    }
    
    setIsSaving(false);
  };

  const handleTestConnection = async () => {
    Keyboard.dismiss();
    const config: ServerConfigSchema = {
      ip: ipValue,
      port: portValue,
      sshUser: sshUserValue,
    };

    const { valid, errors: validationErrors } = validateServerConfig(config);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsTesting(true);
    setSignalState('connecting');
    setSignalLatency(null);

    const result = await pingServer({
      ip: ipValue.trim(),
      port: portValue.trim(),
      sshUser: sshUserValue.trim()
    });

    setSignalState(result.reachable ? 'connected' : 'error');
    setSignalLatency(result.latencyMs);
    setIsTesting(false);
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "This will clear all local data and return you to the login screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Sign Out", style: "destructive", onPress: () => signOut() }
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all lesson progress? This will lock all lessons except the first one and delete all your challenge submissions.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reset", 
          style: "destructive", 
          onPress: async () => {
            await resetProgress();
            if (Platform.OS === 'android') {
              ToastAndroid.show('Progress reset successful', ToastAndroid.SHORT);
            }
          } 
        }
      ]
    );
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <FocusedHeader title="ShellX_Settings" onBackPress={() => {}} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardView}
        >
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <ProfileAvatarBlock 
              name={user?.displayName || 'student@shellx'} 
              email={user?.email || ''} 
              avatarUrl={user?.photoURL || undefined}
            />

            <SettingsConfigCard title="Remote Server">
              <ServerConfigInput
                ipAddress={ipValue}
                port={portValue}
                sshUser={sshUserValue}
                onChangeIpAddress={setIpValue}
                onChangePort={setPortValue}
                onChangeSshUser={setSshUserValue}
                ipError={errors.ip}
                portError={errors.port}
                sshUserError={errors.sshUser}
                disabled={isLocked}
              />
              <ServerStatusSignal
                state={signalState}
                latencyMs={signalLatency}
                onTest={handleTestConnection}
                isTesting={isTesting}
              />
              <View style={styles.actionRow}>
                <SecondaryActionButton
                  label={isLocked ? "EDIT" : "LOCK"}
                  onPress={() => setIsLocked(!isLocked)}
                  style={styles.editBtn}
                  leftIcon={
                    <MaterialIcon 
                      name={isLocked ? "edit" : "lock-open"} 
                      size={18} 
                      color={isLocked ? Theme.colors.text.secondary : Theme.colors.primary.default} 
                    />
                  }
                />
                <SaveConfigurationButton 
                  onPress={handleSave} 
                  isLoading={isSaving}
                  disabled={isLocked}
                  style={styles.saveBtn} 
                />
              </View>
              {saveSuccess && (
                <View style={styles.successBadgeContainer}>
                  <StatusIndicatorBadge label="SAVED SUCCESSFULLY" variant="success" />
                </View>
              )}
            </SettingsConfigCard>

            <SettingsConfigCard title="Preferences">
              <View style={styles.prefRow}>
                <BodyText color={Theme.colors.text.secondary}>Font Size</BodyText>
                <BodyText color={Theme.colors.text.primary}>14px</BodyText>
              </View>
              <View style={styles.prefRow}>
                <BodyText color={Theme.colors.text.secondary}>Theme</BodyText>
                <BodyText color={Theme.colors.text.primary}>True Dark OLED</BodyText>
              </View>
            </SettingsConfigCard>

            <SettingsConfigCard title="Account">
              <SecondaryActionButton 
                label="RESET LESSON PROGRESS" 
                onPress={handleResetProgress} 
                leftIcon={<MaterialIcon name="refresh" size={18} color={Theme.colors.syntax.orange} />}
                style={styles.resetBtn}
              />
              <View style={{ height: Theme.spacing.md }} />
              <SecondaryActionButton 
                label="SIGN OUT" 
                onPress={handleSignOut} 
                loading={isSigningOut}
                disabled={isSigningOut}
                leftIcon={<MaterialIcon name="logout" size={18} color={Theme.colors.semantic.error} />}
                style={styles.signOutBtn}
              />
            </SettingsConfigCard>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {(isTesting || isSaving || isSigningOut) && (
        <View style={[StyleSheet.absoluteFill, styles.spinnerOverlay]}>
          <TrueDarkCanvas />
          <DottedGridOverlay />
          <ScanlineOverlay />
          <View style={styles.fullscreenSpinnerContainer}>
            <ShellXSpinner 
              label={
                isTesting 
                  ? "Testing Connection" 
                  : isSaving 
                    ? "Saving Config" 
                    : "Signing Out"
              } 
            />
          </View>
        </View>
      )}
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    marginTop: Theme.spacing.lg,
    width: '100%',
  },
  editBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
    marginTop: 0,
  },
  successBadgeContainer: {
    marginTop: Theme.spacing.md,
    alignItems: 'center',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: 0,
  },
  resetBtn: {
    borderColor: Theme.colors.syntax.orange,
  },
  signOutBtn: {
    borderColor: Theme.colors.semantic.error,
  },
  lockToggleBtn: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
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