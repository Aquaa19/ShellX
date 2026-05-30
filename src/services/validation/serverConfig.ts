const IPV4_REGEX = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const HOSTNAME_REGEX = /^(([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})$/;

export function validateServerIP(ip: string): { valid: boolean; error?: string } {
  const trimmed = ip.trim();
  if (!trimmed) return { valid: false, error: 'IP address or hostname is required.' };
  if (IPV4_REGEX.test(trimmed) || HOSTNAME_REGEX.test(trimmed)) return { valid: true };
  return { valid: false, error: 'Enter a valid IPv4 address or hostname.' };
}

export function validateServerPort(port: string): { valid: boolean; error?: string } {
  const trimmed = port.trim();
  if (!trimmed) return { valid: false, error: 'Port number is required.' };
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return { valid: false, error: 'Port must be a number.' };
  if (num < 1 || num > 65535) return { valid: false, error: 'Port must be between 1 and 65535.' };
  return { valid: true };
}

export function validateSSHUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed) return { valid: false, error: 'SSH username is required.' };
  if (trimmed.length > 32) return { valid: false, error: 'Username too long (max 32 chars).' };
  if (!/^[a-z_][a-z0-9_-]*$/.test(trimmed)) return { valid: false, error: 'Invalid Linux username format.' };
  return { valid: true };
}

export interface ServerConfigSchema {
  ip:       string;
  port:     string;
  sshUser:  string;
}

export function validateServerConfig(config: ServerConfigSchema): {
  valid: boolean;
  errors: Partial<Record<keyof ServerConfigSchema, string>>;
} {
  const ipResult       = validateServerIP(config.ip);
  const portResult     = validateServerPort(config.port);
  const userResult     = validateSSHUsername(config.sshUser);
  const errors: Partial<Record<keyof ServerConfigSchema, string>> = {};
  if (!ipResult.valid)   errors.ip      = ipResult.error;
  if (!portResult.valid) errors.port    = portResult.error;
  if (!userResult.valid) errors.sshUser = userResult.error;
  return { valid: Object.keys(errors).length === 0, errors };
}