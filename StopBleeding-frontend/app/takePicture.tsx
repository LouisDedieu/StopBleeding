import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from "expo-camera";
import { Image } from 'react-native';
import { router } from "expo-router";
import { useIsFocused } from '@react-navigation/native';

export default function TakePicture() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [modalVisible, setModalVisible] = useState(true);
    const cameraRef = useRef<Camera>(null);
    const isFocused = useIsFocused();

    if (!permission || !permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>La permission d'utiliser la caméra n'a pas été accordée</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    let picture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    base64: false,
                    exif: false,
                    skipProcessing: false
                });

                if (photo.uri && photo.uri.startsWith('file://')) {
                    // Ferme d'abord le Modal
                    setModalVisible(false);
                    console.log("photo prise : " + photo.uri)
                    // Retourne à l'écran précédent avec l'URI de la photo
                    router.navigate({
                        pathname: "/(tabs)/two",
                        params: { photoUri: photo.uri }
                    });
                } else {
                    console.error("URI de photo invalide:", photo.uri);
                }
            } catch (error) {
                console.error("Erreur lors de la prise de photo:", error);
            }
        }
    }

    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => {
                setModalVisible(false);
                router.back();
            }}
            style={styles.container}
        >
            {isFocused && (
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.flip} onPress={toggleCameraFacing}>
                            <Image
                                source={require('../assets/images/flipCamera.png')}
                                style={{ height: 60, width: 60 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.picture} onPress={picture}>
                            <Image
                                source={require('../assets/images/pictureCamera.png')}
                                style={{ height: 60, width: 60 }}
                            />
                        </TouchableOpacity>
                    </View>
                </CameraView>
            )}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        margin: 64,
        gap: 50,
    },
    flip: {
        width: 80,
        height: 80,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0080FF80',
        borderRadius: 40,
    },
    picture: {
        width: 80,
        height: 80,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF000080',
        borderRadius: 40,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});