import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {screenWidth} from '@Utils/Screens';
import {useDispatch, useSelector} from 'react-redux';
import {setInput} from '@Redux/Slices/inputsHandler';

function CustomTimeInput({
  label = 'Text Input',
  state,
  id,
  width,
  full,
  height,
  isTimeInput,
  props,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

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
    },
    label: {
      position: 'absolute',
      left: 16,
      fontSize: 15,
      color: '#94a3b8',
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 4,
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
    color: error ? '#ef4444' : isFocused ? '#3b82f6' : '#94a3b8',
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [19, 6],
    }),
  };

  const handleTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowPicker(false);

    // Update current time for comparison
    const now = new Date();
    setCurrentTime(now);

    // Check if selected time is in the future
    if (currentDate <= now) {
      setError('Please select a time in the future');
      return;
    }

    setError('');
    // Set current seconds while keeping the selected minutes/hours
    const timeWithCurrentSeconds = new Date(currentDate);
    timeWithCurrentSeconds.setSeconds(new Date().getSeconds());

    const timeString = timeWithCurrentSeconds.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    dispatch(setInput({[state]: timeString, id}));
  };

  return (
    <View style={{width: width ? width : full ? '100%' : '48%'}}>
      <View
        style={[
          styles.inputContainer,
          {
            width: '100%',
            height: height || 60,
            borderColor: error ? '#ef4444' : isFocused ? '#3b82f6' : '#e2e8f0',
            backgroundColor: props?.editable === false ? '#f8fafc' : '#ffffff',
          },
        ]}>
        <Animated.Text style={[styles.label, labelStyle]}>
          {label}
        </Animated.Text>
        <TouchableOpacity onPress={() => isTimeInput && setShowPicker(true)}>
          <View
            pointerEvents={isTimeInput ? 'none' : 'auto'}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              {...props}
              value={inputValue}
              style={[styles.textInput, {flex: 1}]}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholderTextColor="#aaa"
              editable={!isTimeInput}
            />
          </View>
        </TouchableOpacity>

        {inputValue ? (
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 4,
              top: '50%',
              marginTop: -5,
              padding: 8,
              zIndex: 100,
            }}
            onPress={() => dispatch(setInput({[state]: '', id}))}>
            <Text style={{fontSize: 18, color: '#999', fontWeight: 'bold'}}>
              ✕
            </Text>
          </TouchableOpacity>
        ) : null}

        {/* Time picker modal */}
        {showPicker && (
          <DateTimePicker
            value={new Date(currentTime.getTime() + 60000)} // Default to 1 minute in the future
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
            minimumDate={new Date(currentTime.getTime() + 60000)} // Don't allow times before now
          />
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default CustomTimeInput;
