import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iyibiri.app',
  appName: 'İyiBiri',
  webDir: 'out',
  server: {
    url: 'https://www.iyibiri.app/app-start',
    allowNavigation: ['iyibiri.app', 'www.iyibiri.app', '*.iyibiri.app'],
    cleartext: false,
  },
  ios: {
    scheme: 'iyibiri',
    contentInset: 'never',
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
