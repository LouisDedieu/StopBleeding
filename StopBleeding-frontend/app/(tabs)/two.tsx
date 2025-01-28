// TabTwoScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
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
import GeneratePDFButton from './generatePDF';

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

// Interface pour définir la structure d'une section
interface Section {
  type: 'section';
  label: string;
  items: FormItem[];
}

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  groupeSanguin: string;
  observations: string;
}

export default function TabTwoScreen() {
  // États pour gérer la recherche et le filtrage
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    groupeSanguin: '',
    observations: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Rendu des éléments du formulaire
  const renderFormItems = (section: Section) => {
    return section.items.map((item, index) => {
      const commonProps = {
        key: index,
        label: item.label,
        value: formData[item.label.toLowerCase() as keyof FormData] || '',
        onChange: (value: string) => handleInputChange(item.label.toLowerCase(), value),
      };

      switch (item.type) {
        case 'input':
          return <Input {...commonProps} placeholder={item.placeholder} />;
        case 'radio':
          return (
            <View key={index}>
              <Text>{item.label}</Text>
              <RadioButton values={item.values || []} onChange={value => handleInputChange(item.label.toLowerCase(), value)} />
            </View>
          );
        case 'checkbox':
          return <CheckBox {...commonProps} values={item.values || []} />;
        default:
          return null;
      }
    });
  };

  const router = useRouter();
  const { photoUri: paramPhotoUri } = useLocalSearchParams();

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
    }
  ];

  // Liste des tags pour le filtrage
  const tags = patientData.flatMap(section => 
    section.items.map(item => item.label)
  );

  // Effet pour gérer l'URI de la photo
  React.useEffect(() => {
    if (typeof paramPhotoUri === 'string') {
      const validUri = paramPhotoUri.startsWith('file://') ? paramPhotoUri : `file://${paramPhotoUri}`;
      setPhotoUri(validUri);
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
              />
            </View>
          );
        case 'radio':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <RadioButton values={item.values || []} />
            </View>
          );
        case 'checkbox':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <CheckBox values={item.values || []} />
            </View>
          );
        case 'watch-data':
          return (
            <View style={itemStyle}>
              <Text style={styles.label}>{item.label}</Text>
              <WatchDataHistory />
            </View>
          );
        default:
          return null;
      }
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

          {/* Générer PDF Button */}
          <GeneratePDFButton formData={formData} />

          {/* Section photo */}
          <View style={styles.photoSection}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.picture}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.noPicture} />
            )}
            <CustomButton
              text="Prendre une photo"
              onPress={() => router.push('../takePicture')}
            />
          </View>
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
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  noPicture: {
    width: '80%',
    height: 200,
    backgroundColor: 'grey',
    marginBottom: 16,
  },
});