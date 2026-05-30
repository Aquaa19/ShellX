import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Keyboard, Alert } from 'react-native';
import { Theme } from '../tokens';
import { SecondaryActionButton, BodyText, StatusIndicatorBadge } from '../atoms';
import { 
  AppBackground, 
  FocusedHeader,
  ProfileAvatarBlock,
  SettingsConfigCard,
  ServerConfigInput,
  ServerStatusSignal,
  SaveConfigurationButton
} from '../components';
import { useAppContext, useAuthContext } from '../context';
import { validateServerConfig, ServerConfigSchema } from '../services/validation';

export const SettingsScreen: React.FC = () => {
  const { serverConfig, saveServerConfig } = useAppContext();
  const { signOut, isSigningOut, user } = useAuthContext();
  
  const [ipValue, setIpValue] = useState(serverConfig.ip);
  const [portValue, setPortValue] = useState(serverConfig.port);
  const [sshUserValue, setSshUserValue] = useState(serverConfig.sshUser);
  
  const [errors, setErrors] = useState<Partial<Record<keyof ServerConfigSchema, string>>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setIpValue(serverConfig.ip);
    setPortValue(serverConfig.port);
    setSshUserValue(serverConfig.sshUser);
  }, [serverConfig]);

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
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      const { errors: validationErrors } = validateServerConfig(config);
      setErrors(validationErrors);
    }
    
    setIsSaving(false);
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
              />
              <ServerStatusSignal
                status="offline"
                onTestPress={() => {}}
              />
              <SaveConfigurationButton 
                onPress={handleSave} 
                isLoading={isSaving}
                style={styles.saveBtn} 
              />
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
                label="SIGN OUT" 
                onPress={handleSignOut} 
                loading={isSigningOut}
                disabled={isSigningOut}
                style={styles.signOutBtn}
              />
            </SettingsConfigCard>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
  saveBtn: {
    marginTop: Theme.spacing.lg,
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
  signOutBtn: {
    borderColor: Theme.colors.semantic.error,
  },
});