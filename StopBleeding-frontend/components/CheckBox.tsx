import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'

interface CheckBoxProps {
  values: string[];
}

const CheckBox: React.FC<CheckBoxProps> = ({ values }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [otherText, setOtherText] = useState<string>('')

  const toggleValue = (value: string) => {
    setSelectedValues(prevSelectedValues =>
      prevSelectedValues.includes(value)
        ? prevSelectedValues.filter(v => v !== value)
        : [...prevSelectedValues, value]
    )
  }

  return (
    <View style={styles.container}>
      {values.map(value => (
        <View key={value} style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleValue(value)}
          >
            {selectedValues.includes(value) && (
              <Text style={styles.checked}>✓</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.label}>{value}</Text>
          {value === 'Autres' && selectedValues.includes(value) && (
            <TextInput
              style={styles.input}
              placeholder="Veuillez préciser"
              value={otherText}
              onChangeText={setOtherText}
            />
          )}
        </View>
      ))}
    </View>
  )
}

export default CheckBox

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    fontSize: 14,
    color: 'gray',
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginLeft: 10,
    flex: 1,
  },
})