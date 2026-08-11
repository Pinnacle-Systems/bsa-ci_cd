import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import {setInput} from '@Redux/Slices/inputsHandler';

const screenWidth = Dimensions.get('window').width;

const CustomDropdownInput = ({
  label = 'Select',
  rawLabel,
  id,
  state,
  width,
  full,
  height,
  placeholder,
  items_state,
  isyear,
  ismonth,
  labelKey = 'label',
  valueKey = 'value',
  addOnVal_State = 'addOnVal',
  addOnVal_Key = 'id',
}) => {
  const dispatch = useDispatch();
  const inputState = useSelector(state => state.Input[id]) || {};
  const selectedValue = inputState[state] || '';

  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(
    new Animated.Value(selectedValue ? 1 : 0),
  ).current;

  const currentYear = new Date().getFullYear();
  const yearItems = isyear
    ? Array.from({length: 200}, (_, i) => ({
        label: (currentYear - i).toString(),
        value: (currentYear - i).toString(),
      }))
    : [];

  const monthItems = ismonth
    ? [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ].map(month => ({label: month, value: month}))
    : [];

  const data = isyear
    ? yearItems
    : ismonth
    ? monthItems
    : Array.isArray(inputState?.[items_state])
    ? inputState[items_state]
    : [];

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || selectedValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, selectedValue]);

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
    fontWeight: '600',
    letterSpacing: 0.3,
  };

  const handleChange = item => {
    if (!item) {
      return;
    }

    const payload = {[state]: item[valueKey], id};
    if (addOnVal_State && addOnVal_Key) {
      payload[addOnVal_State] = item[addOnVal_Key];
    }
    dispatch(setInput(payload));
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: width ? width : full ? '100%' : '48%',
          height: height || 60,
          borderColor: isFocused ? '#3b82f6' : '#e2e8f0',
        },
      ]}>
      {(isFocused || selectedValue) && (
        <Animated.Text style={[styles.label, labelStyle]} numberOfLines={1}>
          {label}
        </Animated.Text>
      )}

      <Dropdown
        style={styles.dropdown}
        data={data}
        search
        maxHeight={300}
        labelField={labelKey}
        searchPlaceholder={'search...'}
        valueField={valueKey}
        placeholder={placeholder || `Select ${rawLabel || 'Option'}`}
        value={selectedValue}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
      />
      {selectedValue ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: 35,
            top: '50%',
            marginTop: -5,
            zIndex: 10,
            paddingHorizontal: 5,
          }}
          onPress={() => handleChange({[valueKey]: ''})}>
          <Text style={{fontSize: 18, color: '#999', fontWeight: 'bold'}}>
            ✕
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default CustomDropdownInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#64748b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 2 : 0,
  },
  label: {
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 10,
    height: 40,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
