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

const Tab = createBottomTabNavigator();

const IconsBottomTab = {
  Home: 'home',
  History: 'stopwatch',
  Notification: 'notifications-sharp',
  Profile: 'person-sharp',
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
          tabBarIcon: ({focused}) => tabBarIcon(focused, route),
          tabBarActiveTintColor: Colors.Active,
          tabBarInactiveTintColor: Colors.Inactive,
        };
      }}>
      <Tab.Screen
        name="Home"
        component={isDriver ? HomeDriver : Home}
        options={{title: 'Trang chủ'}}
      />
      <Tab.Screen
        name="History"
        component={isDriver ? HistoryDriver : History}
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
  // } else {
  //   return <HomeDriver />;
  // }
};

const tabBarIcon = (
  focused: boolean,
  route: RouteProp<ParamListBase, string>,
) => {
  return (
    <Icon
      name={IconsBottomTab[route.name]}
      size={22}
      color={focused ? Colors.Active : Colors.Inactive}
    />
  );
};
