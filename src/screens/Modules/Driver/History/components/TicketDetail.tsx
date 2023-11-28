import ReactNativeModal from "react-native-modal";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { formatPrice } from "@utils/price";
import { BookingStatusId } from "@constants/route";
import { Steps } from "@components/Steps";
import dayjs from "dayjs";
import { Button } from "@rneui/themed";
import { Checkin } from "./Checkin";
import {
  putStartTrip,
  getTripDetail,
  putConfirmSuccessTrip,
} from "@httpClient/trip.api";
import { StatusApiCall } from "@constants/global";
import { ListCustomer } from "./ListCustomer";
import { timeStampToUtc } from "@utils/time";

const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

export const TicketDetail = ({
  onClose = () => {},
  show,
  booking = {},
  onReload,
}: {
  onClose: () => void;
  show: boolean;
  booking: Record<string, any> | null;
  onReload: () => void;
}) => {
  const [trip, setTrip] = useState(booking);
  const [loading, setLoading] = useState(false);
  const steps = booking?.listtripStopDTO.map((item) => {
    const customers = booking.listBooking.filter(
      (customer) => customer.dropOffPoint === item.stationDTO.name
    );
    const total = customers.reduce(
      (acc, currentValue) => acc + currentValue.listTicket?.length,
      0
    );
    return {
      time: timeStampToUtc(item.timeComess).format("HH:mm"),
      title: item.stationDTO.name,
      icon: {
        name: item.type === "DROPOFF" ? "location-on" : "location-searching",
        color: "red",
      },
      desc: total > 0 ? `Có ${total} khách hàng xuống trạm` : "",
    };
  });

  const timeStart = dayjs(booking.startTimee * 1000, { utc: true });
  const timeEnd = dayjs(booking.endTimee, { utc: true });
  const now = dayjs().add(7, "hour").utc().format();

  const nowToStart = timeStart.diff(now, "minute");
  const nowToEnd = timeEnd.diff(now, "minute");

  const [showCheckin, setShowCheckin] = useState(false);
  const [showListCustomer, setShowListCustomer] = useState(false);

  useEffect(() => {
    getTrip();
  }, []);

  const getTrip = async () => {
    try {
      const { data } = await getTripDetail(booking.idTrip);
      if (data.status === StatusApiCall.Success) {
        console.log("done", data.data);

        setTrip(data.data);
      }
    } catch {
    } finally {
      return Promise.resolve();
    }
  };

  const handleReady = async () => {
    try {
      setLoading(true);
      const { data } = await putStartTrip(booking.idTrip);
      if (data.status === StatusApiCall.Success) {
        onReload();
        await getTrip();
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessTrip = async () => {
    try {
      setLoading(true);
      const { data } = await putConfirmSuccessTrip(booking.idTrip);
      if (data.status === StatusApiCall.Success) {
        onReload();
        await getTrip();
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReactNativeModal
      isVisible={show}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 24,
        maxHeight: "80%",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 4,
            position: "absolute",
            right: 0,
            top: 0,
            zIndex: 10,
          }}
        >
          <Icon name="close-circle" size={24} color={"#ccc"} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "800", textAlign: "center" }}>
          Thông tin chuyến đi
        </Text>

        <ScrollView style={{ flex: 1 }}>
          <View style={{ marginVertical: 16 }}>
            <InfoItem
              label="Chuyến xe"
              value={
                trip.routeDTO.departurePoint + " - " + trip.routeDTO.destination
              }
            />
            <InfoItem
              label="Số xe"
              value={trip.busDTO.licensePlates + " - " + trip.busDTO.name}
            />
            <InfoItem
              label="Số lượng khách"
              value={`${trip.bookedSeat}/${trip.busDTO.capacity}`}
            />
            <InfoItem
              label="Tổng tiền"
              value={formatPrice(
                trip.seatNameBooking?.length * trip.routeDTO.baseFare
              )}
            />
            <Text style={{ flex: 1 }}>{"Danh sách trạm"}</Text>
            <View style={{ marginBottom: 4 }}>
              <Steps data={steps} />
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{ paddingVertical: 8, marginBottom: 4 }}
          onPress={() => setShowListCustomer(true)}
        >
          <Text style={{ color: "blue", fontStyle: "italic" }}>
            Danh sách khách hàng
          </Text>
        </TouchableOpacity>
        {trip.status === BookingStatusId.Ready &&
          (nowToStart <= 30 ? (
            <Button
              title={"Xuất phát"}
              onPress={handleReady}
              loading={loading}
            />
          ) : (
            <Text>
              Còn {Math.floor(nowToStart / (24 * 60))} ngày{" "}
              {Math.floor((nowToStart % (24 * 60)) / 60)} giờ{" "}
              {(nowToStart % (24 * 60)) % 60} phút
            </Text>
          ))}
        {trip.status === BookingStatusId.Run && (
          <Button
            title={"Checkin"}
            onPress={() => setShowCheckin(true)}
            loading={loading}
          />
        )}
        {trip.status === BookingStatusId.Run && nowToEnd <= 30 && (
          <Button
            title={"Hoàn thành chuyến"}
            onPress={handleSuccessTrip}
            buttonStyle={{ marginTop: 12, backgroundColor: "orange" }}
            loading={loading}
          />
        )}

        <Checkin
          show={showCheckin}
          onClose={() => setShowCheckin(false)}
          idTrip={trip.idTrip}
          onCheckinSuccess={getTrip}
        />
        <ListCustomer
          show={showListCustomer}
          onClose={() => setShowListCustomer(false)}
          totalSeats={trip.busDTO.capacity}
          listCustomer={trip.listBooking}
          listSeat={trip.seatNameBooking}
        />
      </SafeAreaView>
    </ReactNativeModal>
  );
};

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 4 }}>
      <Text style={{ flex: 1 }}>{label}</Text>
      <Text style={{ flex: 2, fontWeight: "600" }}>{value}</Text>
    </View>
  );
};
