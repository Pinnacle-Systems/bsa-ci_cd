import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  Text,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {screenWidth} from '@Utils/Screens';
import {useDispatch, useSelector} from 'react-redux';
import {setInput} from '@Redux/Slices/inputsHandler';

function CustomInput({
  label = 'Text Input',
  type,
  state,
  change,
  id,
  width,
  full,
  height,
  props,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const OnchangeFun = change?.find(data => data?.name === state);

  // Access input state, ensure fallback if not found
  const Inputsate = useSelector(state => state.Input[id]) || {}; // Fallback to empty object
  const inputValue = Inputsate[state] || ''; // Default to an empty string if state is not found

  const dispatch = useDispatch();
  const animatedIsFocused = useRef(
    new Animated.Value(inputValue ? 1 : 0),
  ).current;

  const styles = StyleSheet.create({
    inputContainer: {
      borderWidth: 1.5,
      borderRadius: 12,
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      justifyContent: 'center',
      position: 'relative',
      marginVertical: 8,
      shadowColor: '#64748b',
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: Platform.OS === 'android' ? 2 : 0,
    },
    textInput: {
      height: '100%',
      fontSize: 16,
      color: '#333',
      paddingTop: 18,
      paddingBottom: 10,
      fontWeight: '500',
      textAlignVertical: 'top',
    },
    label: {
      position: 'absolute',
      left: 16,
      fontSize: 15,
      color: '#94a3b8',
      fontWeight: '600',
      letterSpacing: 0.3,
    },
  });

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || inputValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, inputValue]);

  const labelStyle = {
    position: 'absolute',
    left: 16,
    color: isFocused ? '#3b82f6' : '#94a3b8',
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [19, 6],
    }),
  };

  return (
    <View
      style={[
        styles.inputContainer,
        {
          width: width ? width : full ? '100%' : '48%',
          height: height || 60,
          borderColor: isFocused ? '#3b82f6' : '#e2e8f0',
          backgroundColor: props?.editable === false ? '#f8fafc' : '#ffffff',
        },
      ]}>
      <Animated.Text style={[styles.label, labelStyle]}>{label}</Animated.Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          {...props}
          value={inputValue}
          style={[styles.textInput, {flex: 1}]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={text => {
            dispatch(setInput({[state]: text, id}));
            OnchangeFun?.fun(text);
            if (props.onChangeText) {
              props.onChangeText(text);
            }
          }}
          placeholderTextColor="#aaa"
        />
        {inputValue && props?.editable !== false ? (
          <TouchableOpacity
            style={{padding: 8}}
            onPress={() => {
              dispatch(setInput({[state]: '', id}));
              OnchangeFun?.fun('');
              if (props.onChangeText) {
                props.onChangeText('');
              }
            }}>
            <Text style={{fontSize: 18, color: '#999', fontWeight: 'bold'}}>
              ✕
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default CustomInput;
