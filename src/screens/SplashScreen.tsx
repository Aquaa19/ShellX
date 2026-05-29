import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Theme } from '../tokens';
import { 
  ProgressTrack, 
  LabelCapsText, 
  SyntaxText, 
  MonoText 
} from '../atoms';
import { 
  AppBackground, 
  ScanlineOverlay, 
  ShellXBrandMark 
} from '../components';

export const SplashScreen: React.FC = () => {
  const [progress] = useState(0.72);

  return (
    <AppBackground>
      <ScanlineOverlay />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          <ShellXBrandMark size={64} animated={true} />
          
          <View style={styles.bootProgress}>
            <View style={styles.bootLine}>
              <SyntaxText role="string">[  OK  ]</SyntaxText>
              <MonoText color={Theme.colors.text.secondary}> Started kernel...</MonoText>
            </View>
            <View style={styles.bootLine}>
              <SyntaxText role="string">[  OK  ]</SyntaxText>
              <MonoText color={Theme.colors.text.secondary}> Mounted local filesystem.</MonoText>
            </View>
            <View style={styles.bootLine}>
              <SyntaxText role="string">[  OK  ]</SyntaxText>
              <MonoText color={Theme.colors.text.secondary}> Reached target Basic System.</MonoText>
            </View>
            <View style={styles.bootLine}>
              <SyntaxText role="keyword">[ WAIT ]</SyntaxText>
              <MonoText color={Theme.colors.text.secondary}> Booting VM instance...</MonoText>
            </View>
          </View>

          <View style={styles.progressBarWrapper}>
            <ProgressTrack progress={progress} />
            <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.percentageText}>
              72%
            </MonoText>
          </View>
          
        </View>

        <View style={styles.footer}>
          <LabelCapsText color={Theme.colors.text.tertiary}>
            SHELLX v1.0.0
          </LabelCapsText>
        </View>
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: Theme.spacing.xl,
  },
  bootProgress: {
    marginTop: Theme.spacing.xxxl,
    marginBottom: Theme.spacing.xxl,
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: 320,
  },
  bootLine: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  progressBarWrapper: {
    width: 180,
    alignItems: 'center',
  },
  percentageText: {
    marginTop: Theme.spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: Theme.spacing.xl,
  },
});