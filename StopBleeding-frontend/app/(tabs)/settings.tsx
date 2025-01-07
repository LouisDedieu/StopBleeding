import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import Icon from "react-native-remix-icon";

// Liste des appareils simulée (à remplacer par les vrais appareils détectés)
const MOCK_DEVICES = [
  { id: 1, name: 'Appareil 1', type: 'Bluetooth', status: 'Connecté', saved: true },
  { id: 2, name: 'Appareil 2', type: 'WiFi', status: 'Non connecté', saved: false },
  { id: 3, name: 'Appareil 3', type: 'Bluetooth', status: 'Non connecté', saved: false },
];

// Composant pour afficher un appareil dans la liste
const DeviceItem = ({ device, onPress }) => {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[styles.deviceItem, { backgroundColor: Colors[colorScheme ?? 'light'].tintBackground }]}
      onPress={() => onPress(device)}
    >
      <View style={[styles.deviceInfo, { backgroundColor: Colors[colorScheme ?? 'light'].tintBackground }]}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <Text style={styles.deviceType}>{device.type}</Text>
      </View>
      <Text style={[
        styles.deviceStatus,
        { color: device.status === 'Connecté' ? Colors.light.tint : 'gray' }
      ]}>
        {device.status}
      </Text>
    </TouchableOpacity>
  );
};

// Composant Modal pour la recherche d'appareils
const ScanModal = ({ visible, onClose, devices }) => {

  const connectToDevice = (device) => {
    devices.map((d) => {
      if (d.id === device.id) {
        d.status = 'Connecté';
        d.saved = true;
      }
    });

    onClose();
  }
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Appareils détectés</Text>

          <FlatList
            data={devices.filter((d) => !d.saved)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DeviceItem
                device={item}
                onPress={(device) => {
                  Alert.alert(
                    "Connexion",
                    `Voulez-vous vous connecter à ${device.name} ?`,
                    [
                      { text: "Annuler", style: "cancel" },
                      { text: "Connecter", onPress: () => {
                          connectToDevice(device);
                        }}
                    ]
                  );
                }}
              />
            )}
            style={styles.modalList}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Composant principal
export default function ConnectedDevicesScreen() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [devices, setDevices] = useState(MOCK_DEVICES);

  // Fonction pour démarrer la recherche (à implémenter avec le vrai scan)
  const startScan = () => {
    setModalVisible(true);
    // Ici, tu implémenteras la vraie logique de scan
    // Pour l'instant, on utilise les appareils simulés
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
            onPress={(device) => {
              Alert.alert("Info", `Appareil: ${device.name}`, [
                item.status === 'Connecté' ?
                  { text: "Déconnecter", style: "destructive",
                    onPress: () => {
                      setDevices(devices.map((d) => {
                        if (d.id === device.id) {
                          d.status = 'Non connecté';
                        }
                        return d;
                      }));
                    }
                  } : {
                  text: "Connecter",
                  onPress: () => {
                    setDevices(devices.map((d) => {
                      if (d.id === device.id) {
                        d.status = 'Connecté';
                      }
                      return d;
                    }));
                  }
                }
                ,
                { text: "OK" },
              ]);
            }}
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
        onPress={startScan}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  deviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: 'gray',
  },
  deviceStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    alignItems: 'center',
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalList: {
    maxHeight: '70%',
  },
  closeButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});