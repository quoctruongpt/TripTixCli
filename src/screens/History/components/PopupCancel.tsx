import React, {useContext} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import {useMemo} from 'react';
import dayjs from 'dayjs';
import {formatPrice} from '@utils/price';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Image} from 'react-native';
import {useStore} from '@store';
import {ConfigContext} from '@navigation';
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export const PopupCancel = ({ticket, onClose = () => {}, onConfirm, show}) => {
  // const {configs} = useContext(ConfigContext);
  const {percentRefundOver1Hour, percentRefundUnder1Hour, timeRefund} = {
    percentRefundOver1Hour: 0.95,
    percentRefundUnder1Hour: 0.85,
    timeRefund: 24,
  };

  const diff = useMemo(() => {
    const now = dayjs().add(7, 'hour').utc().format();
    const timeStart = dayjs(ticket?.tripDTO?.startTimee * 1000, {utc: true});
    const diff = timeStart.diff(now, 'day');
    console.log(now, ticket?.tripDTO?.startTimee, diff);

    return diff;
  }, [ticket]);

  return (
    <ReactNativeModal isVisible={show}>
      <View style={{backgroundColor: '#fff', borderRadius: 20}}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            padding: 4,
            position: 'absolute',
            right: 10,
            top: 10,
            zIndex: 10,
          }}>
          <Icon name="close-circle" size={24} color={'#ccc'} />
        </TouchableOpacity>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 18, fontWeight: '800', textAlign: 'center'}}>
            Huỷ chuyến
          </Text>
          <View style={{alignItems: 'center'}}>
            <Image
              source={require('@assets/images/cancel.png')}
              style={{
                width: 100,
                height: 100,
                transform: [{scale: 2}],
              }}
            />
          </View>
          <Text style={{textAlign: 'center', marginBottom: 16, marginTop: 24}}>
            Bạn đang yêu cầu huỷ chuyến đi từ{' '}
            <Text style={{fontWeight: '600'}}>{ticket.pickUpPoint}</Text> đến{' '}
            <Text style={{fontWeight: '600'}}>{ticket.dropOffPoint}</Text>
          </Text>
          <Text style={{textAlign: 'center', marginBottom: 16}}>
            Thời gian tới khi chuyến xe khởi hành:{' '}
            <Text style={{fontWeight: '600'}}>{diff}</Text> giờ
          </Text>
          <Text style={{textAlign: 'center', marginBottom: 16}}>
            Số tiền sẽ được hoàn trả:{' '}
            <Text style={{fontWeight: '600'}}>
              {formatPrice(
                diff < timeRefund
                  ? ticket.totalPrice * percentRefundUnder1Hour
                  : ticket.totalPrice * percentRefundOver1Hour,
              )}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: '#ccc',
          }}>
          <TouchableOpacity
            onPress={onConfirm}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 4,
              flex: 1,
              alignItems: 'center',
              borderRightWidth: 1,
              borderRightColor: '#ccc',
            }}>
            <Text>Tôi chắc chắn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={{
              paddingVertical: 16,
              paddingHorizontal: 4,
              flex: 1,
              alignItems: 'center',
              borderLeftWidth: 1,
              borderLeftColor: '#ccc',
            }}>
            <Text style={{fontWeight: '600'}}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReactNativeModal>
  );
};
