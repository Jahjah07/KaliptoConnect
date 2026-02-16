import { auth, db } from "@/lib/firebase";
import { Feather } from "@expo/vector-icons";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  message: any;
  conversationId: string;
  time?: string;
}

export default function MessageBubble({
  message,
  conversationId,
  time,
}: Props) {
  const uid = auth.currentUser?.uid;
  const isMine = message.senderId === uid;

  const isRead = message.readBy?.length > 0;
  const isDelivered = !!message.createdAt;

  const handleLongPress = () => {
    if (!isMine || message.deleted) return;

    Alert.alert("Message Options", "", [
      {
        text: "Edit",
        onPress: handleEdit,
      },
      {
        text: "Delete",
        onPress: handleDelete,
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleEdit = () => {
    Alert.prompt(
      "Edit Message",
      "",
      async (newText) => {
        if (!newText || newText === message.text) return;

        await updateDoc(
          doc(
            db,
            "conversations",
            conversationId,
            "messages",
            message.id
          ),
          {
            text: newText,
            editedAt: serverTimestamp(),
          }
        );
      },
      "plain-text",
      message.text
    );
  };

  const handleDelete = async () => {
    await updateDoc(
      doc(
        db,
        "conversations",
        conversationId,
        "messages",
        message.id
      ),
      {
        deleted: true,
        text: "",
      }
    );
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        isMine ? styles.mine : styles.other,
      ]}
    >
      {message.deleted ? (
        <Text style={styles.deletedText}>
          This message was deleted
        </Text>
      ) : (
        <>
          <Text style={styles.text}>{message.text}</Text>

          {message.editedAt && (
            <Text style={styles.edited}>
              (edited)
            </Text>
          )}

          {time && (
            <View style={styles.meta}>
              <Text style={styles.time}>{time}</Text>

              {isMine && (
                <Feather
                  name={
                    isRead
                      ? "check-circle"
                      : isDelivered
                      ? "check"
                      : "clock"
                  }
                  size={12}
                  color={isRead ? "#1E6F5C" : "#888"}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "75%",
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: "#CDE6E3",
  },
  other: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  text: {
    color: "#000",
  },
  deletedText: {
    fontStyle: "italic",
    color: "#888",
  },
  edited: {
    fontSize: 10,
    color: "#777",
    marginTop: 4,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    alignItems: "center",
  },
  time: {
    fontSize: 10,
    color: "#666",
  },
});
