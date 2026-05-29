import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Theme } from '../tokens';
import { SecondaryActionButton, BodyText } from '../atoms';
import { 
  AppBackground, 
  FocusedHeader,
  ProfileAvatarBlock,
  SettingsConfigCard,
  ServerConfigInput,
  ServerStatusSignal,
  SaveConfigurationButton
} from '../components';

export const SettingsScreen: React.FC = () => {
  const [ipValue, setIpValue] = useState('192.168.1.100');
  const [portValue, setPortValue] = useState('22');

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <FocusedHeader title="Settings" onBackPress={() => {}} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardView}
        >
          <ScrollView 
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <ProfileAvatarBlock 
              name="student@shellx" 
              email="student@local" 
            />

            <SettingsConfigCard title="Remote Server">
              <ServerConfigInput
                ipAddress={ipValue}
                port={portValue}
                onChangeIpAddress={setIpValue}
                onChangePort={setPortValue}
              />
              <ServerStatusSignal
                status="offline"
                onTestPress={() => {}}
              />
              <SaveConfigurationButton 
                onPress={() => {}} 
                style={styles.saveBtn} 
              />
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
                onPress={() => {}} 
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
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  signOutBtn: {
    borderColor: Theme.colors.semantic.error,
  },
});