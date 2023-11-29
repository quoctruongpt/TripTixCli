import React, {useEffect, useState, useCallback, createContext} from 'react';
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
export const ConfigContext = createContext(null);

function RootNavigation() {
  const {
    authentication: {isLogin, setIsLogin, setUserInfo, synchUserInfo},
    config: {setConfig},
  } = useStore();
  const [isReady, setIsReady] = useState(false);
  const [configs, setConfigs] = useState({
    maxSeat: 5,
    hourCanNotCancel: 1,
    percentRefundOver1Hour: 0.95,
    percentRefundUnder1Hour: 0.85,
    timeRefund: 24,
    isModeTest: true,
  });

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const [token, userInfo, configsJson] = await storage.multiGet([
        StorageKeys.Token,
        StorageKeys.userInfo,
        StorageKeys.Config,
      ]);

      const newInfo = await synchUserInfo();

      setIsLogin(!!token[1]);

      setUserInfo(newInfo ?? JSON.parse(userInfo[1] ?? '{}'));
      if (configsJson[1]) {
        const config = JSON.parse(configsJson[1] ?? '{}');
        setConfig(config);
        setConfigs({
          ...config,
          percentRefundOver1Hour: config.percentRefundOver1Hour / 100,
          percentRefundUnder1Hour: config.percentRefundUnder1Hour / 100,
        });
      }
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
    <ConfigContext.Provider value={{configs}}>
      <View style={{flex: 1}} onLayout={onLayoutRootView}>
        <NavigationContainer>
          {isLogin ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </View>
    </ConfigContext.Provider>
  );
}

export default observer(RootNavigation);
