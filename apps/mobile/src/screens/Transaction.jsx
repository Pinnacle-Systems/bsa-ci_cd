import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomText from '@Component/Text/CustomText';
import {FontAwesome5} from 'react-native-vector-icons';
import CustomizeButton from '@Component/Buttons/CustomizeButton';
import {screenWidth} from '@Utils/Screens';
import InputWraper from '@Screens/InputWraper';
import {Master_Meta} from '@Redux/States/Master/Master';
import {useSelector} from 'react-redux';

function Transaction() {
  const InputState = useSelector(state => state?.Input?.Master_state);

  return (
    <View style={{flex: 1, marginTop: 5}}>
      <CustomText
        style={{
          fontWight: 'bold',
          fontSize: 17,
          color: '#6f7275',
          marginLeft: 10,
          textAlign: 'center',
        }}>
        <FontAwesome5 name="building" size={26} color="black" /> Company Master
      </CustomText>
      <InputWraper states={Master_Meta} />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          width: screenWidth + 40,
        }}>
        <CustomizeButton
          onPress={() => alert(JSON?.stringify(InputState))}
          style={{
            ButtonOuter: {
              width: screenWidth,
              backgroundColor: '#0273e3',
              borderColor: '#0273e3',
              borderRadius: 0,
            },
          }}>
          Save
        </CustomizeButton>
      </View>
    </View>
  );
}

export default Transaction;
