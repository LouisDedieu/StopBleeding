import React, { useState } from 'react';
import {
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Icon from "react-native-remix-icon";
import { ScanModal, Device, DeviceItem } from '@/components/ScanModal'; // Importez depuis votre nouveau fichier

// Liste des appareils simulée
const MOCK_DEVICES: Device[] = [
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
    saved: false
  },
  {
    id: 3,
    name: 'Tensiomètre',
    type: 'Wifi',
    status: 'Non Connecté',
    saved: false
  },
  {
    id: 4,
    name: 'Caméra',
    type: 'Wifi',
    status: 'Non Connecté',
    saved: true
  },
];

export default function ConnectedDevicesScreen() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);

  const handleDevicePress = (device: Device) => {
    Alert.alert("Info", `Appareil: ${device.name}`, [
      device.status === 'Connecté'
        ? {
          text: "Déconnecter",
          style: "destructive",
          onPress: () => {
            setDevices(devices.map((d) => {
              if (d.id === device.id) {
                return { ...d, status: 'Non Connecté' };
              }
              return d;
            }));
          }
        }
        : {
          text: "Connecter",
          onPress: () => {
            setDevices(devices.map((d) => {
              if (d.id === device.id) {
                return { ...d, status: 'Connecté' };
              }
              return d;
            }));
          }
        },
      { text: "OK" },
    ]);
  };

  const handleDeviceConnect = (device: Device) => {
    setDevices(devices.map((d) => {
      if (d.id === device.id) {
        return { ...d, status: 'Connecté', saved: true };
      }
      return d;
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes appareils connectés</Text>

      <View style={styles.separator} />

      <FlatList
        data={devices.filter((d) => d.saved)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <DeviceItem
            device={item}
            onPress={handleDevicePress}
          />
        )}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun appareil connecté
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon
          name="add-circle-line"
          size={70}
          color={Colors[colorScheme ?? 'light'].mainColor}
        />
      </TouchableOpacity>

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
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: 'gray',
  },
  addButton: {
    alignItems: 'center',
    padding: 10,
  },
});