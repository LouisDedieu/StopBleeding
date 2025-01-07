import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import CustomButton from "@/components/CustomButton";
import Colors from "@/constants/Colors";
import {useColorScheme} from "@/components/useColorScheme";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  return (
      <View style={[styles.container, {backgroundColor: Colors[colorScheme ?? 'light'].tintBackground}]}>
        <View style={styles.subcontainer}>
          <View style={styles.qrholder} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        </View>

        <CustomButton onPress={() => {}} text={"SCANNER"} />

      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0.9,
    width: '90%',
    borderRadius: 10,
    marginTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  qrholder: {
    marginVertical: 30,
    width: '95%',
    aspectRatio: 1,
    borderRadius: 10,
  },
});
