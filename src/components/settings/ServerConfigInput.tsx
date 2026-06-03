import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { ConfigInputField, LabelCapsText, BodyText, SafeText } from '../../atoms';

export interface ServerConfigInputProps {
  ipAddress: string;
  port: string;
  sshUser: string;
  onChangeIpAddress: (val: string) => void;
  onChangePort: (val: string) => void;
  onChangeSshUser: (val: string) => void;
  ipError?: string;
  portError?: string;
  sshUserError?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ServerConfigInput: React.FC<ServerConfigInputProps> = ({
  ipAddress,
  port,
  sshUser,
  onChangeIpAddress,
  onChangePort,
  onChangeSshUser,
  ipError,
  portError,
  sshUserError,
  disabled = false,
  style,
}) => {
  const ip1Ref = useRef<TextInput>(null);
  const ip2Ref = useRef<TextInput>(null);
  const ip3Ref = useRef<TextInput>(null);
  const ip4Ref = useRef<TextInput>(null);

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Split IP into 4 parts
  const parts = (ipAddress || '').split('.');
  const part1 = parts[0] || '';
  const part2 = parts[1] || '';
  const part3 = parts[2] || '';
  const part4 = parts[3] || '';

  const handlePartChange = (index: number, value: string) => {
    // Only allow numeric input
    const cleaned = value.replace(/[^0-9]/g, '');
    const newParts = [part1, part2, part3, part4];
    newParts[index] = cleaned;

    // Combine them with dots
    const newIp = newParts.join('.');
    onChangeIpAddress(newIp);

    // Auto-advance if 3 characters are entered
    if (cleaned.length === 3) {
      if (index === 0) ip2Ref.current?.focus();
      else if (index === 1) ip3Ref.current?.focus();
      else if (index === 2) ip4Ref.current?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string, value: string) => {
    if (key === 'Backspace' && value.length === 0) {
      if (index === 1) ip1Ref.current?.focus();
      else if (index === 2) ip2Ref.current?.focus();
      else if (index === 3) ip3Ref.current?.focus();
    }
  };

  const getBorderColor = (index: number) => {
    if (ipError) return Theme.colors.border.error;
    if (focusedIndex === index) return Theme.colors.border.focus;
    return Theme.colors.border.subtle;
  };

  return (
    <View style={[styles.container, style]}>
      {/* 4-part Cloud IP Address Input */}
      <View style={styles.ipFieldContainer}>
        <LabelCapsText color={Theme.colors.text.secondary}>
          Cloud IP Address
        </LabelCapsText>
        
        <View style={styles.ipRow}>
          <TextInput
            ref={ip1Ref}
            value={part1}
            onChangeText={(val) => handlePartChange(0, val)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(0, nativeEvent.key, part1)}
            onFocus={() => setFocusedIndex(0)}
            onBlur={() => setFocusedIndex(null)}
            maxLength={3}
            keyboardType="number-pad"
            editable={!disabled}
            style={[
              styles.ipInput,
              { borderColor: getBorderColor(0) },
              disabled && styles.disabledInput
            ]}
            placeholder="000"
            placeholderTextColor={Theme.colors.text.placeholder}
            selectionColor={Theme.colors.primary.default}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <BodyText style={styles.dot}>.</BodyText>
          
          <TextInput
            ref={ip2Ref}
            value={part2}
            onChangeText={(val) => handlePartChange(1, val)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(1, nativeEvent.key, part2)}
            onFocus={() => setFocusedIndex(1)}
            onBlur={() => setFocusedIndex(null)}
            maxLength={3}
            keyboardType="number-pad"
            editable={!disabled}
            style={[
              styles.ipInput,
              { borderColor: getBorderColor(1) },
              disabled && styles.disabledInput
            ]}
            placeholder="000"
            placeholderTextColor={Theme.colors.text.placeholder}
            selectionColor={Theme.colors.primary.default}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <BodyText style={styles.dot}>.</BodyText>
          
          <TextInput
            ref={ip3Ref}
            value={part3}
            onChangeText={(val) => handlePartChange(2, val)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(2, nativeEvent.key, part3)}
            onFocus={() => setFocusedIndex(2)}
            onBlur={() => setFocusedIndex(null)}
            maxLength={3}
            keyboardType="number-pad"
            editable={!disabled}
            style={[
              styles.ipInput,
              { borderColor: getBorderColor(2) },
              disabled && styles.disabledInput
            ]}
            placeholder="000"
            placeholderTextColor={Theme.colors.text.placeholder}
            selectionColor={Theme.colors.primary.default}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <BodyText style={styles.dot}>.</BodyText>
          
          <TextInput
            ref={ip4Ref}
            value={part4}
            onChangeText={(val) => handlePartChange(3, val)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(3, nativeEvent.key, part4)}
            onFocus={() => setFocusedIndex(3)}
            onBlur={() => setFocusedIndex(null)}
            maxLength={3}
            keyboardType="number-pad"
            editable={!disabled}
            style={[
              styles.ipInput,
              { borderColor: getBorderColor(3) },
              disabled && styles.disabledInput
            ]}
            placeholder="000"
            placeholderTextColor={Theme.colors.text.placeholder}
            selectionColor={Theme.colors.primary.default}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        {!!ipError && (
          <SafeText color={Theme.colors.semantic.error} style={styles.feedbackText}>
            {ipError}
          </SafeText>
        )}
      </View>

      <ConfigInputField
        label="SSH Port"
        value={port}
        onChangeText={onChangePort}
        placeholder="e.g. 22"
        keyboardType="number-pad"
        error={portError}
        disabled={disabled}
        style={styles.field}
      />
      
      <ConfigInputField
        label="SSH Username"
        value={sshUser}
        onChangeText={onChangeSshUser}
        placeholder="e.g. student"
        keyboardType="default"
        error={sshUserError}
        disabled={disabled}
        style={styles.field}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  field: {
    marginBottom: Theme.spacing.md,
  },
  ipFieldContainer: {
    flexDirection: 'column',
    gap: Theme.spacing.xs,
    marginBottom: Theme.spacing.md,
  },
  ipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  ipInput: {
    flex: 1,
    minHeight: Theme.layout.minTouchTarget,
    backgroundColor: Theme.colors.background.input,
    borderWidth: Theme.borderWidth.hairline,
    borderRadius: Theme.borderRadius.default,
    color: Theme.colors.text.primary,
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.bodySM,
    textAlign: 'center',
    paddingVertical: Theme.spacing.xs,
  },
  disabledInput: {
    opacity: 0.4,
  },
  dot: {
    paddingHorizontal: Theme.spacing.xs,
    fontSize: Theme.fontSize.titleLG,
    fontWeight: 'bold',
    color: Theme.colors.text.secondary,
  },
  feedbackText: {
    fontFamily: Theme.fontFamily.sans,
    fontSize: Theme.fontSize.labelSM,
    marginTop: 2,
  },
});