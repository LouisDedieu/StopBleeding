import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, View } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Print from 'expo-print'; 

const GeneratePDFButton = ({ formData }: { formData: any }) => {
  const generatePDF = async () => {
    console.log('Début de la génération du PDF...');
    try {
      // Template HTML pour générer le PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              p { font-size: 14px; line-height: 1.6; color: #555; }
              .section { margin-bottom: 20px; }
              .title { font-weight: bold; font-size: 16px; margin-bottom: 5px; }
            </style>
          </head>
          <body>
            <h1>Résumé du formulaire</h1>
            <div class="section">
              <div class="title">Nom :</div>
              <p>${formData.nom || 'Non renseigné'}</p>
            </div>
            <div class="section">
              <div class="title">Prénom :</div>
              <p>${formData.prenom || 'Non renseigné'}</p>
            </div>
            <div class="section">
              <div class="title">Âge :</div>
              <p>${formData.age || 'Non renseigné'}</p>
            </div>
            <div class="section">
              <div class="title">Groupe Sanguin :</div>
              <p>${formData.groupeSanguin || 'Non renseigné'}</p>
            </div>
            <div class="section">
              <div class="title">Autres informations :</div>
              <p>${formData.observations || 'Non renseigné'}</p>
            </div>
          </body>
        </html>
      `;

      // Options pour le PDF
      const options = {
        html: htmlContent,
        fileName: 'formulaire_rempli',
        directory: 'Documents', // Sauvegarde dans le dossier Documents
      };

      console.log('Options configurées :', options);
      // Générer le PDF
      //const file = await RNHTMLtoPDF.convert(options);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log('PDF généré avec succès :');

      // Confirmation de la génération
      Alert.alert('Succès', `PDF généré : `);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
      Alert.alert('Erreur', 'La génération du PDF a échoué.');
    }
  };

  return (
    <TouchableOpacity onPress={generatePDF} style={styles.button}>
      <Text style={styles.buttonText}>Générer PDF</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GeneratePDFButton;
