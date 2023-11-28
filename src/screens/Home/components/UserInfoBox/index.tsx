import { Avatar, Text } from "@rneui/themed";
import React from "react";
import { ImageBackground, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const UserInfoBox: React.FC<{ name: string }> = ({ name }) => {
  const { top } = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("@assets/images/background.jpg")}
      style={{
        backgroundColor: "red",
        flexDirection: "row",
        paddingTop: 12 + top,
        paddingHorizontal: 16,
        paddingBottom: 60,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        zIndex: 100,
      }}
    >
      {/* <View> */}
      <Avatar
        source={require("@assets/images/bus/bus.png")}
        rounded
        size={32}
        containerStyle={{ backgroundColor: "#ccc" }}
      />
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ color: "#fff" }}>Hello,</Text>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
          {name}
        </Text>
      </View>
      {/* </View> */}
    </ImageBackground>
  );
};
