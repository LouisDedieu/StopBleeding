import {Button, StyleSheet, TouchableOpacity} from 'react-native';
import { ScrollView, Text, View } from '@/components/Themed';
import React, { useState } from 'react';
import Input from '@/components/Input';
import CheckBox from '@/components/CheckBox';
import RadioButton from '@/components/RadioButton';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter,useLocalSearchParams} from "expo-router";
import {Image} from 'react-native';
import CustomButton from "@/components/CustomButton";
export default function TabTwoScreen() {
  const [searchText, setSearchText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)

  const patientData = [
    { type: 'input', label: 'Nom', placeholder: 'Doe' },
    { type: 'input', label: 'Prénom', placeholder: 'John' },
    { type: 'input', label: 'Âge', number: true },
    { type: 'input', label: 'Poids', number: true },
    { type: 'radio', label: 'Sexe', values: ['Homme', 'Femme', 'Autres'] },
    { type: 'radio', label: 'Groupe sanguin', values: ['A', 'B', 'AB', 'O'] },
    { type: 'checkbox', label: 'Allergies', values: ['Pénicilline', 'Aspirine', 'Ibuprofène', 'Autres'] },
    { type: 'checkbox', label: 'Symptômes', values: ['Douleurs', 'Saignements', 'Maux de tête', 'Fatigue'] },
    { type: 'checkbox', label: 'Antécédents médicaux', values: ['Diabète', 'Hypertension', 'Allergies', 'Médicaments'] },
    { type: 'checkbox', label: 'Traitements', values: ['Médicaments', 'Chirurgie', 'Physiothérapie', 'Autres'] },
    { type: 'checkbox', label: 'Vaccins', values: ['Tétanos', 'Grippe', 'Hépatite B', 'Autres'] },
    { type: 'checkbox', label: 'Facteurs de risque', values: ['Tabac', 'Alcool', 'Stress', 'Obésité'] },
    { type: 'checkbox', label: 'Traitements en cours', values: ['Antibiotiques', 'Antalgiques', 'Anticoagulants', 'Autres'] },
    { type: 'checkbox', label: 'Médicaments', values: ['Paracétamol', 'Ibuprofène', 'Aspirine', 'Autres'] },
    { type: 'checkbox', label: 'Chirurgies', values: ['Appendicectomie', 'Chirurgie cardiaque', 'Chirurgie esthétique', 'Autres'] },
    { type: 'checkbox', label: 'Physiothérapie', values: ['Rééducation', 'Massage', 'Électrothérapie', 'Autres'] },
    { type: 'checkbox', label: 'Autres traitements', values: ['Acupuncture', 'Homéopathie', 'Ostéopathie', 'Autres'] },
    { type: 'input', label: 'Autres informations', placeholder: 'Informations' },
  ]

  const tags = ['Nom', 'Prénom', 'Âge', 'Poids', 'Sexe', 'Antécédents médicaux', 'Symptômes', 'Traitements', 'Allergies', 'Vaccins', 'Groupe sanguin', 'Facteurs de risque', 'Traitements en cours', 'Médicaments', 'Chirurgies', 'Physiothérapie', 'Autres traitements']
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const {photoUri: paramPhotoUri } = useLocalSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (paramPhotoUri) {
      // @ts-ignore
      const validUri = paramPhotoUri.startsWith('file://') ? paramPhotoUri : `file://${paramPhotoUri}`;
      console.log("URI validé:", validUri);
      setPhotoUri(validUri);
    }
  }, [paramPhotoUri]);

  const handleSearch = (text: string) => {
    setSearchText(text)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    )
  }

  const filteredData = patientData.filter(item => {
    const labelMatch = item.label.toLowerCase().includes(searchText.toLowerCase())
    const valuesMatch = item.values?.some(value => value.toLowerCase().includes(searchText.toLowerCase()))
    const tagMatch = selectedTags.length === 0 || selectedTags.includes(item.label)
    return (labelMatch || valuesMatch) && tagMatch
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche Patient</Text>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearch} />
        <TouchableOpacity onPress={() => setShowTags(!showTags)} style={styles.toggleButton}>
          <Ionicons name={showTags ? "chevron-up" : "chevron-down"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {showTags && (
        <TagFilter tags={tags} selectedTags={selectedTags} toggleTag={toggleTag} />
      )}
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <ScrollView style={{ width: '100%' }}>
        {filteredData.map((item, index) => {
          if (item.type === 'radio') {
            return (
              <View key={index}>
                <Text style={styles.label}>{item.label}</Text>
                <RadioButton values={item.values} />
              </View>
            )
          } else if (item.type === 'checkbox') {
            return (
              <View key={index}>
                <Text style={styles.label}>{item.label}</Text>
                <CheckBox values={item.values} />
              </View>
            )
          } else {
            return (
              <Input
                key={index}
                label={item.label}
                placeholder={item.placeholder}
                number={item.number}
              />
            )
          }
        })}
        <View style={{alignItems : 'center'}}>
        {photoUri ? (
            <Image
                source={{ uri: photoUri }}
                style={styles.picture}
                resizeMode="contain"
                onError={(error) => console.log("Erreur de chargement de l'image:", error)} // Ajout pour déboguer
                onLoad={() => console.log("Image chargée avec succès")} // Ajout pour déboguer
            />
        ):(
            <Image
                source={{}}
                style={styles.noPicture}
                resizeMode="contain"
            />
        )}
        <CustomButton
            text="Prendre une photo"
            onPress={() => router.push('../takePicture')}
        />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picture: {
    marginTop: 20,
    width: '100%',
    height: 300,
  },
  noPicture: {
    marginBottom: 20,
    width: '80%',
    height: 200,
    backgroundColor : 'grey',
  },
})