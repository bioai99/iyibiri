import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iyibiri.app',
  appName: 'İyiBiri',
  webDir: 'out',
  server: {
    // Point to Vercel deployment — replace with your actual URL
    url: 'https://www.iyibiri.app/app-start',
    cleartext: false,
  },
  ios: {
    scheme: 'İyiBiri',
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
      style: 'DARK',
      backgroundColor: '#24201B',
    },
  },
};

export default config;
