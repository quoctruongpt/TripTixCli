import React from 'react';
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

  // if (userInfo.role == "ROLE_CUSTOMER") {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused}) => tabBarIcon(focused, route),
        tabBarActiveTintColor: Colors.Active,
        tabBarInactiveTintColor: Colors.Inactive,
      })}>
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
        options={{title: 'Thông báo'}}
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
