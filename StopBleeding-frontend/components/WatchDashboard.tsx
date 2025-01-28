import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'recharts';
import { WatchDataSimulator } from '../services/watch/watchMockData';

interface HistoryEntry {
    timestamp: Date;
    heartRate: number;
    oxygenLevel: number;
  }
  
  interface WatchData {
    heartRate: number;
    oxygenLevel: number;
    lastUpdate: Date;
    completeHistory: HistoryEntry[];
  }

const WatchDashboard = () => {
  // État pour stocker les données de la montre
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  // Instance du simulateur
  const [simulator] = useState(new WatchDataSimulator());

  // Effet pour mettre à jour les données toutes les 2 secondes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newData = simulator.updateData();
      setWatchData(newData);
    }, 2000);

    return () => clearInterval(updateInterval);
  }, [simulator]);

  if (!watchData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Données de santé en direct</Text>
        <Text style={styles.headerSubtitle}>
          Dernière mise à jour: {new Date(watchData.lastUpdate).toLocaleTimeString()}
        </Text>
      </View>

      {/* Cartes des métriques principales */}
      <View style={styles.metricsContainer}>
        {/* Rythme cardiaque */}
        <View style={styles.metricWrapper}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>Rythme Cardiaque</Text>
            <View style={styles.metricValueContainer}>
              <Text style={[styles.metricValue, styles.heartRateColor]}>
                {watchData.heartRate}
              </Text>
              <Text style={styles.metricUnit}> bpm</Text>
            </View>
          </View>
        </View>

        {/* Niveau d'oxygène */}
        <View style={styles.metricWrapper}>
          <View style={styles.metricCard}>
            <Text style={styles.metricTitle}>SpO2</Text>
            <View style={styles.metricValueContainer}>
              <Text style={[styles.metricValue, styles.oxygenColor]}>
                {watchData.oxygenLevel}
              </Text>
              <Text style={styles.metricUnit}>%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

// Définition des styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafb',
        maxHeight: 180, // Limite la hauteur
      },
      metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 8,
      },
      metricWrapper: {
        width: '45%', // Un peu plus étroit pour un meilleur espacement
      },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 256,
  },
  loadingText: {
    fontSize: 18,
  },
  header: {
    padding: 16,
    backgroundColor: '#2563eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    color: '#6b7280',
  },
  heartRateColor: {
    color: '#ef4444',
  },
  oxygenColor: {
    color: '#3b82f6',
  },
});

export default WatchDashboard;