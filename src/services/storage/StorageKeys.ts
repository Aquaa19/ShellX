export const StorageKeys = {
  SERVER_IP:              '@shellx/server_ip',
  SERVER_PORT:            '@shellx/server_port',
  SERVER_SSH_USER:        '@shellx/server_ssh_user',
  AUTH_USER_UID:          '@shellx/auth_user_uid',
  AUTH_USER_DISPLAY_NAME: '@shellx/auth_user_display_name',
  AUTH_USER_EMAIL:        '@shellx/auth_user_email',
  AUTH_USER_PHOTO_URL:    '@shellx/auth_user_photo_url',
  APP_ONBOARDED:          '@shellx/app_onboarded',
  LAST_ACTIVE_SCREEN:     '@shellx/last_active_screen',
  TERMINAL_HISTORY:       '@shellx/terminal_history',
} as const;

export type StorageKey = typeof StorageKeys[keyof typeof StorageKeys];