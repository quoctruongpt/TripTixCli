import React, {useEffect, useState, useCallback} from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {useStore} from '@store/index';
import {observer} from 'mobx-react-lite';
import {storage} from '@storage/index';
import {StorageKeys} from '@constants/global';
// import * as SplashScreen from 'expo-splash-screen';

// SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const {
    authentication: {isLogin, setIsLogin, setUserInfo, synchUserInfo},
  } = useStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const [token, userInfo] = await storage.multiGet([
        StorageKeys.Token,
        StorageKeys.userInfo,
      ]);

      const newInfo = await synchUserInfo();

      setIsLogin(!!token[1]);

      setUserInfo(newInfo ?? JSON.parse(userInfo[1] ?? '{}'));
    } finally {
      setIsReady(true);
      // await SplashScreen.hideAsync();
    }
  };

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      // await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {isLogin ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
}

export default observer(RootNavigation);
