import React, { useState } from "react";
import { StyleSheet, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Header } from "@components/Header";
import Icon from "react-native-vector-icons/MaterialIcons";

export const Notification: React.FC = () => {
  const [listNoti, setListNoti] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notification" color="red" colorText="white" />
      <ScrollView style={{ flex: 1, padding: 0 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          {!listNoti && (
            <>
              <Icon
                name="notifications-paused"
                size={80}
                style={{ color: "black" }}
              />
              <Text style={{ color: "orange" }}>Bạn không có thông báo</Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
});
