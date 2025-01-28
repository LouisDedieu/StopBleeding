import {Button, FlatList, StyleSheet} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";
import CustomButton from "@/components/CustomButton";
import React, {useRef, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-remix-icon";
import {Camera, CameraType, CameraView, useCameraPermissions} from "expo-camera";
import {useIsFocused} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';

export const devices = [
    {
        id: 1,
        name: 'Thermomètre',
        type: 'thermometer',
        status: 'on',
        icon: 'thermometer',
    },
    {
        id: 2,
        name: 'Oxymètre',
        type: 'oximeter',
        status: 'off',
        icon: 'pulse',
    },
    {
        id: 3,
        name: 'Tensiomètre',
        type: 'blood-pressure',
        status: 'on',
        icon: 'heart',
    },
    {
        id: 4,
        name: 'Caméra',
        type: 'camera',
        status: 'on',
        icon: 'camera',
    }
];


export default function TabOneScreen() {
    const colorScheme = useColorScheme();
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
     const cameraRef = useRef<Camera>(null);
    const isFocused = useIsFocused();

    if ((!permission || !permission.granted) && devices[3].status == "on") {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>La permission d'utiliser la caméra n'a pas été accordée</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    const demarreIntervention = async()=>{
        console.log("reset cache")
        await AsyncStorage.removeItem('formData');
        await AsyncStorage.removeItem('photos');
        router.push('/two');
    }
    return (
        <View style={styles.container} lightColor={Colors[colorScheme ?? 'light'].tintBackground} darkColor={Colors[colorScheme ?? 'light'].tintBackground}>
            <View style={styles.devicesContainer} lightColor='#fffcfc' >
                <View style={styles.cameraContainer}>
                    {isFocused && <CameraView ref={cameraRef} style={styles.camera} facing={facing}/>}

                </View>
                <View style={styles.devicesTitleContainer}>
                    <Text style={styles.devicesTitle}>Objets connectés</Text>
                  <TouchableOpacity onPress={() => {}} style={[styles.addButton, {borderColor: Colors[colorScheme ?? 'light'].text}]} activeOpacity={0.6}>
                      <Icon name={"add-circle-line"} size={35} color={Colors[colorScheme ?? 'light'].text}/>
                  </TouchableOpacity>
                </View>
                <ScrollView lightColor={Colors[colorScheme ?? 'light'].background} darkColor={Colors[colorScheme ?? 'light'].background}>
                    <FlatList
                        data={devices}
                        renderItem={({item}) => (
                            <View style={[styles.deviceRow, {borderColor: item.status === 'on' ? '#25E32B' : '#DE6C6A'}]}>
                                <Text style={{fontSize: 16, fontWeight: 500}}>{item.name}</Text>
                                <View style={[
                                    styles.statusCircle,
                                    item.status === 'on' ? styles.statusOn : styles.statusOff
                                ]} />
                            </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{gap: 10}}
                        style={{marginBottom: 10}}
                    />
                </ScrollView>

            </View>
            <CustomButton onPress={demarreIntervention} text={"DÉMARRER"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    devicesContainer: {
        flexGrow: 1,
        width: '90%',
        borderRadius: 10,
        marginTop: 15,
        maxHeight: '85%',
        overflow: 'hidden',
    },
    button: {
        width: '80%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
        boxShadow: '2px 4px 7px rgba(0,0,0,0.35)'
    },
    cameraContainer: {
        height: 200,
        width: 'auto',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 10,
        margin: 15,
    },
    devicesTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 7,
    },
    devicesTitle: {
        fontSize: 20,
        fontWeight: 700,
    },
    deviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    addButton: {
        borderRadius: 25,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        marginRight: 10,
    },
    addButtonText: {
        fontSize: 20,
    },
    statusCircle: {
        width: 17,
        height: 17,
        borderRadius: 50,
        margin: 5,
    },
    statusOn: {
        backgroundColor: '#25E32B',
    },
    statusOff: {
        backgroundColor: '#DE6C6A',
    },
    camera: {
        flex: 1,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
});
