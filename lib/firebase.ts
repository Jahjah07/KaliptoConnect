// Firebase for EAS build (modern React Native SDK)

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyAk2qUwH4RcmbRXexSg1P--fbZbvjomSPY',
    authDomain: 'kaliptoconnect.firebaseapp.com',
    projectId: 'kaliptoconnect',
    storageBucket: 'kaliptoconnect.firebasestorage.app',
    messagingSenderId: '625115085862',
    appId: '1:625115085862:web:836328a640aeb1009f7ae7',
};

// Initialize
const app = initializeApp(firebaseConfig);

// Modern persistent auth for production
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
export const storage = getStorage(app);
