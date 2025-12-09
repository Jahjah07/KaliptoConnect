import React from "react";
import { View } from "react-native";

export default function Skeleton({
  width,
  height,
  radius = 8,
  style,
}: {
  width: number | string;
  height: number;
  radius?: number;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#E5E7EB", // light gray
          overflow: "hidden",
        },
        style,
      ]}
    />
  );
}
