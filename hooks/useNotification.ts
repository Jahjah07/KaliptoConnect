import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleExpiryReminder(
  title: string,
  expiry?: string
) {
  if (!expiry) return;

  const reminderDate = new Date(expiry);
  reminderDate.setDate(reminderDate.getDate() - 7);
  reminderDate.setHours(9, 0, 0, 0);

  if (reminderDate.getTime() <= Date.now()) return;

  // Android channel (required)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const trigger =
    Platform.OS === "ios"
      ? {
          type: "calendar",
          year: reminderDate.getFullYear(),
          month: reminderDate.getMonth() + 1,
          day: reminderDate.getDate(),
          hour: 9,
          minute: 0,
        }
      : {
          channelId: "default",
          year: reminderDate.getFullYear(),
          month: reminderDate.getMonth() + 1,
          day: reminderDate.getDate(),
          hour: 9,
          minute: 0,
        };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Document Expiring Soon",
      body: `${title} expires in 7 days`,
    },
    trigger: trigger as any, // 👈 intentional, necessary
  });
}
