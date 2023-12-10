import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, FlatList, RefreshControl} from 'react-native';
import {InfoItem} from '@screens/History/components/TicketItem';
import {getHistoryTripDriver} from '@httpClient/trip.api';
import {useStore} from '@store';
import {BookingStatusId} from '@constants/route';
import {StatusApiCall} from '@constants/global';
import dayjs from 'dayjs';
import {BookingStatusLabel} from '@constants/route';

type TScreenProps = {type: string};

type TConfig = {
  page?: number;
  totalPage?: number;
  pageSize?: number;
  time?: number | null;
  status?: string | null;
};

export const Screen: React.FC<TScreenProps> = ({type}) => {
  const {
    authentication: {userInfo},
  } = useStore();
  const [configs, setConfigs] = useState<TConfig>({
    page: 1,
    totalPage: 1,
    pageSize: 10,
    time: null,
    status: null,
  });
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const dataShow = useMemo(() => {
    return groupByDay(data);
  }, [data]);

  useEffect(() => {
    getData();
  }, [configs.page]);

  const changeConfig = (value: TConfig) => {
    setConfigs(oldValue => ({...oldValue, ...value}));
  };

  const getData = async () => {
    try {
      setLoading(true);
      const {data} = await getHistoryTripDriver(
        userInfo.idUserSystem,
        BookingStatusId.Finish,
        configs.page,
        configs.pageSize,
      );

      if (data.status === StatusApiCall.Success) {
        changeConfig({totalPage: data.totalPage});

        const list = data.data.map(item => ({
          ...item,
          day: dayjs.unix(item.startTimee).format('DD/MM/YYYY'),
        }));

        setData(pre => [...pre, ...list]);
      }
    } catch {
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  };

  function groupByDay(arr: any[]) {
    const object = arr.reduce((acc, obj) => {
      const key = obj.day;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);

      return acc;
    }, {});

    const data = Object.keys(object).map(item => ({
      day: item,
      data: object[item],
    }));

    return data;
  }

  const handleEndReached = () => {
    // Khi người dùng vuốt đến cuối cùng, tăng trang lên 1
    if (!loading && !refresh && configs.page < configs.totalPage) {
      changeConfig({page: (configs.page ?? 0) + 1});
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    changeConfig({page: 1});
    setData([]);

    setTimeout(() => {
      getData();
    }, 500);
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={{marginBottom: 24}}>
        <Text style={{fontWeight: '800', marginLeft: 16, marginBottom: 8}}>
          {item.day}
        </Text>
        <View style={{backgroundColor: '#fff'}}>
          {item.data?.map((item, index) => (
            <View
              key={index}
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                padding: 16,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  borderRightWidth: 1,
                  borderStyle: 'dotted',
                  alignItems: 'center',
                }}>
                <Text>Giờ xuất bến</Text>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: 'red'}}>
                  {dayjs.unix(item.startTimee).format('HH:mm')}
                </Text>
                <Text style={{fontSize: 16, fontWeight: '700', marginTop: 8}}>
                  {BookingStatusLabel[item.status]}
                </Text>
              </View>
              <View style={{flex: 2, paddingLeft: 8}}>
                <InfoItem label="Xe" value={item.busDTO.name} />
                <InfoItem
                  icon={{name: 'my-location', color: 'green'}}
                  value={item.routeDTO.departurePoint}
                />
                <InfoItem
                  icon={{name: 'location-on', color: 'orange'}}
                  value={item.routeDTO.destination}
                />
                <InfoItem
                  label="Tổng số khách"
                  value={`${item.listBooking.length}/${item.busDTO.capacity}`}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, paddingTop: 16}}>
      <FlatList
        data={dataShow}
        keyExtractor={item => item.day}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
      />
      {loading && (
        <View
          style={{position: 'absolute', bottom: 0, backgroundColor: '#ccc'}}>
          <Text>Đang tải thêm...</Text>
        </View>
      )}
    </View>
  );
};
