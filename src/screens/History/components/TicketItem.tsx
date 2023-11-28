import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFA from 'react-native-vector-icons/MaterialIcons';
import {Text} from '@rneui/base';
import {
  BookingStatusId,
  BookingStatusLabel,
  CanCancelStatus,
} from '@constants/route';
import {ActivityIndicator} from 'react-native';
import {getColorStatus, getStatusLabel} from './TichketHistory';
import {useStore} from '@store/index';
import {EAccountType} from '@enums';
import {timeStampToUtc} from '@utils/time';

export const TicketItem: React.FC<{
  ticket: any;
  onPressInfo: (ticket: any) => void;
  onPressCancel?: (ticket: any) => void;
  onPressFeedback?: (ticket: any) => void;
  canceling?: string;
  timeStart: number;
  departurePoint: string;
  destination: string;
  status: string;
}> = ({
  ticket,
  onPressCancel,
  onPressFeedback,
  onPressInfo,
  canceling,
  timeStart,
  departurePoint,
  destination,
  status,
}) => {
  const getBackground = (status: string) => {
    switch (status) {
      case BookingStatusId.Cancel:
        return '#f5bfce';
      case BookingStatusId.Paid:
      case BookingStatusId.Ready:
      case BookingStatusId.NoCheckin:
      case BookingStatusId.Checkin:
        return '#f5e8bf';
      case BookingStatusId.Finish:
        return '#bff5d5';
      case BookingStatusId.Run:
        return '#d2e6ef';
      default:
        return '#fff';
    }
  };
  const {
    authentication: {userInfo},
  } = useStore();

  const isDriver = userInfo.role === EAccountType.Driver;

  return (
    <View style={[styles.ticket, {backgroundColor: getBackground(status)}]}>
      <View style={styles.ticketHeader}>
        <Text style={{color: 'gray', fontSize: 16}}>Giờ xuất bến</Text>
        <Text style={{color: 'orange', fontSize: 30}}>
          {timeStampToUtc(timeStart).format('HH:mm')}
        </Text>
        <Text style={{fontSize: 18, color: 'gray'}}>
          {timeStampToUtc(timeStart).format('DD-MM-YYYY')}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: getColorStatus(status),
            marginTop: 10,
            fontWeight: '800',
            textAlign: 'center',
          }}>
          {BookingStatusLabel[status]}
        </Text>
      </View>
      <View style={styles.ticketContent}>
        {!!ticket.bookingCode && (
          <InfoItem label="Mã đặt vé" value={ticket.bookingCode} />
        )}
        {!!ticket.busDTO?.idBus && (
          <InfoItem
            label="Xe"
            value={`${ticket.busDTO.name} | ${ticket.busDTO.licensePlates}`}
          />
        )}
        <InfoItem
          icon={{name: 'my-location', color: 'green'}}
          value={departurePoint}
        />
        <InfoItem
          icon={{name: 'location-on', color: 'orange'}}
          value={destination}
        />
        {!!ticket.listTicket?.length && (
          <InfoItem label="Tổng số vé" value={ticket.listTicket?.length} />
        )}
        {userInfo.role === EAccountType.Driver && (
          <InfoItem label="Tổng số khách" value={ticket.bookedSeat} />
        )}
      </View>
      <View>
        <TouchableOpacity
          style={{marginBottom: 16}}
          onPress={() => onPressInfo(ticket)}>
          <Icon name="information-outline" size={24} color={'orange'} />
        </TouchableOpacity>
        {status === BookingStatusId.Finish && !isDriver && (
          <TouchableOpacity
            style={{marginBottom: 16}}
            onPress={() => onPressFeedback(ticket)}>
            <Icon name="file-certificate-outline" size={24} color={'orange'} />
          </TouchableOpacity>
        )}
        {CanCancelStatus.includes(status) && !isDriver && (
          <TouchableOpacity onPress={() => onPressCancel(ticket)}>
            {canceling !== ticket.bookingCode && (
              <Icon name="book-cancel-outline" size={24} color={'red'} />
            )}
            {canceling === ticket.bookingCode && (
              <ActivityIndicator size={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label?: string;
  value: string | number;
  icon?: {name: string; color: string};
}) => {
  return (
    <View
      style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
      {!!label && <Text style={{color: 'gray'}}>{label}: </Text>}
      {!!icon && (
        <IconFA
          name={icon.name}
          color={icon.color}
          size={20}
          style={{marginRight: 6}}
        />
      )}
      <Text style={styles.ticketValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ticket: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 24,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '100%',
  },
  ticketHeader: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginBottom: 15,
    borderRightWidth: 1,
    borderStyle: 'dotted',
    paddingRight: 10,
    alignItems: 'center',
    flex: 1,
  },
  ticketContent: {
    marginBottom: 10,
    flex: 2,
    paddingLeft: 12,
  },
  ticketLabel: {
    fontWeight: '400',
    marginBottom: 5,
    color: 'gray',
  },
  ticketValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketValueTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'orange',
  },
});
