import {FlatList, StyleSheet} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity, ScrollView } from '@/components/Themed';
import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";
import CustomButton from "@/components/CustomButton";

export default function TabOneScreen() {
    const colorScheme = useColorScheme();

    const devices = [
        {
            id: 1,
            name: 'Lampe',
            type: 'light',
            status: 'on',
            icon: 'lightbulb-line',
        },
        {
            id: 2,
            name: 'Prise',
            type: 'plug',
            status: 'off',
            icon: 'plug-line',
        },
        {
            id: 3,
            name: 'Thermostat',
            type: 'thermostat',
            status: 'on',
            icon: 'thermostat-line',
        },
        {
            id: 4,
            name: 'Caméra',
            type: 'camera',
            status: 'off',
            icon: 'camera-line',
        },
        {
            id: 5,
            name: 'Fenêtre',
            type: 'window',
            status: 'on',
            icon: 'window-line',
        },
        {
            id: 6,
            name: 'Porte',
            type: 'door',
            status: 'off',
            icon: 'door-line',
        },
        {
            id: 7,
            name: 'Volet',
            type: 'shutter',
            status: 'on',
            icon: 'shutter-line',
        },
        {
            id: 8,
            name: 'Alarme',
            type: 'alarm',
            status: 'off',
            icon: 'alarm-warning-line',
        }
    ];

    return (
        <View style={styles.container} lightColor={Colors[colorScheme ?? 'light'].tintBackground} darkColor={Colors[colorScheme ?? 'light'].tintBackground}>
            <View style={styles.devicesContainer} lightColor='#fffcfc' darkColor="rgba(255,255,255,0.1)" >
                <View style={styles.cameraContainer}>

                </View>
                <View style={styles.devicesTitleContainer}>
                    <Text style={styles.devicesTitle}>Objets connectés</Text>
                    <TouchableOpacity onPress={() => {}} style={styles.addButton} activeOpacity={0.6}>
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView lightColor={Colors[colorScheme ?? 'light'].background} darkColor={Colors[colorScheme ?? 'light'].background}>
                    <FlatList
                        data={devices}
                        renderItem={({item}) => (
                            <View style={[styles.deviceRow, {borderColor: item.status === 'on' ? 'green' : 'red'}]}>
                                <Text style={{fontSize: 16}}>{item.name}</Text>
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
            <CustomButton onPress={() => {}} text={"DÉMARRER"} />
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
    },
    devicesTitle: {
        fontSize: 20,
        fontWeight: 800,
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
    },
    addButton: {
        borderRadius: 50,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        width: 'auto',
        height: 'auto',
        paddingHorizontal: 10,
    },
    addButtonText: {
        fontSize: 20,
        fontWeight: 400,
        textAlign: 'center',
    },
    statusCircle: {
        width: 17,
        height: 17,
        borderRadius: 50,
        margin: 5,
    },
    statusOn: {
        backgroundColor: 'green',
    },
    statusOff: {
        backgroundColor: 'red',
    }
});
