// Input.tsx
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

interface InputProps {
  label: string;
  number?: boolean;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
}

const Input: React.FC<InputProps> = ({ label, number, placeholder, value, onChangeText }) => {
  const [localValue, setLocalValue] = useState(value);

  // Mettre à jour la valeur locale quand la prop value change
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleEndEditing = () => {
    // Ne mettre à jour que si la valeur a changé
    if (localValue !== value) {
      onChangeText(localValue);
    }
  };

  const increment = () => {
    const currentValue = parseInt(localValue) || 0;
    const newValue = (currentValue + 1).toString();
    setLocalValue(newValue);
    onChangeText(newValue); // Pour les nombres, on met à jour immédiatement
  }

  const decrement = () => {
    const currentValue = parseInt(localValue) || 0;
    const newValue = currentValue > 0 ? (currentValue - 1).toString() : '0';
    setLocalValue(newValue);
    onChangeText(newValue); // Pour les nombres, on met à jour immédiatement
  }

  if (number) {
    return (
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={decrement} style={styles.arrowButton}>
              <Text style={styles.arrowText}>-</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.inputNumber}
                keyboardType="numeric"
                onChangeText={setLocalValue}
                onEndEditing={handleEndEditing}
                value={localValue}
                placeholder={placeholder}
            />
            <TouchableOpacity onPress={increment} style={styles.arrowButton}>
              <Text style={styles.arrowText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            onChangeText={setLocalValue}
            onEndEditing={handleEndEditing}
            value={localValue}
            placeholder={placeholder}
            multiline
        />
      </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    height: 35,
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    width: '100%',
  },
  inputNumber: {
    height: 35,
    borderColor: 'lightgray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 10,
    width: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {
    width: 30,
    height: 30,
    marginHorizontal: 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
  arrowText: {
    fontSize: 18,
  },
})