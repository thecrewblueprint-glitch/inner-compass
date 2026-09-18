import { getApp } from "@react-native-firebase/app";
import {
  ReactNativeFirebaseAppCheckProvider,
  initializeAppCheck
} from "@react-native-firebase/app-check";
import { getAuth, signInAnonymously } from "@react-native-firebase/auth";
import {
  connectFunctionsEmulator,
  getFunctions
} from "@react-native-firebase/functions";

let initialized = false;

export async function bootstrapFirebase(): Promise<void> {
  if (initialized) return;

  const app = getApp();
  const provider = new ReactNativeFirebaseAppCheckProvider();

  provider.configure({
    android: {
      provider: __DEV__ ? "debug" : "playIntegrity"
    },
    apple: {
      provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback"
    }
  });

  await initializeAppCheck(app, {
    provider,
    isTokenAutoRefreshEnabled: true
  });

  const auth = getAuth(app);
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }

  if (__DEV__ && process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === "true") {
    const functions = getFunctions(app);
    connectFunctionsEmulator(
      functions,
      process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST ?? "127.0.0.1",
      5001
    );
  }

  initialized = true;
}
