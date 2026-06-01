import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Theme } from '../tokens';
import { MaterialIcon, MonoText, BodyText, BorderedSurface, StatusDot } from '../atoms';
import { AppBackground, AppHeader, ShellXLogoText, DottedGridOverlay, ScanlineOverlay } from '../components';
import { useAppContext, useAuthContext, useLessonsContext, useTerminalConnection } from '../context';

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width: screenWidth } = useWindowDimensions();
  const { serverConfig } = useAppContext();
  const { user } = useAuthContext();
  const { modules } = useLessonsContext();
  const { connectionState } = useTerminalConnection();

  // Daily Challenge State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Dynamic Lessons Progress calculation
  const allLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const completedLessons = useMemo(() => allLessons.filter((l) => l.state === 'complete'), [allLessons]);
  const overallProgress = useMemo(() => {
    return allLessons.length > 0 ? completedLessons.length / allLessons.length : 0.0;
  }, [allLessons, completedLessons]);

  const percentage = Math.round(overallProgress * 100);

  // Construct dynamic ASCII progress bar
  const barLength = useMemo(() => {
    // Monospace character width is approx font size * 0.6
    const charWidth = 16 * 0.6;
    const padding = Theme.spacing.md * 2 + Theme.spacing.md * 2; // screen padding + card padding
    const availableWidth = screenWidth - padding - 24; // extra buffer for brackets
    return Math.max(10, Math.floor(availableWidth / charWidth));
  }, [screenWidth]);

  const completedCharsCount = Math.round(overallProgress * barLength);
  const remainingCharsCount = Math.max(0, barLength - completedCharsCount);
  const completedStr = '#'.repeat(completedCharsCount);
  const remainingStr = '#'.repeat(remainingCharsCount);

  // Status computation
  const isOnline = connectionState === 'connected';

  // System Logs adapting to active state
  const logs = useMemo(() => {
    const lines = [];
    if (user?.email) {
      lines.push({ type: 'OK', text: `Authenticated session: ${user.email}` });
    }
    if (isOnline) {
      lines.push({ type: 'OK', text: `Connected to VM: ${serverConfig.ip || 'offline'}` });
      lines.push({ type: 'OK', text: `Secure terminal sandbox active for user: ${serverConfig.sshUser}` });
    } else {
      lines.push({ type: 'WARN', text: `VM connection offline: ${serverConfig.ip || 'offline'}` });
      lines.push({ type: 'WARN', text: 'Server connection is offline. Connect in settings.' });
    }
    lines.push({ type: 'INFO', text: `Loaded ${allLessons.length || 12} interactive CLI modules` });
    return lines;
  }, [serverConfig, allLessons, user, isOnline]);

  const handleChallengeSelect = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <AppBackground>
      <DottedGridOverlay />
      <ScanlineOverlay />
      
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title=""
          leftSlot={<ShellXLogoText text="ShellX_Dashboard" size={Theme.fontSize.titleLG} />}
        />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* 1. User Profile Summary */}
          <BorderedSurface level="default" style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image 
                source={{ 
                  uri: user?.photoURL || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBycg1rCJ5P_sOHvBEr6Mlr8qXIFvXVxqntRQI0CQdG78OiAj_UQlVRtb5eklneKMRHMVOyEWvy2doQth2qCF-_zs1ek9Yu8ZPgHKNj3dV6JpuwlwUW2nz2_yhnYuz6b6nGXo3WK2l9AB0Jv2-8nBQol-DD3Dm6AvA9PYJuBbHFtG6kq0Ax_qzHBlQwdPjFKe_IT9M4VqhZ4ZxCf1obSR6Tm2Z_YqVur8qWFstNPcaI_y27EH2w7b1wSQqmE2yARM_7UPXXCj9svhbc' 
                }} 
                style={styles.avatar} 
              />
              <View style={[styles.avatarStatusBadge, { backgroundColor: isOnline ? Theme.colors.semantic.success : Theme.colors.semantic.error }]} />
            </View>
            <View style={styles.profileDetails}>
              <MonoText size={Theme.fontSize.titleMD} color={Theme.colors.syntax.blue} weight="bold">
                {serverConfig.sshUser || 'root'}@shellx
              </MonoText>
              <View style={styles.statusRow}>
                <StatusDot variant={isOnline ? 'success' : 'error'} />
                <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.statusText}>
                  System Status: {isOnline ? 'Online' : 'Offline'}
                </MonoText>
              </View>
            </View>
          </BorderedSurface>

          {/* 2. Progress Overview */}
          <BorderedSurface level="default" style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <MonoText size={Theme.fontSize.labelMD} color={Theme.colors.text.secondary} weight="bold">
                COURSE COMPLETION
              </MonoText>
              <MonoText size={Theme.fontSize.titleMD} color={Theme.colors.syntax.green} weight="bold">
                {percentage}%
              </MonoText>
            </View>
            
            {/* ASCII Progress Bar */}
            <View style={styles.asciiBarContainer}>
              <MonoText size={16} color={Theme.colors.syntax.blue} style={styles.asciiText}>
                [
                <MonoText size={16} color={Theme.colors.syntax.green} style={styles.asciiText}>{completedStr}</MonoText>
                <MonoText size={16} color={Theme.colors.border.subtle} style={styles.asciiText}>{remainingStr}</MonoText>
                ]
              </MonoText>
            </View>

            <View style={styles.progressFooter}>
              <MonoText size={10} color={Theme.colors.text.tertiary}>0%</MonoText>
              <MonoText size={10} color={Theme.colors.text.tertiary}>BOOT_COMPLETE</MonoText>
              <MonoText size={10} color={Theme.colors.text.tertiary}>100%</MonoText>
            </View>
          </BorderedSurface>

          {/* 3. Quick Access */}
          <View style={styles.quickAccessSection}>
            <TouchableOpacity 
              style={styles.launchTerminalBtn}
              onPress={() => navigation.navigate('Terminal')}
              activeOpacity={0.8}
            >
              <MaterialIcon name="terminal" size={24} color="#FFFFFF" />
              <MonoText size={Theme.fontSize.titleMD} color="#FFFFFF" weight="bold" style={styles.btnLabel}>
                Launch Terminal
              </MonoText>
            </TouchableOpacity>

            <View style={styles.quickAccessGrid}>
              <TouchableOpacity 
                style={styles.gridBtn}
                onPress={() => navigation.navigate('Lessons')}
                activeOpacity={0.8}
              >
                <MaterialIcon name="play-arrow" size={24} color={Theme.colors.primary.default} />
                <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.primary} weight="bold" style={styles.gridBtnLabel}>
                  Resume Lesson
                </MonoText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.gridBtn}
                onPress={() => navigation.navigate('Files')}
                activeOpacity={0.8}
              >
                <MaterialIcon name="folder-open" size={24} color={Theme.colors.primary.default} />
                <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.primary} weight="bold" style={styles.gridBtnLabel}>
                  Browse Files
                </MonoText>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. Recent Activity/Logs */}
          <View style={styles.logsContainer}>
            <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.logsHeading} weight="bold">
              SYSTEM_LOGS
            </MonoText>
            <BorderedSurface level="default" style={styles.logsCard}>
              <View style={styles.logsList}>
                {logs.map((log, index) => {
                  let tagColor: string = Theme.colors.syntax.green;
                  if (log.type === 'WARN') tagColor = Theme.colors.syntax.orange || '#ffb95f';
                  if (log.type === 'INFO') tagColor = Theme.colors.syntax.blue;
                  
                  return (
                    <View key={index} style={styles.logLine}>
                      <MonoText size={Theme.fontSize.codeBase} color={tagColor} style={styles.logTag} weight="bold">
                        [{log.type}]
                      </MonoText>
                      <MonoText size={Theme.fontSize.codeBase} color={Theme.colors.text.primary} style={styles.logText}>
                        {log.text}
                      </MonoText>
                    </View>
                  );
                })}
              </View>
            </BorderedSurface>
          </View>

          {/* 5. Daily Challenge */}
          <BorderedSurface level="default" style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <MonoText size={Theme.fontSize.labelMD} color={Theme.colors.syntax.orange || '#ffb95f'} weight="bold">
                Daily Challenge
              </MonoText>
              <MaterialIcon name="auto-awesome" size={18} color={Theme.colors.syntax.orange || '#ffb95f'} />
            </View>
            
            <View style={styles.challengeBody}>
              <BodyText size={Theme.fontSize.bodyMD} color={Theme.colors.text.primary} style={styles.challengeQuestion}>
                What flag is used with <MonoText size={Theme.fontSize.bodyMD} color={Theme.colors.syntax.green}>ls</MonoText> to show hidden files?
              </BodyText>

              <View style={styles.optionsList}>
                {/* Option 1: -h */}
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    selectedOption === 0 && styles.optionItemIncorrect
                  ]}
                  onPress={() => handleChallengeSelect(0)}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOutline}>
                    {selectedOption === 0 && <View style={styles.radioSelectedIncorrect} />}
                  </View>
                  <MonoText size={Theme.fontSize.codeBase} color={selectedOption === 0 ? Theme.colors.semantic.error : Theme.colors.text.secondary} style={styles.optionCode}>
                    -h
                  </MonoText>
                </TouchableOpacity>

                {/* Option 2: -l */}
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    selectedOption === 1 && styles.optionItemIncorrect
                  ]}
                  onPress={() => handleChallengeSelect(1)}
                  activeOpacity={0.7}
                >
                  <View style={styles.radioOutline}>
                    {selectedOption === 1 && <View style={styles.radioSelectedIncorrect} />}
                  </View>
                  <MonoText size={Theme.fontSize.codeBase} color={selectedOption === 1 ? Theme.colors.semantic.error : Theme.colors.text.secondary} style={styles.optionCode}>
                    -l
                  </MonoText>
                </TouchableOpacity>

                {/* Option 3: -a (Correct) */}
                <TouchableOpacity 
                  style={[
                    styles.optionItem,
                    selectedOption === 2 && styles.optionItemCorrect
                  ]}
                  onPress={() => handleChallengeSelect(2)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOutline, selectedOption === 2 && styles.radioOutlineCorrect]}>
                    {selectedOption === 2 && <View style={styles.radioSelectedCorrect} />}
                  </View>
                  <MonoText size={Theme.fontSize.codeBase} color={selectedOption === 2 ? Theme.colors.primary.default : Theme.colors.text.secondary} style={styles.optionCode}>
                    -a
                  </MonoText>
                  {selectedOption === 2 && (
                    <MonoText size={10} color={Theme.colors.syntax.green} style={styles.feedbackText} weight="bold">
                      (CORRECT)
                    </MonoText>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </BorderedSurface>

        </ScrollView>
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl + 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: '#0D0D0D',
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: Theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.lg,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  avatarStatusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0D0D0D',
  },
  profileDetails: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Theme.spacing.xs,
  },
  statusText: {
    marginLeft: Theme.spacing.xs,
  },
  progressSection: {
    padding: Theme.spacing.md,
    backgroundColor: '#0D0D0D',
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Theme.spacing.sm,
  },
  asciiBarContainer: {
    marginVertical: Theme.spacing.xs,
    alignItems: 'center',
    width: '100%',
  },
  asciiText: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: 16,
    letterSpacing: -0.5,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Theme.spacing.xs,
  },
  quickAccessSection: {
    marginBottom: Theme.spacing.md,
  },
  launchTerminalBtn: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: Theme.colors.primary.default,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  btnLabel: {
    marginLeft: Theme.spacing.md,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
  },
  gridBtn: {
    flex: 1,
    height: 64,
    backgroundColor: '#0D0D0D',
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridBtnLabel: {
    marginTop: Theme.spacing.xs,
  },
  logsContainer: {
    marginBottom: Theme.spacing.md,
  },
  logsHeading: {
    paddingHorizontal: Theme.spacing.xs,
    marginBottom: Theme.spacing.sm,
  },
  logsCard: {
    padding: Theme.spacing.md,
    backgroundColor: '#0D0D0D',
    borderRadius: Theme.borderRadius.lg,
  },
  logsList: {
    gap: Theme.spacing.xs,
  },
  logLine: {
    flexDirection: 'row',
  },
  logTag: {
    marginRight: Theme.spacing.xs,
    width: 54,
  },
  logText: {
    flex: 1,
  },
  challengeCard: {
    backgroundColor: '#0D0D0D',
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.elevated,
    borderBottomWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  challengeBody: {
    padding: Theme.spacing.md,
  },
  challengeQuestion: {
    marginBottom: Theme.spacing.md,
  },
  optionsList: {
    gap: Theme.spacing.sm,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.sm,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    borderRadius: Theme.borderRadius.default,
  },
  optionItemIncorrect: {
    borderColor: Theme.colors.semantic.error,
    backgroundColor: 'rgba(255, 180, 171, 0.05)',
  },
  optionItemCorrect: {
    borderColor: Theme.colors.primary.default,
    backgroundColor: 'rgba(173, 198, 255, 0.05)',
  },
  radioOutline: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Theme.colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  radioOutlineCorrect: {
    borderColor: Theme.colors.primary.default,
  },
  radioSelectedIncorrect: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.semantic.error,
  },
  radioSelectedCorrect: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.primary.default,
  },
  optionCode: {
    flex: 1,
  },
  feedbackText: {
    marginLeft: Theme.spacing.sm,
  },
});
