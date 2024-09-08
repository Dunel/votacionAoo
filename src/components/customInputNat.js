import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import MaskInput, { Masks } from 'react-native-mask-input';

const CustomInputNat = ({
  control,
  name,
  placeholder,
  onChangeText,
  rules,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <>
          <View
            style={[
              styles.container,
              { borderColor: error ? 'red' : '#e8e8e8' },
            ]}>
            <MaskInput
              value={value}
              onChangeText={(masked, unmasked) => {
                onChange(masked);
                onChangeText(masked);
              }}
              mask={Masks.DATE_DDMMYYYY}
              onBlur={onBlur}
              placeholder={placeholder}
              style={styles.input}
              keyboardType="numeric"
              maskAutoComplete={true}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    height: 40,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    alignSelf: 'stretch',
  },
});

export default CustomInputNat;
