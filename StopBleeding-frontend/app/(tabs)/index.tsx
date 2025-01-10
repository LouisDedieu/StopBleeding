import { FlatList, StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import CustomButton from "@/components/CustomButton";
import React, { useState } from 'react';
import Icon from "react-native-remix-icon";
import { ScanModal, Device } from '@/components/ScanModal'; // Assurez-vous que le chemin d'import est correct

// Adaptation des données pour correspondre au type Device
const initialDevices: Device[] = [
    {
        id: 1,
        name: 'Thermomètre',
        type: 'Bluetooth',
        status: 'Connecté',
        saved: true
    },
    {
        id: 2,
        name: 'Oxymètre',
        type: 'Bluetooth',
        status: 'Non Connecté',
        saved: true
    },
    {
        id: 3,
        name: 'Tensiomètre',
        type: 'Bluetooth',
        status: 'Connecté',
        saved: true
    },
    {
        id: 4,
        name: 'Caméra',
        type: 'Wifi',
        status: 'Non Connecté',
        saved: false
    },
];

export default function TabOneScreen() {
    const colorScheme = useColorScheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [devices, setDevices] = useState<Device[]>(initialDevices);

    const handleDeviceConnect = (device: Device) => {
        setDevices(devices.map(d => {
            if (d.id === device.id) {
                return { ...d, status: 'Connecté', saved: true };
            }
            return d;
        }));
    };

    return (
      <View
        style={styles.container}
        lightColor={Colors[colorScheme ?? 'light'].tintBackground}
        darkColor={Colors[colorScheme ?? 'light'].tintBackground}
      >
          <View style={styles.devicesContainer} lightColor='#fffcfc'>
              <View style={styles.cameraContainer} />
              <View style={styles.devicesTitleContainer}>
                  <Text style={styles.devicesTitle}>Objets connectés</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={[styles.addButton, {borderColor: Colors[colorScheme ?? 'light'].text}]}
                    activeOpacity={0.6}
                  >
                      <Icon
                        name="add-circle-line"
                        size={35}
                        color={Colors[colorScheme ?? 'light'].text}
                      />
                  </TouchableOpacity>
              </View>
              <FlatList
                data={devices.filter(d => d.saved)}
                renderItem={({item}) => (
                  <View style={[
                      styles.deviceRow,
                      {borderColor: item.status === 'Connecté' ? '#25E32B' : '#DE6C6A'}
                  ]}>
                      <Text style={{fontSize: 16, fontWeight: '500'}}>{item.name}</Text>
                      <View style={[
                          styles.statusCircle,
                          item.status === 'Connecté' ? styles.statusOn : styles.statusOff
                      ]} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{gap: 10}}
                style={{marginBottom: 10}}
              />
          </View>

          <CustomButton onPress={() => {}} text={"DÉMARRER"} />

          <ScanModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            devices={devices}
            onDeviceConnect={handleDeviceConnect}
          />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    devicesContainer: {
        flexGrow: 1,
        width: '90%',
        borderRadius: 10,
        marginTop: 15,
        maxHeight: '85%',
        overflow: 'hidden',
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
        fontWeight: '700',
    },
    deviceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: 10,
        borderStyle: 'solid',
        borderWidth: 1.2,
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
    }
});