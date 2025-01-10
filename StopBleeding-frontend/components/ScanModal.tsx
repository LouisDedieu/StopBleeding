import React from 'react';
import {
  StyleSheet,
  Modal,
  FlatList,
  Alert,
} from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export type Device = {
  id: number;
  name: string;
  type: string;
  status: string;
  saved: boolean;
};

type DeviceItemProps = {
  device: Device;
  onPress: (device: Device) => void;
};

export const DeviceItem: React.FC<DeviceItemProps> = ({ device, onPress }) => {
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

export type ScanModalProps = {
  visible: boolean;
  onClose: () => void;
  devices: Device[];
  onDeviceConnect?: (device: Device) => void;
  title?: string;
  closeButtonText?: string;
};

export const ScanModal: React.FC<ScanModalProps> = ({
                                                      visible,
                                                      onClose,
                                                      devices,
                                                      onDeviceConnect,
                                                      title = "Appareils détectés",
                                                      closeButtonText = "Fermer"
                                                    }) => {
  const connectToDevice = (device: Device) => {
    const updatedDevices = devices.map((d) => {
      if (d.id === device.id) {
        return {
          ...d,
          status: 'Connecté',
          saved: true
        };
      }
      return d;
    });

    onDeviceConnect?.(device);
    onClose();
    return updatedDevices;
  };

  const handleDevicePress = (device: Device) => {
    Alert.alert(
      "Connexion",
      `Voulez-vous vous connecter à ${device.name} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Connecter",
          onPress: () => connectToDevice(device)
        }
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>

          <FlatList
            data={devices.filter((d) => !d.saved)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DeviceItem
                device={item}
                onPress={handleDevicePress}
              />
            )}
            style={styles.modalList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Aucun appareil disponible
              </Text>
            }
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>{closeButtonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  modalList: {
    maxHeight: '70%',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});