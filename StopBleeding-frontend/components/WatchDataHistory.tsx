// components/WatchDataHistory.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { WatchDataSimulator } from '../services/watch/watchMockData';

interface HistoryEntry {
  timestamp: number;
  heartRate: number;
  oxygenLevel: number;
}

const WatchDataHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [simulator] = useState(new WatchDataSimulator());

  useEffect(() => {
    const updateInterval = setInterval(() => {
      const newData = simulator.updateData();
      if (newData.completeHistory) {
        setHistory(newData.completeHistory);
      }
    }, 2000);

    return () => clearInterval(updateInterval);
  }, [simulator]);

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.dateCell]}>Date/Heure</Text>
        <Text style={[styles.headerCell, styles.valueCell]}>Rythme Card.</Text>
        <Text style={[styles.headerCell, styles.valueCell]}>SpO2</Text>
      </View>

      {history.slice().reverse().slice(0, 10).map((entry, index) => (
        <View key={index} style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
          <Text style={[styles.cell, styles.dateCell]}>
            {format(new Date(entry.timestamp), 'HH:mm:ss')}
          </Text>
          <Text style={[styles.cell, styles.valueCell, styles.heartRateText]}>
            {entry.heartRate} bpm
          </Text>
          <Text style={[styles.cell, styles.valueCell, styles.oxygenText]}>
            {entry.oxygenLevel}%
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#4b5563',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cell: {
    fontSize: 14,
  },
  dateCell: {
    flex: 2,
    paddingLeft: 8,
  },
  valueCell: {
    flex: 1,
    textAlign: 'center',
  },
  evenRow: {
    backgroundColor: '#ffffff',
  },
  oddRow: {
    backgroundColor: '#f9fafb',
  },
  heartRateText: {
    color: '#ef4444',
  },
  oxygenText: {
    color: '#3b82f6',
  },
});

export default WatchDataHistory;