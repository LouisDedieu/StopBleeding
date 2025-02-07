# StopBleeding

## Lancement de l'application

Pour lancer l'application, vous devez cloner le projet en local dans le répertoire de votre choix, puis vous devez vous rendre dans le répertoire StopBleeding/StopBleeding-frontend depuis votre terminal.

Une fois que vous êtes dans le répertoire, vous allez pouvoir exécuter les commandes suivantes :
- npm install : pour installer les dépendances du projet
- npx expo install @react-native-voice/voice expo-dev-client : permet d'installer les dépendances nécessaires au speech-to-text
- npm install -g eas-cli : pour installer eas-cli qui permet de gérer, construire et déployer des applications Expo
- eas login : pour vous connecter au cli
- eas build:configure : pour configurer un environnement de build (vous pouvez target lorsqu'on vous le demande "All")
- eas build -p ios --profile development --local : pour build l'application

Une fois le buil de l'application effectué, un fichier .tar.gz a du apparaître dans votre projet. Vous allez pouvoir le dézipper en double cliquant dessus.

Puis, vous allez pouvoir ouvrir un émulateur d'iPhone (nos tests ont été réalisés sur un émulateur d'iPhone 16), et vous allez pouvoir drag and drop le fichier résultant du dézip du fichier .tar.gz. Cela pour effet d'installer l'application sur l'émulateur.

Une fois que l'application est installée sur votre émulateur, vous pouvez cliquer dessus et la tester !

## Répartition du travail

L'ensemble de l'équipe a contribué de manière équivalente tout au long du projet, en partageant les tâches et les responsabilités de façon équilibrée, ce qui justifie une même évaluation pour chacun des membres.  
BARATLI Wassim : 16.5%  
CAUSER Clervie : 16.5%  
DEDIEU Louis : 16.5%  
MENDES Léo : 16.5%  
ORIOL Julien : 16.5%  
PELLEGRINI Romain : 16.5%  
