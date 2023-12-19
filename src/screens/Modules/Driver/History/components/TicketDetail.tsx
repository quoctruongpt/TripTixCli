import ReactNativeModal from 'react-native-modal';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, Text, View, SafeAreaView} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {formatPrice} from '@utils/price';
import {BookingStatusId} from '@constants/route';
import {Steps2} from '@components/Steps2';
import dayjs from 'dayjs';
import {Button} from '@rneui/themed';
import {Checkin} from './Checkin';
import {
  putStartTrip,
  getTripDetail,
  putConfirmSuccessTrip,
} from '@httpClient/trip.api';
import {StatusApiCall} from '@constants/global';
import {ListCustomer} from './ListCustomer';
import {timeStampToUtc} from '@utils/time';
import {useStore} from '@store';
import {ConfigContext} from '@navigation';

const utc = require('dayjs/plugin/utc');
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
  const [isModeTest, setIsModeTest] = useState(false);
  let sum = 0;
  let sum2 = 0;

 
  const steps = booking?.listtripStopDTO.map((item) => {
    const customers = booking?.listBooking.filter(
      customer => {
        console.log(12345,customer.dropOffPoint === item.stationDTO.name)
        return customer.dropOffPoint === item.stationDTO.name  
      }
    );
    const customers2 = booking?.listBooking.filter(
      customer2 => {
        console.log(12345,customer2.pickUpPoint === item.stationDTO.name)
        return customer2.pickUpPoint === item.stationDTO.name  
      }
    );
      const getCusTomers =  customers.map((item) =>{
        // console.log("item",item);  
        return item.userSystemDTO.fullName
          
      })
      const getCusTomers2 =  customers2.map((item) =>{
        // console.log("item",item);  
        return item.userSystemDTO.fullName
      })

      const numberOfticket =  customers.map((item) =>{
        console.log("item",item);  
        return item.numberOfTickets
      })
      for (let i = 0; i < numberOfticket.length; i++ ) {
        sum += numberOfticket[i];
      }

    
      const numberOfticket2 =  customers2.map((item) =>{
        sum2=0
        console.log("item2",item.numberOfTickets);  
        return item.numberOfTickets
      })    
      console.log("numberOfticket2",numberOfticket2);
      for (let j = 0; j < numberOfticket2.length; j++ ) {
        
        sum2 += numberOfticket2[j];
      }
      console.log("customers2",customers2);
      console.log("sum2",sum2)

      console.log("sum",sum)

      // console.log("abcd",customers)
      
      // console.log("abc",customers)
      // console.log("danh sách cus:",getCusTomers);

      return {
        time: timeStampToUtc(item.timeComess).format('HH:mm'),
        title: item.stationDTO.name,
        icon: {
          name: item.type === 'DROPOFF' ? 'location-on' : 'location-searching',
          color: 'red',
        },
        customers: getCusTomers,
        customers2: customers2,
        numberOfticket :numberOfticket,
        getCusTomers: getCusTomers,
        getCusTomers2: getCusTomers2,
        desc:
        customers.length > 0
            ? `Có ${sum} khách hàng xuống trạm`
            : 'Không có khách hàng nào xuống trạm này',
        desc2:
        customers2.length > 0
            ? `Có ${sum2} khách hàng lên trạm`
            : 'Không có khách hàng nào lên trạm này',
      };

  });

  const timeStart = dayjs(booking.startTimee * 1000, {utc: true});
  const timeEnd = dayjs(booking.endTimee * 1000, {utc: true});
  const now = dayjs().add(7, 'hour').utc().format();

  const nowToStart = timeStart.diff(now, 'minute');
  const nowToEnd = timeEnd.diff(now, 'minute');

  const [showCheckin, setShowCheckin] = useState(false);
  const [showListCustomer, setShowListCustomer] = useState(false);

  useEffect(() => {
    getTrip();
  }, []);
  console.log(trip);

  const getTrip = async () => {
    try {
      const {data} = await getTripDetail(booking.idTrip);
      if (data.status === StatusApiCall.Success) {
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
      const {data} = await putStartTrip(booking.idTrip);
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
      const {data} = await putConfirmSuccessTrip(booking.idTrip);
      if (data.status === StatusApiCall.Success) {
        onReload();
        await getTrip();
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const showButtonSuccess =
    trip.status === BookingStatusId.Run && (nowToEnd <= 30 || isModeTest);

  const showButtonStart =
    trip.status === BookingStatusId.Ready && (nowToStart <= 30 || isModeTest);

  return (
    <ReactNativeModal
      isVisible={show}
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
      }}>
      <SafeAreaView style={{flex: 1}}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 4,
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 10,
          }}>
          <Icon name="close-circle" size={24} color={'#ccc'} />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: '800', textAlign: 'center'}}>
          Thông tin chuyến đi
        </Text>

        <ScrollView style={{flex: 1}}>
          <View style={{marginVertical: 16}}>
            <InfoItem
              label="Chuyến xe"
              value={
                trip.routeDTO.departurePoint + ' - ' + trip.routeDTO.destination
              }
            />
            <InfoItem
              label="Số xe"
              value={trip.busDTO.licensePlates + ' - ' + trip.busDTO.name}
            />
            <InfoItem
              label="Số lượng khách"
              value={`${trip.bookedSeat}/${trip.busDTO.capacity}`}
            />
            <InfoItem
              label="Tổng tiền"
              value={formatPrice(
                trip.seatNameBooking?.length * trip.routeDTO.baseFare,
              )}
            />
            <Text style={{flex: 1}}>{'Danh sách trạm'}</Text>
            <View style={{marginBottom: 4}}>
              <Steps2 data={steps} />
            </View>
          </View>
        </ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{paddingVertical: 8, marginBottom: 4}}
            onPress={() => setShowListCustomer(true)}>
            <Text style={{color: 'blue', fontStyle: 'italic'}}>
              Danh sách khách hàng
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 20,
              marginBottom: 4,
              backgroundColor: isModeTest ? 'red' : 'green',
              borderRadius: 8,
            }}
            onPress={() => setIsModeTest(!isModeTest)}></TouchableOpacity>
        </View>
        {showButtonStart ? (
          <Button title={'Xuất phát'} onPress={handleReady} loading={loading} />
        ) : (
          <Text>
            {trip.status === BookingStatusId.Ready
              ? `Còn ${Math.floor(nowToStart / (24 * 60))} ngày ${Math.floor(
                  (nowToStart % (24 * 60)) / 60,
                )} giờ ${
                  (nowToStart % (24 * 60)) % 60
                } phút có thể bắt đầu chuyến đi`
              : ''}
          </Text>
        )}
        {trip.status === BookingStatusId.Run && (
          <Button
            title={'Checkin'}
            onPress={() => setShowCheckin(true)}
            loading={loading}
          />
        )}
        {showButtonSuccess && (
          <Button
            title={'Hoàn thành chuyến'}
            onPress={handleSuccessTrip}
            buttonStyle={{marginTop: 12, backgroundColor: 'orange'}}
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

const InfoItem = ({label, value}: {label: string; value: string | number}) => {
  return (
    <View style={{flexDirection: 'row', marginBottom: 4}}>
      <Text style={{flex: 1}}>{label}</Text>
      <Text style={{flex: 2, fontWeight: '600'}}>{value}</Text>
    </View>
  );
};
