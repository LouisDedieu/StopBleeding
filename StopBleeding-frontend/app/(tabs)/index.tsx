import {StyleSheet} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";

export default function TabOneScreen() {
  const colorScheme = useColorScheme();

  return (
      <View style={styles.container} lightColor={Colors[colorScheme ?? 'light'].tintBackground} darkColor={Colors[colorScheme ?? 'light'].tintBackground}>
        <View style={styles.devicesContainer} lightColor='#fffcfc' darkColor="rgba(255,255,255,0.1)" >
        </View>
        <TouchableOpacity onPress={()=> {}} style={styles.button} lightColor={Colors[colorScheme ?? 'light'].tint} darkColor={Colors[colorScheme ?? 'light'].tint}>
          <Text style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 800
          }}>
            DÉMARRER
          </Text>
        </TouchableOpacity>
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
  },
  button: {
    width: '80%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
    boxShadow: '2px 4px 7px rgba(0,0,0,0.35)'
  }
});
