import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

interface InputProps {
  label: string;
  number?: boolean;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, number, placeholder }) => {
  const [text, setText] = useState('')
  const [num, setNum] = useState(0)

  const increment = () => setNum(prev => prev + 1)
  const decrement = () => setNum(prev => (prev > 0 ? prev - 1 : 0))

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
            onChangeText={text => setNum(parseInt(text) || 0)}
            value={num.toString()}
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
        onChangeText={setText}
        value={text}
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