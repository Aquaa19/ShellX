import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Theme } from '../tokens';
import { ProgressTrack, LabelCapsText, SyntaxText, MonoText } from '../atoms';
import { AppBackground, ScanlineOverlay, ShellXBrandMark } from '../components';
import { StorageService, StorageKeys } from '../services/storage';

// Assuming RootStackParamList exists in your navigation setup
type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

interface BootLog {
  id: string;
  tag: string;
  tagRole: 'string' | 'keyword';
  message: string;
}

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [progress, setProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState<BootLog[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const sequence = [
      { delay: 300, log: { id: '1', tag: '[  OK  ]', tagRole: 'string' as const, message: ' Started kernel...' } },
      { delay: 600, log: { id: '2', tag: '[  OK  ]', tagRole: 'string' as const, message: ' Mounted local filesystem.' } },
      { delay: 900, log: { id: '3', tag: '[  OK  ]', tagRole: 'string' as const, message: ' Reached target Basic System.' } },
      { delay: 1200, log: { id: '4', tag: '[ WAIT ]', tagRole: 'keyword' as const, message: ' Booting VM instance...' } },
    ];

    // Start progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          return 1;
        }
        return prev + 0.05;
      });
    }, 75);

    // Sequence logs
    sequence.forEach(({ delay, log }) => {
      const timeout = setTimeout(() => {
        setBootLogs(prev => [...prev, log]);
      }, delay);
      timeoutsRef.current.push(timeout);
    });

    // Check auth and route after delay
    const routingTimeout = setTimeout(async () => {
      // TODO: import auth from '@react-native-firebase/auth' in Phase 2.2
      // Check auth().currentUser or cached UID to decide route: 'Main' or 'Auth'
      const uid = await StorageService.get<string>(StorageKeys.AUTH_USER_UID);
      if (uid) {
        navigation.replace('Main');
      } else {
        navigation.replace('Auth');
      }
    }, 2000);
    timeoutsRef.current.push(routingTimeout);

    const timeouts = timeoutsRef.current;
    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [navigation]);

  const percentage = Math.min(Math.round(progress * 100), 100);

  return (
    <AppBackground>
      <ScanlineOverlay />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          <ShellXBrandMark size={64} animated={true} />
          
          <View style={styles.bootProgress}>
            {bootLogs.map((log) => (
              <View key={log.id} style={styles.bootLine}>
                <SyntaxText role={log.tagRole}>{log.tag}</SyntaxText>
                <MonoText color={Theme.colors.text.secondary}>{log.message}</MonoText>
              </View>
            ))}
          </View>

          <View style={styles.progressBarWrapper}>
            <ProgressTrack progress={progress} />
            <MonoText size={Theme.fontSize.labelSM} color={Theme.colors.text.secondary} style={styles.percentageText}>
              {percentage}%
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
    minHeight: 120, // Prevents layout jump
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