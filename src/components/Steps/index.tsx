import {Text} from '@rneui/themed';
import React from 'react';
import {Touchable, TouchableOpacity, View} from 'react-native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {formatPrice} from '@utils/price';

type TItem = {
  time: string;
  title: string;
  desc: string;
  icon: {name: string; color: string};
  costsIncurred?: number;
};

export const Steps: React.FC<{data: TItem[]; showPrice?: boolean}> = ({
  data = [],
  showPrice,
}) => {
  return (
    <View style={{paddingVertical: 16}}>
      {data.map((item, index) => (
        <Item
          key={index}
          isLastItem={index === data.length - 1}
          time={item.time}
          title={item.title}
          desc={item.desc}
          icon={item.icon}
          costsIncurred={showPrice ? item.costsIncurred : 0}
        />
      ))}
    </View>
  );
};

const Item = ({
  isLastItem,
  time,
  title,
  desc,
  icon,
  costsIncurred,
}: {
  isLastItem: boolean;
} & TItem) => {
  return (
    <TouchableOpacity>
    <View style={{flexDirection: 'row', minHeight: isLastItem ? 0 : 60}}>
      <View style={{flex: 1}}>
        <Text
          style={{
            textAlign: 'right',
            paddingHorizontal: 16,
            fontWeight: '600',
          }}>
          {time}
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          borderLeftWidth: 2,
          borderColor: isLastItem ? '#fff' : '#ccc',
          paddingHorizontal: 16,
        }}>
        <Icon1
          name={icon?.name}
          color={icon?.color}
          size={16}
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            left: -9,
          }}
        />

        <Text
          style={{
            marginBottom: 4,
          }}>
          <Text style={{fontFamily: "SVN-Gilroy-XBold", marginBottom: 4}}>{title}</Text>
          {!!costsIncurred && (
            <Text
              style={{
                fontWeight: '600',
                fontStyle: 'italic',
                fontSize: 12,
              }}>{` - ${formatPrice(costsIncurred)}`}</Text>
          )}
        </Text>
        <Text style={{fontSize: 12,fontFamily:'SVN-Gilroy-Medium', color: "grey", marginBottom: 4}}>
          {desc}
        </Text>
      </View>
    </View>
    </TouchableOpacity>
  );
};
