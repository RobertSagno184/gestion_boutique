# Gestion Boutique - Application de Gestion pour Styliste/Couturier

Application web PWA (Progressive Web App) pour la gestion d'une entreprise de stylisme et couture, optimisée pour mobile.

## 🚀 Fonctionnalités

- **Suivi des ventes** : Enregistrement rapide des ventes en boutique
- **Gestion des ouvriers** : Suivi des tâches et paiements
- **Stock automatique** : Mise à jour auto du stock après vente
- **Tableau de bord financier** : Bilan quotidien en temps réel
- **Rapports** : Rapports financiers et analyses

## 🛠️ Technologies

- **Angular 19+** avec standalone components
- **Firebase** (Firestore, Auth, Storage)
- **TailwindCSS** pour le styling mobile-first
- **PWA** avec service worker
- **TypeScript**

## 📋 Prérequis

- Node.js 18+ et npm
- Compte Firebase avec projet configuré

## 🔧 Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Configurer Firebase**

   - Créer un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
   - Activer Authentication (Email/Password)
   - Créer une base de données Firestore
   - Copier les credentials Firebase dans `src/app/core/services/firebase/firebase.config.ts`

3. **Configurer les règles Firestore**

   Les règles de sécurité sont définies dans `firestore.rules`. Déployez-les avec :
```bash
firebase deploy --only firestore:rules
```

## 🚀 Développement

```bash
# Démarrer le serveur de développement
npm start

# Build pour la production
npm run build:prod
```

L'application sera accessible sur `http://localhost:4200`

## 📱 PWA

L'application est configurée comme PWA. Pour tester en local :

```bash
# Build en production
npm run build:prod

# Servir avec un serveur HTTP (ex: http-server)
npx http-server -p 8080 -c-1 dist/gestion_boutique/browser
```

## 🚢 Déploiement

### Firebase Hosting

1. **Installer Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Se connecter à Firebase**
```bash
firebase login
```

3. **Initialiser Firebase (si pas déjà fait)**
```bash
firebase init hosting
```

4. **Build et déployer**
```bash
npm run build:prod
firebase deploy --only hosting
```

### Configuration Firebase

1. Créer un projet Firebase
2. Activer :
   - Authentication (Email/Password)
   - Firestore Database
   - Storage (optionnel)
3. Mettre à jour `src/app/core/services/firebase/firebase.config.ts` avec vos credentials

## 📁 Structure du Projet

```
src/app/
├── core/              # Services globaux, guards, interceptors
├── features/          # Modules fonctionnels (lazy loaded)
│   ├── dashboard/
│   ├── sales/
│   ├── workers/
│   ├── inventory/
│   └── reports/
├── shared/            # Composants et utilitaires partagés
├── auth/             # Module d'authentification
└── layouts/          # Layouts de pages
```

## 🔐 Sécurité

- Routes protégées par `authGuard`
- Règles Firestore pour la sécurité des données
- Validation côté client et serveur
- Protection XSS intégrée Angular

## 📱 Optimisations Mobile

- Design mobile-first avec TailwindCSS
- Navigation adaptative (bottom nav sur mobile, sidebar sur desktop)
- Touch-friendly (boutons minimum 44x44px)
- Service worker pour cache offline
- Images optimisées et lazy loading

## 📝 Notes

- Les données sont stockées dans Firestore
- L'authentification utilise Firebase Auth
- Le service worker permet un fonctionnement offline basique
- Les images doivent être optimisées (WebP recommandé)

## 🐛 Dépannage

### Erreur Firebase
Vérifiez que les credentials Firebase sont correctement configurés dans `firebase.config.ts`

### Service Worker ne fonctionne pas
Assurez-vous de build en production : `npm run build:prod`

### Erreurs de lint
Exécutez `npm run lint` pour voir les erreurs

## 📄 Licence

Propriétaire - Tous droits réservés
