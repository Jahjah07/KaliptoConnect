import { Receipt } from "@/types/receipt";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export function ReceiptCard({
  receipt,
  projectId,
}: {
  receipt: Receipt;
  projectId: string;
}) {
  const router = useRouter();

  const displayDate =
    receipt.date ?? receipt.updatedAt;

  const formattedDate = displayDate
    ? new Date(displayDate).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "No date";

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 14,
        flexDirection: "row",
      }}
    >
      {/* IMAGE → PREVIEW */}
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(dashboard)/project/[id]/receipts/preview",
            params: {
              id: projectId,
              image: receipt.url,
            },
          })
        }
      >
        <Image
          source={{ uri: receipt.url }}
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            marginRight: 12,
            backgroundColor: "#eee",
          }}
        />
      </Pressable>

      {/* BODY → EDIT */}
      <Pressable
        style={{ flex: 1, justifyContent: "center" }}
        onPress={() =>
          router.push({
            pathname: "/(dashboard)/project/[id]/receipts/edit",
            params: {
              id: projectId,
              receiptId: receipt._id,
              amount:
                receipt.amount != null
                  ? receipt.amount.toString()
                  : "",
              date: receipt.date ?? receipt.updatedAt,
            },
          })
        }
      >
        {/* TITLE */}
        <Text
          style={{
            fontWeight: "700",
            fontSize: 15,
          }}
          numberOfLines={1}
        >
          {receipt.title?.trim()
            ? receipt.title
            : `receipt-${receipt._id.slice(-3)}`}
        </Text>

        {/* AMOUNT */}
        <Text
          style={{
            fontWeight: "600",
            marginTop: 4,
          }}
        >
          {receipt.amount != null
            ? `$${receipt.amount.toFixed(2)}`
            : "Tap to add amount"}
        </Text>

        {/* DATE */}
        <Text
          style={{
            color: "#6B7280",
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {formattedDate}
        </Text>
      </Pressable>
    </View>
  );
}
