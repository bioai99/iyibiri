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
    contentInset: 'automatic',
  },
  android: {
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 2000,
      backgroundColor: '#24201B',
      showSpinner: false,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#24201B',
      overlaysWebView: true,
    },
  },
};

export default config;
