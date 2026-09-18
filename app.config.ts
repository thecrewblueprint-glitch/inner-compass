import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosBundleIdentifier = process.env.EXPO_IOS_BUNDLE_ID;
  const androidPackage = process.env.EXPO_ANDROID_PACKAGE;
  const googleServicesFile = process.env.GOOGLE_SERVICES_JSON;
  const googleServiceInfoPlist = process.env.GOOGLE_SERVICE_INFO_PLIST;

  return {
    ...config,
    name: "Inner Compass",
    slug: "inner-compass",
    version: "0.1.0",
    orientation: "portrait",
    scheme: "innercompass",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      ...(iosBundleIdentifier ? { bundleIdentifier: iosBundleIdentifier } : {}),
      ...(googleServiceInfoPlist ? { googleServicesFile: googleServiceInfoPlist } : {})
    },
    android: {
      ...(androidPackage ? { package: androidPackage } : {}),
      ...(googleServicesFile ? { googleServicesFile } : {})
    },
    plugins: [
      "expo-router",
      "expo-dev-client",
      "@react-native-firebase/app",
      "@react-native-firebase/app-check"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      useFirebaseEmulators: process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === "true",
      firebaseEmulatorHost: process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST ?? "127.0.0.1"
    }
  };
};
