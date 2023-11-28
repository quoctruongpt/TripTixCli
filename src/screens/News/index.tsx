import React, { useEffect, useState } from "react";
import { getNews } from "@httpClient/global.api";
import { StatusApiCall } from "@constants/global";
import { useNavigation } from "@react-navigation/native";
import { TAppNavigation } from "@navigation/AppNavigator.type";
import { SafeAreaView, FlatList, View, Text, Image } from "react-native";

export const News: React.FC = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation<TAppNavigation<"Home">>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await getNews();

      if (data.status === StatusApiCall.Success) {
        setData(data.data);
      }
    } finally {
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 12,
          overflow: "hidden",
          borderColor: "grey",
          marginBottom: 16,
        }}
      >
        <Image
          source={{ uri: item.listImg[0] }}
          style={{ width: "100%", height: 150 }}
        />
        <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
          <Text
            style={{
              fontWeight: "900",
              fontSize: 16,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 12 }} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.idNews}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};
