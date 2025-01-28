import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

interface InputProps {
  label: string;
  number?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (text: string) => void;  // Ajout de la prop onChange
}

const Input: React.FC<InputProps> = ({ label, number, placeholder, value, onChange }) => {
  // const [text, setText] = useState('')
  // const [num, setNum] = useState(0)
  
  // const increment = () => {
  //   const newValue = num + 1;
  //   setNum(newValue);
  //   onChange?.(newValue.toString());  // Appel de onChange si défini
  // }
  
  // const decrement = () => {
  //   const newValue = num > 0 ? num - 1 : 0;
  //   setNum(newValue);
  //   onChange?.(newValue.toString());  // Appel de onChange si défini
  // }

  if (number) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TouchableOpacity 
                    onPress={() => {
                        const currentValue = parseInt(value || '0');
                        const newValue = Math.max(0, currentValue - 1);
                        onChange?.(newValue.toString());
                    }} 
                    style={styles.arrowButton}
                >
                    <Text style={styles.arrowText}>-</Text>
                </TouchableOpacity>
                <TextInput
                    style={styles.inputNumber}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const newValue = parseInt(text) || 0;
                        onChange?.(newValue.toString());
                    }}
                    value={value || '0'}
                    placeholder={placeholder}
                />
                <TouchableOpacity 
                    onPress={() => {
                        const currentValue = parseInt(value || '0');
                        onChange?.((currentValue + 1).toString());
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
            style={styles.input}
            onChangeText={onChange}
            value={value || ''}
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