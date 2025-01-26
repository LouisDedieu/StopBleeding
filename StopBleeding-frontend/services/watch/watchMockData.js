// mockWatchData.js

// Fonction pour générer un nombre aléatoire dans une plage donnée
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Classe pour simuler les données de la montre
export class WatchDataSimulator {

  constructor() {
    // Valeurs initiales réalistes
    this.heartRate = 75;
    this.oxygenLevel = 98;
    this.lastUpdate = new Date();
    
    // Historique des données
    this.heartRateHistory = [];
    this.stepsHistory = [];
    this.completeHistory = [];
  }

  // Simule la mise à jour des données en temps réel
  updateData() {
    // Simulation d'un rythme cardiaque réaliste qui varie légèrement
    this.heartRate = Math.max(60, Math.min(100, 
      this.heartRate + randomInRange(-2, 2)
    ));

    // Augmentation progressive des pas
    this.steps += randomInRange(10, 30);

    // Mise à jour des calories (basée sur les pas)
    this.calories = Math.floor(this.steps * 0.05);

    // Légère variation du niveau d'oxygène
    this.oxygenLevel = Math.max(95, Math.min(100,
      this.oxygenLevel + randomInRange(-1, 1)
    ));

    // Variation du niveau de stress
    this.stress = Math.max(0, Math.min(100,
      this.stress + randomInRange(-5, 5)
    ));

    // Mise à jour de l'horodatage
    this.lastUpdate = new Date();

    // Sauvegarde de l'historique
    this.heartRateHistory.push({
      timestamp: this.lastUpdate.toISOString(),
      value: this.heartRate
    });

    this.stepsHistory.push({
      timestamp: this.lastUpdate.toISOString(),
      value: this.steps
    });

    // Garde uniquement les 24 dernières heures de données
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.heartRateHistory = this.heartRateHistory.filter(
      item => new Date(item.timestamp) > oneDayAgo
    );
    this.stepsHistory = this.stepsHistory.filter(
      item => new Date(item.timestamp) > oneDayAgo
    );

    const historyEntry = {
        timestamp: this.lastUpdate,
        heartRate: this.heartRate,
        oxygenLevel: this.oxygenLevel,
      };
  
      this.completeHistory.push(historyEntry);
      
      // Garder seulement les 50 dernières entrées
      if (this.completeHistory.length > 50) {
        this.completeHistory = this.completeHistory.slice(-50);
      }
  
      return {
        ...this.getCurrentData(),
        completeHistory: this.completeHistory,
      };  }

  // Récupère les données actuelles
  getCurrentData() {
    return {
      heartRate: this.heartRate,
      oxygenLevel: this.oxygenLevel,
      lastUpdate: this.lastUpdate,
      completeHistory: {
        timestamps: this.heartRateHistory.map(item => item.timestamp),
        heartRate: this.heartRate,
        oxygenLevel: this.oxygenLevel,
      }
    };
  }
}