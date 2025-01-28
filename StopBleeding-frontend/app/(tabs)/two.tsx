import {Button, StyleSheet, TouchableOpacity} from 'react-native';
import { ScrollView, Text, View } from '@/components/Themed';
import React, { useState, useEffect } from 'react';
import Voice from '@react-native-voice/voice';
import Input from '@/components/Input';
import CheckBox from '@/components/CheckBox';
import RadioButton from '@/components/RadioButton';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter,useLocalSearchParams} from "expo-router";
import {Image} from 'react-native';
import CustomButton from "@/components/CustomButton";

type FormField =
  | 'nom'
  | 'prenom'
  | 'age'
  | 'poids'
  | 'sexe'
  | 'groupesanguin'
  | 'allergies'
  | 'symptomes'
  | 'antecedentsmedicaux'
  | 'traitements'
  | 'vaccins'
  | 'facteursrisque'
  | 'traitementsencours'
  | 'medicaments'
  | 'chirurgies'
  | 'physiotherapie'
  | 'autrestraitements'
  | 'autresinformations';

type FormValues = {
  [K in FormField]?: string | string[];
}

export default function TabTwoScreen() {
  const [searchText, setSearchText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showTags, setShowTags] = useState(false)
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false)
  let [isRecording, setIsRecording] = useState(false);
  let [results, setResults] = useState([]);

  const patientData = [
    { type: 'input', label: 'Nom', placeholder: 'Doe' },
    { type: 'input', label: 'Prenom', placeholder: 'John' },
    { type: 'input', label: 'Age', number: true },
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

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    )
  }

  const toggleMicrophone = () => {
    setIsMicrophoneActive(!isMicrophoneActive);
    // Vous pouvez ajouter ici des actions comme démarrer/arrêter l'enregistrement audio
  };

  const filteredData = patientData.filter(item => {
    const labelMatch = item.label.toLowerCase().includes(searchText.toLowerCase())
    const valuesMatch = item.values?.some(value => value.toLowerCase().includes(searchText.toLowerCase()))
    const tagMatch = selectedTags.length === 0 || selectedTags.includes(item.label)
    return (labelMatch || valuesMatch) && tagMatch
  })

  const startSpeechToText = async () => {
    await Voice.start('fr-FR');
    setIsRecording(true);
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setIsRecording(false);
  }

  const onSpeechResults = (result: any) => {
    setResults(result.value);

    result.value.forEach((text: string) => {
      analyzeSpokenText(text);
    });
  }

  const onSpeechError = (error: any) => {
    console.log('Erreur de reconnaissance vocale:', error);
  }

  const [formValues, setFormValues] = useState<FormValues>({
    nom: '',
    prenom: '',
    age: '',
    poids: '',
    // sexe: '',
    // groupeSanguin: '',
    // allergies: [] as string[],
    // symptomes: [] as string[],
    // antecedentsMedicaux: [] as string[],
    // traitements: [] as string[],
    // vaccins: [] as string[],
    // facteursRisque: [] as string[],
    // traitementsEnCours: [] as string[],
    // medicaments: [] as string[],
    // chirurgies: [] as string[],
    // physiotherapie: [] as string[],
    // autresTraitements: [] as string[],
    // autresInformations: ''
  });

  const getLabelKey = (label: string): FormField => {
    return label.toLowerCase().replace(/\s+/g, '') as FormField;
  };

  const updateFormValue = (field: FormField, value: string | string[]) => {
    console.log('Mise à jour de la valeur:', field, value);
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    // console.log('FormValues:', formValues);
  };

  // Fonction pour analyser le texte dicté
  const analyzeSpokenText = (text: string) => {
    const removeAccents = (str: string) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    console.log("Texte dicté original:", text);
    const normalizedText = removeAccents(text.toLowerCase());
    console.log("Texte normalisé:", normalizedText);

    const numberWords: { [key: string]: number } = {
        'zero': 0, 'zéro': 0,
        'un': 1, 'une': 1,
        'deux': 2,
        'trois': 3,
        'quatre': 4,
        'cinq': 5,
        'six': 6,
        'sept': 7,
        'huit': 8,
        'neuf': 9,
        'dix': 10,
        'trente': 30,
        'cent': 100,
        // Ajoutez d'autres nombres si nécessaire
    };

    const convertWordToNumber = (word: string): string => {
        const number = numberWords[word.toLowerCase()];
        return number !== undefined ? number.toString() : word;
    };
    
    // Modification des expressions régulières pour gérer les variantes avec/sans accent
    const fields = {
        nom: /\bnom\s+(\w+)\b/i,
        prenom: /\b(prénom|prenom)\s+(\w+)\b/i,
        age: /\b(âge|age)\s+(\d+|zero|zéro|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\b/i,
        poids: /\b(poids)\s+(\d+|zero|zéro|un|une|deux|trois|quatre|cinq|six|sept|huit|neuf|dix)\b/i,
        sexe: /\b(homme|femme|autres)\b/i,
        groupeSanguin: /\bgroupe\s+sanguin\s+(a|b|ab|o)\b/i,
    };
  
  // Dans la fonction analyzeSpokenText
  Object.entries(fields).forEach(([field, regex]) => {
        // console.log(`Tentative de match pour ${field} avec regex ${regex}`);
        const match = normalizedText.match(regex);
        // console.log(`Résultat du match pour ${field}:`, match);
        
        if (match) {
            console.log('Match trouvé:', match);
            // Pour age et poids, convertir les nombres en lettres si nécessaire
            if (field === 'age' || field === 'poids') {
                const numberValue = convertWordToNumber(match[match.length - 1]);
                setFormValues(prev => ({
                    ...prev,
                    [field]: numberValue
                }));
                console.log(`Valeur numérique pour ${field}:`, numberValue);
            } else {
                const value = match[match.length - 1];
                setFormValues(prev => ({
                    ...prev,
                    [field]: value
                }));
            }
        }
    });

    // // Analyse pour les champs à choix multiples
    // const multiFields = {
    //   allergies: ['pénicilline', 'aspirine', 'ibuprofène'],
    //   symptomes: ['douleurs', 'saignements', 'maux de tête', 'fatigue'],
    //   antecedentsMedicaux: ['diabète', 'hypertension', 'allergies'],
    //   traitements: ['médicaments', 'chirurgie', 'physiothérapie'],
    //   // ... ajoutez les autres champs multiples ici
    // };

    // Object.entries(multiFields).forEach(([field, keywords]) => {
    //   const foundValues = keywords.filter(keyword => 
    //     lowerText.includes(keyword.toLowerCase())
    //   );
    //   if (foundValues.length > 0) {
    //     updateFormValue(field, foundValues);
    //   }
    // });

    // // Pour les autres informations (texte libre)
    // const autresInfosMatch = lowerText.match(/autres informations\s+(.+)/i);
    // if (autresInfosMatch) {
    //   updateFormValue('autresInformations', autresInfosMatch[1]);
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fiche Patient</Text>
      <View style={styles.microphoneContainer}>
        <TouchableOpacity // Cela représente uniquement l'affichage du bouton gris ou rouge du micro pour activer ou désactiver le micro
          style={[
            styles.microphoneButton,
            isMicrophoneActive ? styles.microphoneActive : styles.microphoneInactive,
          ]}
          onPress={toggleMicrophone}
        >
          <Ionicons
            name={isMicrophoneActive ? 'mic' : 'mic-off'}
            size={32}
            color={isMicrophoneActive ? 'white' : 'gray'}
          />
        </TouchableOpacity>
        <Text style={styles.microphoneStatus}>
          Microphone {isMicrophoneActive ? 'Activé' : 'Désactivé'}
        </Text>
      </View>
      {isMicrophoneActive && (
        <TouchableOpacity 
          style={styles.speechToTextSection}
          onPress={isRecording ? stopSpeechToText : startSpeechToText}
          // onPress={() => setIsRecording(!isRecording)} // L'appui sur cette section déclenche le début de l'enregistrement
        >
          <TouchableOpacity 
            style={[
              styles.controlButton,
              !isRecording && { paddingLeft: 3 },
              isRecording && { paddingLeft: 0 }
            ]}
            onPress={isRecording ? stopSpeechToText : startSpeechToText}
            // onPress={() => setIsRecording(!isRecording)} // L'appui sur ce bouton déclenche également le début de l'enregistrement
          >
            <Ionicons name={isRecording ? "pause" : "play"} size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.speechToTextText}>
            {results.map((result, index) => <Text key={index}>{result}</Text>)}
            {/* {isRecording ? 'Enregistrement\nen cours...' : 'Appuyez pour démarrer\nle speech to text'} */}
          </Text>
          {isRecording && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                stopSpeechToText();
                // setIsRecording(false);
                setIsMicrophoneActive(false); // Optionnel : Désactive le microphone
              }}
            >
              <Ionicons name="stop" size={24} color="black" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      )}
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
      <ScrollView
        style={{ width: '100%' }}
        onScroll={() => setShowTags(false)}
        scrollEventThrottle={16}>

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
                value={formValues[getLabelKey(item.label)]?.toString() || ''}
                onChange={(text) => updateFormValue(
                  getLabelKey(item.label),
                  text
                )}
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
  microphoneContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  microphoneButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  microphoneActive: {
    backgroundColor: 'red',
  },
  microphoneInactive: {
    backgroundColor: '#ccc',
  },
  microphoneStatus: {
    fontSize: 16,
    color: '#555',
  },
  speechToTextSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#d9d9d9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  speechToTextText: {
    fontSize: 22,
    color: '#333',
    flex: 1,
    textAlign: 'center',
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