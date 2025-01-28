import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RadioButtonProps {
  values: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({ values, selectedValue, onValueChange }) => {
  return (
      <View style={styles.container}>
        {values.map(value => (
            <TouchableOpacity
                key={value}
                style={styles.radioContainer}
                onPress={() => onValueChange(value)}
            >
              <View style={styles.radio}>
                {selectedValue === value && <View style={styles.selected} />}
              </View>
              <Text style={styles.label}>{value}</Text>
            </TouchableOpacity>
        ))}
      </View>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'lightgray',
  },
  label: {
    fontSize: 16,
  },
});
