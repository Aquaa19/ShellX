import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Theme } from '../../tokens';
import { ConfigInputField } from '../../atoms';

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
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ConfigInputField
        label="Cloud IP Address"
        value={ipAddress}
        onChangeText={onChangeIpAddress}
        placeholder="e.g. 192.168.1.100 or aws.example.com"
        keyboardType="default"
        error={ipError}
        style={styles.field}
      />
      <ConfigInputField
        label="SSH Port"
        value={port}
        onChangeText={onChangePort}
        placeholder="e.g. 22"
        keyboardType="number-pad"
        error={portError}
        style={styles.field}
      />
      <ConfigInputField
        label="SSH Username"
        value={sshUser}
        onChangeText={onChangeSshUser}
        placeholder="e.g. student"
        keyboardType="default"
        error={sshUserError}
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
});