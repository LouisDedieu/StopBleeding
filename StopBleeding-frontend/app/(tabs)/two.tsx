// TabTwoScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { ScrollView, Text, View } from '@/components/Themed';
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

export default function TabTwoScreen() {
  // États pour gérer la recherche et le filtrage
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const router = useRouter();
  const { photoUri: paramPhotoUri } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormState>({});

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
      label: 'Identité & Urgence',
      items: [
        { type: 'input', label: 'Nom', placeholder: 'Doe', priority: 'high' },
        { type: 'input', label: 'Prénom', placeholder: 'John', priority: 'high' },
        { type: 'input', label: 'Âge', number: true, priority: 'high' },
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
    },
    {
      type: 'section',
      label: 'Photo de l\'intervention',
      items: [
        {
          type: 'photo',
          label: 'Photos',
        },
      ]
    }
  ];

  // Liste des tags pour le filtrage
  const tags = patientData.flatMap(section => 
    section.items.map(item => item.label)
  );


  React.useEffect(() => {
    if (typeof paramPhotoUri === 'string') {
      const validUri = paramPhotoUri.startsWith('file://') ? paramPhotoUri : `file://${paramPhotoUri}`;
      setPhotoUris((prevUris) => {
        console.log("deja : " + prevUris[0]?.toLowerCase());
        console.log("new : " + paramPhotoUri.toLowerCase());
        return [...prevUris, validUri.toString()];
      });
    }
  }, [paramPhotoUri]);

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
                value={formData[item.label] as string}
                onChangeText={(value) => handleInputChange(item.label, value)}
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
                {photoUris.length > 0 ? (
                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.scrollViewPhoto}
                    >
                      {photoUris.map((uri, index) => (
                          <Image
                              key={index}
                              source={{ uri }}
                              style={styles.picture}
                              resizeMode="contain"
                          />
                      ))}
                    </ScrollView>
                ) : (
                    <View style={styles.noPicture} />
                )}
                <CustomButton
                    text="Prendre une photo"
                    onPress={handleTakePhoto}
                />
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
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  picture: {
    width: '45%',
    height: 300,
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