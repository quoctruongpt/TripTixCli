import React, { useEffect, useState } from "react";
import ReactNativeModal from "react-native-modal";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Table, Row, Rows } from "react-native-table-component";
import { BookingStatusId } from "@constants/route";

export const ListCustomer: React.FC<{
  show: boolean;
  onClose: () => void;
  totalSeats: number;
  listCustomer: Record<string, any>[];
  listSeat: Record<string, any>[];
}> = ({ show, onClose, totalSeats, listCustomer, listSeat }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const l = listSeat.map((seat) => {
      const seatName = seat.seatName;
      const customer = listCustomer.find((item) => {
        return item.idBooking === seat.idBooking;
      });

      return [
        seatName,
        customer?.userSystemDTO.fullName,
        customer?.userSystemDTO.phone,
        customer
          ? customer.bookingStatus === BookingStatusId.Checkin
            ? true
            : false
          : null,
      ];
    });

    setList(l);
  }, [listCustomer]);

  return (
    <ReactNativeModal isVisible={show} style={{ margin: 0 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1, padding: 16 }}>
          <TouchableOpacity
            onPress={onClose}
            style={{
              padding: 4,
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 10,
            }}
          >
            <Icon name="close-circle" size={24} color={"#ccc"} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "900",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            Danh sách khách hàng
          </Text>
          <Table
            borderStyle={{
              borderWidth: 2,
              borderColor: "#c8e1ff",
            }}
          >
            <Row
              data={["Ghế", "Khách hàng", "SDT", "Checkin"]}
              flexArr={[1, 3, 3, 2]}
              style={{ height: 40, backgroundColor: "#f1f8ff" }}
              textStyle={{ textAlign: "center" }}
            />
          </Table>
          <ScrollView style={{ flex: 1 }}>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
              {list.map((item, index) => (
                <Row
                  key={index}
                  data={item.map((value, i) => {
                    if (i !== 3) {
                      return value;
                    }

                    if (value === null) {
                      return "";
                    }

                    return value ? "v" : "x";
                  })}
                  flexArr={[1, 3, 3, 2]}
                  textStyle={{ textAlign: "center", paddingVertical: 4 }}
                  style={{
                    backgroundColor:
                      item[3] === null
                        ? "#fff"
                        : item[3]
                        ? "#baf084"
                        : "#f0a484",
                  }}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </SafeAreaView>
    </ReactNativeModal>
  );
};
