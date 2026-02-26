import "dotenv/config";

export default {
  expo: {
    name: "kaliptoconnect",
    slug: "kaliptoconnect",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/images/Contractor_Application_Logo.png",
    scheme: "kaliptoconnect",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.kaliptoconnect.app",
      buildNumber: "2",
      googleServicesFile: "./GoogleService-Info.plist",
      infoPlist: {
        NSCameraUsageDescription:
          "This app requires camera access to upload job site photos and capture document photos.",
        NSPhotoLibraryUsageDescription:
          "This app requires photo library access to upload job site photos and to select document images.",
        NSPhotoLibraryAddUsageDescription:
          "This app needs permission to save photos.",
        UIBackgroundModes: ["remote-notification"]
      }
    },

    android: {
      package: "com.kaliptoconnect.app",
      googleServicesFile: "./google-services.json",
      softwareKeyboardLayoutMode: "resize",
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage:
          "./assets/images/Contractor_Application_Logo.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false
    },

    web: {
      output: "static",
      favicon:
        "./assets/images/Contractor_Application_Logo.png"
    },

    plugins: [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          image:
            "./assets/images/Contractor_Application_Logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000"
          }
        }
      ]
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },

    extra: {
      EXPO_PUBLIC_FIREBASE_API_KEY:
        process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID:
        process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      ENVIRONMENT: process.env.ENVIRONMENT,
      CLOUDINARY_CLOUD_NAME:
        process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET:
        process.env.CLOUDINARY_UPLOAD_PRESET,
      EXPO_PUBLIC_API_URL:
        process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId:
          "02d5e4e7-4256-4f56-bcac-1bfdac38117c"
      }
    }
  }
};
