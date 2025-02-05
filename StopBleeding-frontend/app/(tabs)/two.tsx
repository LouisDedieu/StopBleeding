import {Button, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ScrollView, Text, View } from '@/components/Themed';
import React, { useState, useEffect } from 'react';
import Voice from '@react-native-voice/voice';
import Input from '@/components/Input';
import CheckBox from '@/components/CheckBox';
import RadioButton from '@/components/RadioButton';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomButton from "@/components/CustomButton";
import WatchDashboard from '@/components/WatchDashboard';
import WatchDataHistory from '@/components/WatchDataHistory';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from '@react-navigation/native'; // Importer useIsFocused
// Interface pour définir la structure d'un élément de formulaire
interface FormItem {
  type: string;
  label: string;
  placeholder?: string;
  number?: boolean;
  values?: string[];
  priority?: 'high' | 'normal';
  multiline?: boolean;
}
interface FormState {
  [key: string]: string | string[] | undefined;
}

// Interface pour définir la structure d'une section
interface Section {
  type: 'section';
  label: string;
  items: FormItem[];
}

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
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  let [isRecording, setIsRecording] = useState(false);
  let [results, setResults] = useState([]);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const router = useRouter();
  const { photoUri: paramPhotoUri } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormState>({});

  const isFocused = useIsFocused();
  React.useEffect(() => {
    const saveData = async () => {
      if (Object.keys(formData).length > 0) {
        try {
          await AsyncStorage.setItem('formData', JSON.stringify(formData));
        } catch (e) {
          console.error('Erreur lors de la sauvegarde des données :', e);
        }
      }
    };
    saveData();
  }, [formData]);

