import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import { Theme } from '../../tokens';
import { TerminalText, SyntaxText, SyntaxRole, MonoText } from '../../atoms';

export interface OutputLine {
  text: string;
  role?: SyntaxRole;
}

export interface AuthTerminalOutputProps {
  lines: OutputLine[];
  style?: StyleProp<ViewStyle>;
}

const AwaitingVerificationLine: React.FC = () => {
  const [dots, setDots] = useState('...');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Cycle dots: . -> .. -> ... -> .
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '.') return '..';
        if (prev === '..') return '...';
        return '.';
      });
    }, 500);

    // Infinitely looping pulse animation (glow intensity pulsing)
    const pulse = Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.4,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulse).start();

    return () => {
      clearInterval(interval);
      pulseAnim.stopAnimation();
    };
  }, [pulseAnim]);

  return (
    <Animated.View style={{ opacity: pulseAnim }}>
      <MonoText
        color={Theme.colors.syntax.blue}
        style={styles.glowingText}
      >
        Awaiting user verification{dots}
      </MonoText>
    </Animated.View>
  );
};

export const AuthTerminalOutput: React.FC<AuthTerminalOutputProps> = ({
  lines,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {lines.map((line, index) => {
        const isOlderLine = index !== lines.length - 1;
        const isAwaitingLine = line.text.startsWith('Awaiting user verification');

        if (isAwaitingLine) {
          return <AwaitingVerificationLine key={index} />;
        }

        if (line.role) {
          return (
            <SyntaxText 
              key={index} 
              role={line.role} 
              style={isOlderLine ? styles.dimmedSyntaxText : undefined}
            >
              {line.text}
            </SyntaxText>
          );
        }

        return (
          <TerminalText 
            key={index} 
            dimmed={isOlderLine}
          >
            {line.text}
          </TerminalText>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.floor,
    borderRadius: Theme.borderRadius.default,
    marginTop: Theme.spacing.xl,
    borderWidth: Theme.borderWidth.hairline,
    borderColor: Theme.colors.border.subtle,
    ...Theme.noShadow,
  },
  dimmedSyntaxText: {
    opacity: 0.7,
  },
  glowingText: {
    textShadowColor: 'rgba(173, 198, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});