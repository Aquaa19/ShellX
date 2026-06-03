import React from 'react';
import { View, StyleSheet, SafeAreaView, Modal, ScrollView, Platform } from 'react-native';
import { Theme } from '../../tokens';
import { 
  TerminalText, 
  HeadlineText, 
  BodyText, 
  MonoText, 
  LabelCapsText, 
  PrimaryActionButton, 
  SecondaryActionButton,
  MaterialIcon
} from '../../atoms';
import { AppBackground } from '../shell';

export interface StartJourneyModalProps {
  visible: boolean;
  onClose: () => void;
  onStart: () => void;
}

export const StartJourneyModal: React.FC<StartJourneyModalProps> = ({ visible, onClose, onStart }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <AppBackground>
        <SafeAreaView style={styles.safeArea}>
          {/* Header Row simulating macOS/CUI terminal header window controls */}
          <View style={styles.windowHeader}>
            <View style={styles.trafficLights}>
              <View style={[styles.light, { backgroundColor: Theme.colors.trafficLights.red }]} />
              <View style={[styles.light, { backgroundColor: Theme.colors.trafficLights.yellow }]} />
              <View style={[styles.light, { backgroundColor: Theme.colors.trafficLights.green }]} />
            </View>
            <MonoText size={12} color={Theme.colors.syntax.gray} style={styles.windowTitle}>
              shellx_briefing.sh
            </MonoText>
            <View style={styles.headerRightSpace} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Animated Title Header */}
            <View style={styles.headerBlock}>
              <LabelCapsText style={styles.badgeText}>
                🚀 CURRICULUM BOOT INTEGRITY READY
              </LabelCapsText>
              <HeadlineText size={Theme.fontSize.titleLG} color={Theme.colors.syntax.green} style={styles.mainTitle}>
                START YOUR LINUX JOURNEY
              </HeadlineText>
              <BodyText color={Theme.colors.text.secondary} style={styles.subtext}>
                Master the command line through interactive, hands-on labs executed on a remote Linux server.
              </BodyText>
            </View>

            {/* highlights block */}
            <View style={styles.sectionCard}>
              <MonoText size={11} color={Theme.colors.syntax.blue} style={styles.sectionHeader}>
                [ SYSTEM HIGHLIGHTS ]
              </MonoText>
              
              <View style={styles.highlightItem}>
                <View style={styles.iconCircle}>
                  <MaterialIcon name="terminal" size={18} color={Theme.colors.primary.default} />
                </View>
                <View style={styles.highlightTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    Interactive PTY Emulator
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Run command-line exercises directly inside a real Ubuntu sandbox.
                  </BodyText>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <View style={styles.iconCircle}>
                  <MaterialIcon name="folder-open" size={18} color={Theme.colors.syntax.orange} />
                </View>
                <View style={styles.highlightTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    Visual File System Tree
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Watch files and folders dynamically update on your screen as you create them.
                  </BodyText>
                </View>
              </View>

              <View style={styles.highlightItem}>
                <View style={styles.iconCircle}>
                  <MaterialIcon name="verified-user" size={18} color={Theme.colors.semantic.success} />
                </View>
                <View style={styles.highlightTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    Automated Task Verification
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Click 'Run Check' to run test assertions on your CLI labs instantly.
                  </BodyText>
                </View>
              </View>
            </View>

            {/* syllabus overview block */}
            <View style={styles.sectionCard}>
              <MonoText size={11} color={Theme.colors.syntax.blue} style={styles.sectionHeader}>
                [ COURSE SYLLABUS ]
              </MonoText>

              <View style={styles.syllabusStep}>
                <View style={styles.stepNumberBadge}>
                  <MonoText size={11} color={Theme.colors.syntax.green} weight="bold">01</MonoText>
                </View>
                <View style={styles.syllabusTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    Introduction & Basic Environment
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Origins of Linux, terminal shortcuts, and viewing system parameters using uname and whoami.
                  </BodyText>
                </View>
              </View>

              <View style={styles.syllabusStep}>
                <View style={styles.stepNumberBadge}>
                  <MonoText size={11} color={Theme.colors.syntax.green} weight="bold">02</MonoText>
                </View>
                <View style={styles.syllabusTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    File System Navigation
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Traversing directories via absolute/relative paths and organizing content using cd, pwd, and mkdir.
                  </BodyText>
                </View>
              </View>

              <View style={styles.syllabusStep}>
                <View style={styles.stepNumberBadge}>
                  <MonoText size={11} color={Theme.colors.syntax.green} weight="bold">03</MonoText>
                </View>
                <View style={styles.syllabusTextContent}>
                  <MonoText size={13} color={Theme.colors.text.primary} weight="bold">
                    Reading & Writing Files
                  </MonoText>
                  <BodyText size={12} color={Theme.colors.text.secondary}>
                    Viewing outputs with cat/less, extracting sections, utilizing redirects, and writing docs with nano.
                  </BodyText>
                </View>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionBlock}>
              <PrimaryActionButton 
                label="Start Journey" 
                onPress={onStart}
                leftIcon={<MaterialIcon name="play-arrow" size={18} color="#000000" />}
                style={styles.ctaButton}
              />
              <View style={{ height: Theme.spacing.md }} />
              <SecondaryActionButton 
                label="CANCEL" 
                onPress={onClose}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </AppBackground>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  windowHeader: {
    height: 40,
    backgroundColor: '#0F0F0F',
    borderBottomWidth: Theme.borderWidth.hairline,
    borderBottomColor: Theme.colors.border.subtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
  },
  trafficLights: {
    flexDirection: 'row',
    gap: 6,
    width: 60,
  },
  light: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  windowTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Theme.fontFamily.mono,
  },
  headerRightSpace: {
    width: 60,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xxl,
  },
  headerBlock: {
    marginVertical: Theme.spacing.lg,
    alignItems: 'center',
    textAlign: 'center',
  },
  badgeText: {
    color: Theme.colors.syntax.orange,
    fontSize: Theme.fontSize.labelSM,
    fontFamily: Theme.fontFamily.monoBold,
    marginBottom: Theme.spacing.xs,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
    fontFamily: Theme.fontFamily.monoBold,
  },
  subtext: {
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Theme.spacing.md,
  },
  sectionCard: {
    backgroundColor: Theme.colors.background.elevated,
    borderColor: Theme.colors.border.subtle,
    borderWidth: Theme.borderWidth.hairline,
    borderRadius: Theme.borderRadius.default,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  sectionHeader: {
    marginBottom: Theme.spacing.md,
    fontFamily: Theme.fontFamily.monoBold,
    textTransform: 'uppercase',
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161616',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
  },
  highlightTextContent: {
    flex: 1,
  },
  syllabusStep: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    alignItems: 'flex-start',
    gap: Theme.spacing.md,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(111, 251, 190, 0.08)',
    borderColor: 'rgba(111, 251, 190, 0.3)',
    borderWidth: Theme.borderWidth.hairline,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  syllabusTextContent: {
    flex: 1,
  },
  actionBlock: {
    marginTop: Theme.spacing.lg,
  },
  ctaButton: {
    backgroundColor: Theme.colors.syntax.green,
  },
});
