import {ButtonBack} from '@components/ButtonBack';
import {TAppNavigation} from '@navigation/AppNavigator.type';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dialog, Divider, Text, Chip} from '@rneui/themed';
import {useStore} from '@store/index';
import {formatPrice} from '@utils/price';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  ScrollView,
  Alert,
} from 'react-native';
import {StatusApiCall} from '@constants/global';
import {useToast} from 'react-native-toast-notifications';
import {timeStampToUtc} from '@utils/time';
import {Steps} from '@components/Steps';
import {PopupError} from './components/PopupError';
import {TAppRoute} from 'navigation/AppNavigator.type';
import {postBookTicket} from '@httpClient/trip.api';

export const TicketInformation: React.FC = () => {
  const navigation = useNavigation<TAppNavigation<'TicketInformation'>>();
  const toast = useToast();
  const {
    route: {routeInfo, userInformation, seatSelected},
    authentication: {userInfo, synchUserInfo},
  } = useStore();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {fromId, toId} =
    useRoute<TAppRoute<'TicketInformation'>>().params || {};
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <ButtonBack onPress={() => setConfirmCancel(true)} />,
    });
  }, []);

  const pickup = routeInfo.listtripStopDTO.find(
    item => String(item.id) === String(userInformation.pickUpId),
  );
  const dropOff = routeInfo.listtripStopDTO.find(
    item => String(item.id) === String(userInformation.dropOffId),
  );

  const listOfPassingStations = routeInfo.listtripStopDTO.filter(item => {
    return item.index >= pickup.index && item.index <= dropOff.index;
  });

  const totalPrice =
    listOfPassingStations.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.costsIncurred;
    }, 0) * seatSelected.length;

  const handlePayment = async () => {
    try {
      setLoading(true);
      const params = {
        idTrip: routeInfo.idTrip,
        idCustomer: userInfo.idUserSystem,
        codePickUpPoint: pickup.id,
        codeDropOffPoint: dropOff.id,
        seatName: seatSelected,
      };
      const {data} = await postBookTicket(params);

      if (data.status === StatusApiCall.Success) {
        synchUserInfo();
        Alert.alert(
          'Thành công',
          'Quý khách đã đặt vé thành công. Cảm ơn đã sử dụng dịch vụ đặt vé xe của TripTix',
          [
            {
              text: 'Về trang chủ',
              onPress: () =>
                navigation.reset({routes: [{name: 'BottomTabNavigator'}]}),
            },
          ],
          {cancelable: false},
        );
        return;
      }

      throw new Error(data.data);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePressPayment = () => {
    Alert.alert(
      'Thanh toán',
      `Quý khách vui lòng kiểm tra kĩ thông tin đặt vé. Ấn "Xác nhận" để tiến hành thanh toán`,
      [
        {
          text: 'Huỷ',
        },
        {
          text: 'Xác nhận',
          onPress: handlePayment,
        },
      ],
    );
  };

  const handleBack = () => {
    navigation.navigate('SelectRoute', {fromId, toId});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#ccc'}}>
      <ScrollView style={{flex: 1}}>
        <Box
          title="Thông tin người đặt vé"
          data={[
            {label: 'Họ tên', value: userInformation.name},
            {label: 'Số điện thoại', value: userInformation.phone},
            {label: 'Email', value: userInfo.email},
          ]}
        />
        <Box
          title="Thông tin chuyến xe"
          data={[
            {
              label: 'Tuyến',
              value: `${routeInfo.routeDTO.departurePoint} - ${routeInfo.routeDTO.destination}`,
            },
            {
              label: 'Nhà xe',
              value: `${routeInfo.busDTO.name}`,
            },
            {
              label: 'Thời gian',
              value: timeStampToUtc(routeInfo?.startTimee).format(
                'HH:mm - DD/MM/YYYY',
              ),
            },
            {label: 'Số vé', value: seatSelected.length},
            {label: 'Số ghế', value: seatSelected.join(' ,')},
            {label: 'Điểm đón', value: pickup?.title},
            {label: 'Điểm trả', value: dropOff?.title},
          ]}
        />
        <View style={{flex: 1, backgroundColor: '#fff', padding: 16}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '800',
              marginBottom: 20,
            }}>
            Thông tin thanh toán
          </Text>
          <View
            style={{
              padding: 16,
              backgroundColor: '#f9f9f9',
              borderRadius: 12,
            }}>
            <Item label="Giá" value={formatPrice(totalPrice)} />
            <Item label="Khuyễn mại" value="0đ" />
            <Divider style={{marginVertical: 12}} />
            <Item
              label="Thành tiền"
              value={formatPrice(totalPrice)}
              styleValue={{fontSize: 16, fontWeight: '700'}}
            />
          </View>
        </View>

        <Dialog
          isVisible={confirmCancel}
          onBackdropPress={() => setConfirmCancel(false)}>
          <Dialog.Title title="TripTix" />
          <Text>Bạn có muốn huỷ đặt vé không?</Text>
          <Dialog.Actions>
            <Dialog.Button
              title="Huỷ"
              onPress={() => setConfirmCancel(false)}
            />
            <Dialog.Button title="OK" onPress={navigation.goBack} />
          </Dialog.Actions>
        </Dialog>
      </ScrollView>
      <Chip
        title="Thanh toán"
        disabled={loading}
        onPress={handlePressPayment}
        buttonStyle={{
          backgroundColor: 'red',
          margin: 10,
        }}
      />

      <PopupError
        show={!!errorMessage}
        message={errorMessage}
        onBack={handleBack}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

const Item = ({
  label,
  value,
  styleValue,
}: {
  label: string;
  value: string;
  styleValue?: StyleProp<TextStyle>;
}) => {
  return (
    <View style={styles.item}>
      <Text style={{color: '#8b96a0'}}>{label}</Text>
      <Text style={styleValue ?? {fontWeight: '600'}}>{value}</Text>
    </View>
  );
};

const Box = ({
  title,
  data = [],
}: {
  title: string;
  data: {label: string; value: string; styleValue?: StyleProp<TextStyle>}[];
}) => {
  return (
    <View style={styles.box}>
      <Text style={{fontSize: 16, fontWeight: '800', marginBottom: 20}}>
        {title}
      </Text>
      {data.map((item, index) => (
        <Item
          key={index}
          label={item.label}
          value={item.value}
          styleValue={item.styleValue}
        />
      ))}
    </View>
  );
};