// Charger les données depuis AsyncStorage
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('formData');
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (e) {
        console.error('Erreur lors du chargement des données :', e);
      }
    };
    loadData();
  }, []);
  const handleInputChange = (label: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [label]: value
    }));
  };
  // Définition des données du formulaire avec une structure organisée pour les pompiers

  const patientData: Section[] = [
    {
      type: 'section',
      label: 'Photo de l\'intervention',
      items: [
        {
          type: 'photo',
          label: 'Photos',
        },
      ]
    },
    {
      type: 'section',
      label: 'Identité & Urgence',
      items: [
        { type: 'input', label: 'Nom', placeholder: 'Doe', priority: 'high' },
        { type: 'input', label: 'Prenom', placeholder: 'John', priority: 'high' },
        { type: 'input', label: 'Age', number: true, priority: 'high' },
        { type: 'radio', label: 'Niveau de conscience', values: ['Conscient', 'Semi-conscient', 'Inconscient'], priority: 'high' },
        { type: 'radio', label: 'Groupe sanguin', values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], priority: 'high' },
      ]
    },
    {
      type: 'section',
      label: 'Constantes Vitales',
      items: [
        { type: 'watch-data', label: 'Données vitales (Watch)' },
        { type: 'input', label: 'Tension artérielle', placeholder: '120/80' },
        { type: 'input', label: 'Température', placeholder: '37.2', number: true },
        { type: 'input', label: 'Score de Glasgow', placeholder: '15', number: true },
      ]
    },
    {
      type: 'section',
      label: 'Évaluation ATCD',
      items: [
        { 
          type: 'checkbox', 
          label: 'Allergies graves',
          values: ['Pénicilline', 'Latex', 'Morphine', 'Iode', 'Autres'],
          priority: 'high'
        },
        {
          type: 'checkbox',
          label: 'Antécédents critiques',
          values: ['Diabète', 'Cardiaque', 'Épilepsie', 'AVC', 'Respiratoire']
        },
        { type: 'input', label: 'Traitements en cours', multiline: true },
      ]
    },
    {
      type: 'section',
      label: 'Évaluation Incident',
      items: [
        {
          type: 'radio',
          label: 'Mécanisme lésionnel',
          values: ['Traumatisme', 'Malaise', 'Brûlure', 'Intoxication', 'Autre']
        },
        {
          type: 'checkbox',
          label: 'Zones touchées',
          values: ['Tête', 'Thorax', 'Abdomen', 'Membres sup.', 'Membres inf.', 'Dos']
        },
        { type: 'input', label: 'Heure de début', placeholder: 'HH:MM' },
        { type: 'input', label: 'Circonstances', multiline: true },
      ]
    },
    {
      type: 'section',
      label: 'Interventions réalisées',
      items: [
        {
          type: 'checkbox',
          label: 'Gestes effectués',
          values: ['PLS', 'MCE', 'O2', 'Pansement', 'Immobilisation', 'Autre']
        },
        { type: 'input', label: 'Médicaments administrés', multiline: true },
        { type: 'input', label: 'Observations', multiline: true },
      ]
    }
  ];

  // Liste des tags pour le filtrage
  const tags = patientData.flatMap(section => 
    section.items.map(item => item.label)
  );
  React.useEffect(() => {
    if (isFocused) {
      const loadData = async () => {
        try {
          const savedData = await AsyncStorage.getItem('formData');

          if (savedData) {
            setFormData(JSON.parse(savedData));
          }else{
            setFormData({})
          }
        } catch (e) {
          console.error('Erreur lors du chargement des données :', e);
        }
      };
      loadData();
    }
  }, [isFocused]);

  React.useEffect(() => {
    const loadPhotos = async () => {
      try {
        const savedPhotos = await AsyncStorage.getItem('photos');
        if (savedPhotos) {
          setPhotoUris(JSON.parse(savedPhotos));
        }else{
          setPhotoUris({});
        }
      } catch (e) {
        console.error('Erreur lors du chargement des photos:', e);
      }
    };

    if (isFocused) {
      loadPhotos();
    }
  }, [isFocused]);



  React.useEffect(() => {
    const savePhotos = async () => {
      try {
        await AsyncStorage.setItem('photos', JSON.stringify(photoUris));
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des photos:', e);
      }
    };

    if (photoUris.length > 0) {
      savePhotos();
    }
  }, [photoUris]);

  React.useEffect(() => {
    if (typeof paramPhotoUri === 'string') {
      const validUri = paramPhotoUri.startsWith('file://') ? paramPhotoUri : `file://${paramPhotoUri}`;
      setPhotoUris((prevUris) => {
        // Vérifier si la photo n'existe pas déjà
        if (!prevUris.includes(validUri)) {
          return [...prevUris, validUri];
        }
        return prevUris;
      });
    }
  }, [paramPhotoUri]);

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Gestion de la recherche
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // Gestion des tags
  const toggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const toggleMicrophone = () => {
    setIsMicrophoneActive(!isMicrophoneActive);
    // Vous pouvez ajouter ici des actions comme démarrer/arrêter l'enregistrement audio
  };

  // const filteredData = patientData.filter(item => {
  //   const labelMatch = item.label.toLowerCase().includes(searchText.toLowerCase())
  //   const valuesMatch = item.values?.some(value => value.toLowerCase().includes(searchText.toLowerCase()))
  //   const tagMatch = selectedTags.length === 0 || selectedTags.includes(item.label)
  //   return (labelMatch || valuesMatch) && tagMatch
  // })

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
  // Composant pour rendu d'une section
  const SectionComponent: React.FC<{ section: Section }> = ({ section }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const renderItem = (item: FormItem) => {
      const isHighPriority = item.priority === 'high';
      const itemStyle = isHighPriority ? [styles.formItem, styles.highPriority] : styles.formItem;

      switch (item.type) {
        case 'input':
          return (
            <View style={itemStyle}>
              <Input
                label={item.label}
                placeholder={item.placeholder}
                number={item.number}
                value={formValues[getLabelKey(item.label)]?.toString() || ''}
                onChange={(text) => {
                  updateFormValue(
                    getLabelKey(item.label),
                    text
                  );
                  handleInputChange(item.label, text);
              }}
              />
            </View>
          );
        case 'radio':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <RadioButton values={item.values || []}  selectedValue={formData[item.label] as string}
                           onValueChange={(value) => handleInputChange(item.label, value)}/>
            </View>
          );
        case 'checkbox':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <CheckBox
                  values={item.values || []}
                  selectedValues={formData[item.label] as string[] || []}
                  onValuesChange={(values) => handleInputChange(item.label, values)}
              />
            </View>
          );
        case 'watch-data':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <WatchDataHistory />
            </View>
          );
        case 'photo':
          return (
              <View style={styles.photoSection}>
                <CustomButton
                    text="Prendre une photo"
                    onPress={handleTakePhoto}
                />
                {photoUris.length > 0 ? (
                    <View style={styles.photoGrid}>
                      {photoUris.map((uri, index) => (
                          <Image
                              key={index}
                              source={{ uri }}
                              style={styles.picture}
                              resizeMode="contain"
                          />
                      ))}
                    </View>
                ) : (
                    <View style={styles.noPicture} />
                )}

              </View>
          );

        default:
          return null;
      }
    };
    const handleTakePhoto = async() => {
      // Sauvegarder l'état actuel avant la navigation
      try {
        await AsyncStorage.setItem('formData', JSON.stringify(formData));
      } catch (e) {
        console.error('Erreur lors de la sauvegarde des données :', e);
      }
      router.push('../takePicture');
    };
    return (
      <View style={styles.sectionContainer}>
        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text style={styles.sectionTitle}>{section.label}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#2563eb" 
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.sectionContent}>
            {section.items.map((item, index) => (
              <View key={index}>
                {renderItem(item)}
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  // Filtrage des sections et items selon la recherche et les tags sélectionnés
  const filteredSections = patientData.map(section => ({
    ...section,
    items: section.items.filter(item => {
      const labelMatch = item.label.toLowerCase().includes(searchText.toLowerCase());
      const valuesMatch = item.values?.some(value => 
        value.toLowerCase().includes(searchText.toLowerCase())
      );
      const tagMatch = selectedTags.length === 0 || selectedTags.includes(item.label);
      return (labelMatch || valuesMatch) && tagMatch;
    })
  })).filter(section => section.items.length > 0);

  return (
    <View style={styles.container}>
      {/* Contenu défilant */}
      <View style={styles.contentContainer}>
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
        
        {/* Barre de recherche et filtres */}
        <View style={styles.searchContainer}>
          <SearchBar onSearch={handleSearch} />
          <TouchableOpacity 
            onPress={() => setShowTags(!showTags)} 
            style={styles.toggleButton}
          >
            <Ionicons 
              name={showTags ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="gray" 
            />
          </TouchableOpacity>
        </View>

        {showTags && (
          <TagFilter 
            tags={tags} 
            selectedTags={selectedTags} 
            toggleTag={toggleTag} 
          />
        )}

        {/* En-tête fixe avec le dashboard */}
      <View style={styles.watchContainer}>
        <WatchDashboard />
      </View>


        {/* Contenu principal défilant */}
        <ScrollView
          style={styles.scrollView}
          onScroll={() => setShowTags(false)}
          scrollEventThrottle={16}
        >
          {filteredSections.map((section, index) => (
            <SectionComponent key={index} section={section} />
          ))}


        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  watchContainer: {
    height: 200,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  contentContainer: {
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
    width: 50,
    height: 50,
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
    marginBottom: 8,
  },
  toggleButton: {
    padding: 8,
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  sectionContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  sectionContent: {
    padding: 16,
  },
  formItem: {
    marginBottom: 16,
  },
  highPriority: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  photoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },photoGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  picture: {
    width: Dimensions.get('window').width * 0.35,
    height: 200,
    marginBottom: 10,
  },
  noPicture: {
    width: '80%',
    height: 200,
    backgroundColor: 'grey',
    marginBottom: 16,
  },
  scrollViewPhoto:{
    flex :1,
    flexDirection:"row",
    gap:20,
    width:"100%",
    height:300,
    marginBottom: 16,
  }
});