# ASMC

## Présentation
Ce projet est une application de streaming musical développée avec **Vue.js** côté client et **Node.js/Express** côté serveur, utilisant une base de données **MySQL**. Les utilisateurs peuvent s'inscrire, se connecter, créer des playlists, liker des titres, discuter en temps réel et écouter de la musique.
Ce projet à été réalisé lors de ma seconde année de BTS SIO afin de la présenter lors de mon examen oral.

## Fonctionnalités

- **Authentification** : Inscription, connexion, gestion de session.
- **Playlists** : Création, affichage, gestion des playlists personnelles.
- **Titres likés** : Ajout et consultation des titres favoris.
- **Recherche** : Recherche de titres par nom ou artiste.
- **Lecture audio** : Lecteur intégré avec contrôle du volume et navigation dans les titres.
- **Chat** : Messagerie en temps réel entre utilisateurs.
- **Notifications** : Alertes pour nouveaux messages et événements.
- **Profil utilisateur** : Affichage des informations et playlists récentes.

---

## Installation

### Prérequis

- Node.js & npm
- MySQL

### Étapes

1. **Cloner le dépôt**
   ```bash
   git clone <url-du-repo>
   cd <nom-du-projet>
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer la base de données**
   - Créez une base de données MySQL nommée `site_streamingSwann`.
   - Mettez à jour les identifiants dans `src/server/database/config.js` si nécessaire.

4. **Lancer le serveur**
   ```bash
   npm run start
   ```

5. **Lancer le client**
   ```bash
   npm run dev
   ```

---

## Structure du projet

- `src/client/` : Frontend Vue.js
  - `views/` : Pages principales (Accueil, Connexion, Profil, etc.)
  - `components/` : Composants réutilisables (Lecteur, Cartes, etc.)
  - `store/` : Gestion d'état avec Pinia
- `src/server/` : Backend Express
  - `database/` : Configuration et accès MySQL
  - `router/` : Routes API

---

## Configuration

- Les variables sensibles (mot de passe, secret JWT) sont définies dans `src/server/database/config.js`.
- Les routes API sont accessibles sous `/api/auth/` et `/api/lookup`.

---

## Utilisation

- Accédez à l'application via `http://localhost:3000` (ou le port configuré).
- Inscrivez-vous ou connectez-vous pour accéder aux fonctionnalités.
- Créez des playlists, likez des titres et discutez avec d'autres utilisateurs.

---

## Dépendances principales

- **Vue.js**
- **Pinia**
- **Express**
- **MySQL2**
- **bcrypt**
- **jsonwebtoken**
- **Socket.io**
---
