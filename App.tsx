import RootNavigation from '@navigation';
// import {Provider} from '@store';
import {rootStore} from '@store/store';
import {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {getProvinces} from '@httpClient/global.api';
import {storage} from '@storage/index';
import {Keys} from '@constants/storage';
import {ToastProvider} from 'react-native-toast-notifications';
import {Provider, useStore} from '@store/index';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {StorageKeys} from '@constants/global';

export default function App() {
  useEffect(() => {
    getListProvince();
    getTokenFCM();
  }, []);

  const getListProvince = async () => {
    try {
      const {data} = await getProvinces();
      storage.setItem(Keys.Provinces, JSON.stringify(data.data));
    } catch (e) {
      console.error(e);
    }
  };

  const getTokenFCM = async () => {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const fcmToken = await messaging().getToken();
      storage.setItem(StorageKeys.notificationToken, fcmToken);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <Provider value={rootStore}>
      <ToastProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </ToastProvider>
    </Provider>
  );
}
