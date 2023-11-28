import { Text } from "@rneui/themed";
import React from "react";
import { View } from "react-native";
import Icon1 from "react-native-vector-icons/MaterialIcons";

type TItem = {
  time: string;
  title: string;
  desc: string;
  icon: { name: string; color: string };
};

export const Steps: React.FC<{ data: TItem[] }> = ({ data = [] }) => {
  return (
    <View style={{ paddingVertical: 16 }}>
      {data.map((item, index) => (
        <Item
          key={index}
          isLastItem={index === data.length - 1}
          time={item.time}
          title={item.title}
          desc={item.desc}
          icon={item.icon}
        />
      ))}
    </View>
  );
};

const Item = ({
  isLastItem,
  time,
  title,
  desc,
  icon,
}: {
  isLastItem: boolean;
} & TItem) => {
  return (
    <View style={{ flexDirection: "row", minHeight: isLastItem ? 0 : 60 }}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "right",
            paddingHorizontal: 16,
            fontWeight: "600",
          }}
        >
          {time}
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          borderLeftWidth: 2,
          borderColor: isLastItem ? "#fff" : "#ccc",
          paddingHorizontal: 16,
        }}
      >
        <Icon1
          name={icon?.name}
          color={icon?.color}
          size={16}
          style={{
            backgroundColor: "#fff",
            position: "absolute",
            left: -9,
          }}
        />

        <Text style={{ fontWeight: "800", marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 12, color: "grey", marginBottom: 4 }}>
          {desc}
        </Text>
      </View>
    </View>
  );
};
