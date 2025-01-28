import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

interface InputProps {
  label: string;
  number?: boolean;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

const Input: React.FC<InputProps> = ({ label, number, placeholder, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Mettre à jour la valeur locale uniquement si la valeur externe change 
  // et que l'input n'est pas focus (pour le speech-to-text)
  useEffect(() => {
    if (value !== localValue && !isFocused) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    setLocalValue(text);
    // N'envoyer la mise à jour au parent que si on n'est pas focus
    // ou si c'est un changement via les boutons +/-
    if (!isFocused || number) {
      onChange(text);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Envoyer la valeur finale au parent lors du blur
    onChange(localValue);
  };

  if (number) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => {
              const currentValue = parseInt(localValue || '0');
              const newValue = Math.max(0, currentValue - 1);
              handleChangeText(newValue.toString());
            }}
            style={styles.arrowButton}
          >
            <Text style={styles.arrowText}>-</Text>
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={styles.inputNumber}
            keyboardType="numeric"
            onChangeText={handleChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            value={localValue}
            placeholder={placeholder}
          />
          <TouchableOpacity
            onPress={() => {
              const currentValue = parseInt(localValue || '0');
              const newValue = currentValue + 1;
              handleChangeText(newValue.toString());
            }}
            style={styles.arrowButton}
          >
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
        ref={inputRef}
        style={styles.input}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        value={localValue}
        placeholder={placeholder}
        multiline
      />
    </View>
  )
}

export default Input;

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