import {ButtonApp} from '@components/Button';
import {ChooseProvince} from '@components/ChooseProvince';
import {Steps} from '@components/Steps';
import {TAppNavigation} from '@navigation/AppNavigator.type';
import {KeyboardAwareScrollView} from '@pietile-native-kit/keyboard-aware-scrollview';
import {useNavigation} from '@react-navigation/native';
import {Chip, Input, Text} from '@rneui/themed';
import {useStore} from '@store/index';
import {formatPrice} from '@utils/price';
import React, {useMemo, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useForm, Controller} from 'react-hook-form';
import {CarTypes} from '@constants/route';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  pickUpId: yup.string().required('Vui lòng chọn điểm đón'),
  dropOffId: yup.string().required('Vui lòng chọn điểm đón'),
  name: yup
    .string()
    .required('Vui lòng nhập họ tên')
    .min(4, 'Họ tên tối thiểu 4 ký tự'),
  phone: yup
    .string()
    .required('Vui lòng nhập số điệnthoaij')
    .min(10, 'Số điện thoại phải chứa 10 ký tự')
    .max(10, 'Số điện thoại phải chứa 10 ký tự'),
});

export const DepartureInformation: React.FC = () => {
  const navigation = useNavigation<TAppNavigation<'DepartureInformation'>>();
  const {
    authentication: {userInfo},
    route: {routeInfo, seatSelected, setUserInformation},
  } = useStore();
  const {
    control,
    formState: {isValid},
    handleSubmit,
    getValues,
  } = useForm({
    defaultValues: {
      pickUpId: '',
      dropOffId: '',
      name: userInfo.fullName,
      phone: userInfo.phone,
    },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const [pickUpId, setPickUpId] = useState('');
  const [dropOffId, setDropOffId] = useState('');

  const handleConfirm = dataForm => {
    setUserInformation(dataForm);
    navigation.navigate('TicketInformation');
  };
  const isSubTrip = routeInfo.subTrip;
  const listLength = routeInfo.listtripStopDTO.length;

  const listPickup = useMemo(() => {
    const indexDropOff = routeInfo.listtripStopDTO.findIndex(
      item => item.id === dropOffId,
    );
    const conditionIndex = indexDropOff >= 0 ? indexDropOff : listLength - 1;
    console.log(indexDropOff);

    return routeInfo.listtripStopDTO.filter(item =>
      isSubTrip ? item.index < conditionIndex : item.type === 'PICKUP',
    );
  }, [dropOffId]);

  const listDropOff = useMemo(() => {
    const indexPickup =
      routeInfo.listtripStopDTO.findIndex(item => item.id === pickUpId) || 0;

    const conditionIndex = indexPickup >= 0 ? indexPickup : 0;

    return routeInfo.listtripStopDTO.filter(item =>
      isSubTrip ? item.index > conditionIndex : item.type === 'DROPOFF',
    );
  }, [pickUpId]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: '#f7f7f7'}}>
        <KeyboardAwareScrollView style={{flex: 1}}>
          <View style={styles.box}>
            <Chip
              title={`${formatPrice(routeInfo.fare)} - ${
                CarTypes[routeInfo.busDTO.type]
              }`}
              containerStyle={{flexDirection: 'row'}}
              buttonStyle={{backgroundColor: '#ccc'}}
              titleStyle={{fontWeight: '700', color: '#000'}}
            />

            <Steps data={routeInfo.listtripStopDTO} />
          </View>
          <View style={[styles.box, {flexDirection: 'row'}]}>
            <View style={{flex: 1}}>
              <Text>Số ghế đã chọn</Text>
              <Text style={styles.value}>{seatSelected.join(', ')}</Text>
            </View>
            <TouchableOpacity onPress={navigation.goBack}>
              <Text style={{color: '#f6a288'}}>Chọn lại</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <Text>Vui lòng chọn điểm đón:</Text>
            <Controller
              control={control}
              name="pickUpId"
              render={({field: {value, onChange}}) => (
                <ChooseProvince
                  title="Chọn điểm đón"
                  placeholder="Điểm đón"
                  data={listPickup}
                  onChange={(value: string) => {
                    onChange(value);
                    setPickUpId(value);
                  }}
                  value={value}
                  renderButton={(title, onPress) => (
                    <TouchableOpacity
                      onPress={onPress}
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 4,
                        padding: 12,
                        marginTop: 16,
                        flexDirection: 'row',
                      }}>
                      <Text style={{flex: 1, color: title ? 'black' : '#ccc'}}>
                        {title ?? 'Điểm đón'}
                      </Text>
                      <Icon name="chevron-down" size={20} />
                    </TouchableOpacity>
                  )}
                />
              )}
            />
          </View>
          <View style={styles.box}>
            <Text>Vui lòng chọn điểm đến:</Text>
            <Controller
              control={control}
              name="dropOffId"
              render={({field: {value, onChange}}) => (
                <ChooseProvince
                  title="Chọn điểm đến"
                  placeholder="Điểm đến"
                  data={listDropOff}
                  onChange={(value: string) => {
                    onChange(value);
                    setDropOffId(value);
                  }}
                  value={value}
                  renderButton={(title, onPress) => (
                    <TouchableOpacity
                      onPress={onPress}
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        borderRadius: 4,
                        padding: 12,
                        marginTop: 16,
                        flexDirection: 'row',
                      }}>
                      <Text style={{flex: 1, color: title ? 'black' : '#ccc'}}>
                        {title ?? 'Điểm đến'}
                      </Text>
                      <Icon name="chevron-down" size={20} />
                    </TouchableOpacity>
                  )}
                />
              )}
            />
          </View>
          <View style={styles.box}>
            <Controller
              control={control}
              name="name"
              render={({field: {value, onChange}}) => (
                <Input
                  label="Thông tin khách"
                  value={value}
                  onChangeText={onChange}
                  inputStyle={{fontSize: 16, fontWeight: '700'}}
                  editable={false}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({field: {value, onChange}}) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  inputStyle={{fontSize: 16}}
                />
              )}
            />
          </View>
          <View style={[styles.box, {flex: 1}]} />
        </KeyboardAwareScrollView>
        <ButtonApp
          title="Continue"
          onPress={handleSubmit(handleConfirm)}
          buttonStyle={{
            backgroundColor: 'red',
            margin: 10,
          }}
          disabled={!isValid}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  box: {padding: 16, backgroundColor: '#fff', marginBottom: 16},
  value: {fontSize: 16, fontWeight: '700', lineHeight: 24},
});
