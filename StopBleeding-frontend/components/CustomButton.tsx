import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";

const CustomButton = ({ onPress, text }) => {
    const colorScheme = useColorScheme();
    const buttonColor = Colors[colorScheme ?? 'light'].mainColor;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: buttonColor }]}
            activeOpacity={0.8}
        >
            <Text style={styles.buttonText}>
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '80%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        shadowColor: 'rgba(0, 0, 0, 0.35)',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 7,
        elevation: 5, // For Android shadow
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: '800',
    },
});

export default CustomButton;