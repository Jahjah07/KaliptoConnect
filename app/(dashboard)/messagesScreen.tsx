import MessageBubble from "@/components/message/MessageBubble";
import { auth, db } from "@/lib/firebase";
import { Feather } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Message {
  id: string;
  text: string;
  senderRole: "admin" | "contractor";
  createdAt?: any;
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const flatListRef = useRef<FlatList>(null);


  function formatDate(date: Date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    if (sameDay(date, today)) return "Today";
    if (sameDay(date, yesterday)) return "Yesterday";

    return date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }


  /* ---------------------------------------------------------- */
  /*                   Listen Auth State                        */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      }
    });

    return unsub;
  }, []);

  /* ---------------------------------------------------------- */
  /*                   Realtime Messages                        */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "conversations", uid, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];

      LayoutAnimation.configureNext(
        LayoutAnimation.Presets.easeInEaseOut
      );

      setMessages(msgs);

      // Mark admin messages as read
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();

        if (
          data.senderRole === "admin" &&
          !data.readBy?.includes(uid)
        ) {
          updateDoc(docSnap.ref, {
            readBy: [...(data.readBy || []), uid],
          });
        }
      });
      

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsub;
  }, [uid]);

  /* ---------------------------------------------------------- */
  /*                  Reset Unread Count                        */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!uid) return;

    const conversationRef = doc(db, "conversations", uid);

    updateDoc(conversationRef, {
      "unreadCount.contractor": 0,
    }).catch(() => {});
  }, [uid, messages]);

  /* ---------------------------------------------------------- */
  /*                    Presence Handling                       */
  /* ---------------------------------------------------------- */

  useEffect(() => {
    if (!uid) return;

    const presenceRef = doc(db, "presence", uid);

    setDoc(presenceRef, {
      online: true,
      lastSeen: serverTimestamp(),
    });

    return () => {
      setDoc(presenceRef, {
        online: false,
        lastSeen: serverTimestamp(),
      });
    };
  }, [uid]);

  /* ---------------------------------------------------------- */
  /*                     Send Message                           */
  /* ---------------------------------------------------------- */

  const sendMessage = async () => {
    if (!text.trim() || !uid) return;

    const conversationRef = doc(db, "conversations", uid);

    await addDoc(
      collection(conversationRef, "messages"),
      {
        senderId: uid,
        senderRole: "contractor",
        text,
        createdAt: serverTimestamp(),
        readBy: [],
      }
    );

    await setDoc(
      conversationRef,
      {
        contractorId: uid,
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        unreadCount: {
          contractor: 0,
          crm: increment(1),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setText("");
  };

  /* ---------------------------------------------------------- */
  /*                          UI                                */
  /* ---------------------------------------------------------- */

  const renderItem = ({ item, index }: any) => {
    const isMine = item.senderRole === "contractor";

    const currentDate =
      item.createdAt && item.createdAt.toDate
        ? item.createdAt.toDate()
        : null;

    const previous =
      index > 0
        ? messages[index - 1].createdAt?.toDate?.()
        : null;

    const showDate =
      currentDate &&
      (!previous ||
        currentDate.toDateString() !== previous.toDateString());

    // const isRead = item.readBy?.length > 0;
    // const isDelivered = !!item.createdAt;

    return (
      <>
        {/* Date Separator */}
        {showDate && currentDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {formatDate(currentDate)}
            </Text>
          </View>
        )}

        {/* Message Bubble */}
        <MessageBubble
          message={item}
          conversationId={uid!}
          time={currentDate ? formatTime(currentDate) : ""}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "#F7F7F7" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Chat with Support
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
            onScroll={(event) => {
              const { contentOffset, layoutMeasurement, contentSize } =
                event.nativeEvent;

              const isAtBottom =
                contentOffset.y + layoutMeasurement.height >=
                contentSize.height - 20;

              setShowScrollButton(!isAtBottom);
            }}
            scrollEventThrottle={16}
          />
        </TouchableWithoutFeedback>
        {showScrollButton && (
          <TouchableOpacity
            style={styles.scrollButton}
            onPress={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          >
            <Feather name="chevron-down" size={20} color="white" />
          </TouchableOpacity>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor="#999999"
            style={styles.input}
            multiline
            textAlignVertical="top"
            blurOnSubmit={false}
            returnKeyType="default"
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              <Feather name="send" size={24} color="white" />
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------------------------------------------------------- */
/*                          Styles                            */
/* ---------------------------------------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#005356",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "white",
  },
  messageContainer: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    maxWidth: "75%",
    backgroundColor: "#D4D4D4"
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#CDE6E3",
  },
  adminMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  messageText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#1E6F5C",
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
  },
  dateContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: "#666",
  },
  scrollButton: {
    position: "absolute",
    right: 20,
    bottom: 90,
    backgroundColor: "#1E6F5C",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
