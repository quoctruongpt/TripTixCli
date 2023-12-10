import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home} from '@screens/Home';
import {History} from '@screens/History';
import {Notification} from '@screens/Notification';
import {Profile} from '@screens/Profile';
import {RouteProp, ParamListBase} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useStore} from '@store/index';
import {HomeDriver} from '@screens/Modules/Driver/Home';
import {EAccountType} from '@enums';
import {HistoryDriver} from '@screens/Modules/Driver/History';
import {StatusApiCall} from '@constants/global';
import {getNotification} from '@httpClient/notification.api';
import {ListTrip} from '@screens/Modules/Driver/ListTrip';

const Tab = createBottomTabNavigator();

const IconsBottomTab = {
  Home: {customer: 'home', driver: 'list-circle-sharp'},
  History: {customer: 'stopwatch', driver: 'stopwatch'},
  Notification: {
    customer: 'notifications-sharp',
    driver: 'notifications-sharp',
  },
  Profile: {customer: 'person-sharp', driver: 'person-sharp'},
};

const Colors = {
  Active: '#f2754f',
  Inactive: '#637280',
};

export const BottomTabNavigator: React.FC = () => {
  const {
    authentication: {userInfo},
  } = useStore();
  const isDriver = userInfo.role === EAccountType.Driver;
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getUnreadNotification();
  }, []);

  const getUnreadNotification = async () => {
    try {
      const {data} = await getNotification(userInfo.idUserSystem);
      if (data.status === StatusApiCall.Success) {
        setUnreadCount(data.data.filter((item: any) => !item.seen).length);
      }
    } catch {}
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          headerShown: false,
          tabBarIcon: ({focused}) => tabBarIcon(focused, route, isDriver),
          tabBarActiveTintColor: Colors.Active,
          tabBarInactiveTintColor: Colors.Inactive,
        };
      }}>
      <Tab.Screen
        name="Home"
        component={isDriver ? HistoryDriver : Home}
        options={{title: isDriver ? 'Lịch trình' : 'Trang chủ'}}
      />
      <Tab.Screen
        name="History"
        component={isDriver ? ListTrip : History}
        options={{title: 'Lịch sử'}}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Thông báo',
          headerTitle: 'Thông báo',
          headerShown: true,
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{title: 'Tài khoản'}}
      />
    </Tab.Navigator>
  );
};

const tabBarIcon = (
  focused: boolean,
  route: RouteProp<ParamListBase, string>,
  isDriver: boolean,
) => {
  return (
    <Icon
      name={
        isDriver
          ? IconsBottomTab[route.name].driver
          : IconsBottomTab[route.name].customer
      }
      size={22}
      color={focused ? Colors.Active : Colors.Inactive}
    />
  );
};
