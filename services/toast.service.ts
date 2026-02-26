import Toast from "react-native-toast-message";

type ToastOptions = {
  title: string;
  message?: string;
  duration?: number;
};

const DEFAULT_DURATION = 4000;

export function showSuccess({
  title,
  message,
  duration = DEFAULT_DURATION,
}: ToastOptions) {
  Toast.show({
    type: "success",
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: "top",
  });
}

export function showError({
  title,
  message,
  duration = DEFAULT_DURATION,
}: ToastOptions) {
  Toast.show({
    type: "error",
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: "top",
  });
}

export function showInfo({
  title,
  message,
  duration = DEFAULT_DURATION,
}: ToastOptions) {
  Toast.show({
    type: "info",
    text1: title,
    text2: message,
    visibilityTime: duration,
    position: "top",
  });
}