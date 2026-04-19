import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iyibiri.app',
  appName: 'İyiBiri',
  webDir: 'out',
  server: {
    url: 'https://www.iyibiri.app/app-start',
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
