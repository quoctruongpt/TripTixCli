import {StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from 'react-native';
import {Button, Text} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';

import {Images} from '@assets/images';
import {TAuthNavigation} from '@navigation/AuthNavigator.type';

export const Welcome = () => {
  const navigation = useNavigation<TAuthNavigation<'Welcome'>>();

  const handlePressStart = () => {
    navigation.replace('SignIn');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text h4 h4Style={styles.text}>
        Chào mừng bạn đến TripTix
      </Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            borderRadius: 200,
            width: 300,
            height: 300,
            overflow: 'hidden',
          }}>
          <Image source={Images.IconApp} style={styles.image} />
        </View>
      </View>
      <Button
        title="Bắt đầu"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.titleButton}
        onPress={handlePressStart}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    alignItems: 'center',
  },
  text: {fontWeight: '700', color: '#2EE201'},
  image: {width: '100%', flex: 1, resizeMode: 'contain'},
  button: {
    backgroundColor: '#F5A522',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 30,
    padding: 12,
  },
  buttonContainer: {
    width: '100%',
    marginHorizontal: 50,
    marginVertical: 10,
  },
  titleButton: {fontWeight: 'bold'},
});
