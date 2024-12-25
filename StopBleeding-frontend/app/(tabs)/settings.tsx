import React, { useState } from 'react';
import {FlatList, Image, SafeAreaView, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import { Text, View } from '@/components/Themed';
import Svg, { Path } from "react-native-svg";
import Colors from "@/constants/Colors";
import {devices} from "@/app/(tabs)/index";

const DeviceItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnimation] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(rotateAnimation, {
      toValue: isExpanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedStyle = {
    transform: [{ rotate: rotateInterpolate }],
  };

  return (
    <View style={styles.deviceContainer}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={styles.deviceHeader}
      >
        <View style={styles.deviceInfo}>
          <Image
            source={require('@/assets/images/favicon.png')}
            style={styles.deviceImage}
          />
          <Text style={styles.deviceName}>{item.name}</Text>
        </View>
        <Animated.View style={animatedStyle}>
          <Svg width="24" height="24" viewBox="0 0 24 24">
            <Path
              fill="#000"
              d="M7 10l5 5 5-5"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text>ID: {item.id}</Text>
          <Text>Type: {item.type || 'Non spécifié'}</Text>
          <Text>Status: {item.status || 'Actif'}</Text>
          {/* Ajoutez ici d'autres informations à afficher */}
        </View>
      )}
    </View>
  );
};

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ajouter un objet connecté</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <FlatList
        data={devices}
        renderItem={({ item }) => <DeviceItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity
        onPress={() => {}}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginHorizontal: "3%",
    marginVertical: "7%",
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: "5%",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  list: {
    width: '90%',
  },
  listContent: {
    gap: 10,
  },
  deviceContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  deviceImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  deviceName: {
    fontSize: 16,
  },
  expandedContent: {
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: 'auto',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 1.5,
    borderColor: Colors.light.tint,
    margin: 15,
  },
  buttonText: {
    color: Colors.light.tint,
    fontSize: 40,
    fontWeight: '300',
    textAlign: 'center',
    paddingBottom: 5,
  },
});