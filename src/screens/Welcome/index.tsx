import {ImageBackground, StyleSheet, View,} from 'react-native';
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
      
      {/* <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            borderRadius: 200,
            width: 300,
            height: 300,
            overflow: 'hidden',
          }}>
          <Image source={Images.IconApp} style={styles.image} />
        </View>
      </View> */}
      <ImageBackground source={Images.IconApp} style={styles.image}></ImageBackground>
      <View style={{flex:0.30,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontFamily:'SVN-Gilroy-XBold',fontSize:24, color:'#1F2937'}}>
          Chào mừng
      </Text>
      <Text style={{fontFamily:'SVN-Gilroy-Regular',fontSize:15, color:'gray',paddingLeft: 30,paddingRight:30,textAlign:'center'}}>
      Chuyến đi trở nên dễ dàng, an toàn và thuận tiện. Để trãi nghiệm ứng dụng tìm kiếm chuyến đi ,vui lòng bắt đầu và đăng kí
      </Text>
      
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    // backgroundColor: '#fee5c9',

  },
  image: {width: '100%',height:'110%',flex:0.65,backgroundColor:'#FFFFFF', resizeMode: 'contain',borderBottomRightRadius:15,borderBottomLeftRadius:15},
  button: {
    backgroundColor: '#FEEAD3',
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FE5D26',    
  },
  buttonContainer: {
    width: '75%',
    marginHorizontal: 50,
    marginVertical: 10,
  },
  titleButton: {fontFamily: 'SVN-Gilroy-SemiBold',color:'#FE5D26'}
});
