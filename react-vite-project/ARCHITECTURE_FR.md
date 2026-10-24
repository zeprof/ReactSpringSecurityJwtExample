# Guide d'Architecture

Ce projet démontre une application React + Spring Boot avec authentification JWT et contrôle d'accès basé sur les rôles. Il est conçu pour les étudiants apprenant la sécurité de l'authentification web.

## Structure du Projet

```
src/
├── components/           # Composants React UI
│   ├── auth/            # Composants liés à l'authentification
│   │   ├── LoginForm.jsx    # Formulaire de connexion avec validation
│   │   └── Logout.jsx       # Gestionnaire de déconnexion
│   ├── page/            # Pages d'accueil spécifiques aux rôles
│   │   ├── EmprunteurHome.jsx
│   │   ├── PreposeHome.jsx
│   │   └── GestionnaireHome.jsx
│   ├── Header.jsx       # En-tête de navigation avec info utilisateur
│   ├── Footer.jsx       # Pied de page
│   ├── PageLayout.jsx   # Wrapper de disposition principal
│   └── MainContainer.jsx # Contenu de la page d'accueil
├── context/
│   └── AuthContext.jsx  # Gestion de l'état d'authentification (Context API)
├── utils/
│   ├── roleNavigation.js # Mappe les rôles aux routes de page
│   ├── validation.js     # Fonctions de validation de formulaire
│   └── fetcher.js        # Aide de requête HTTP
├── App.jsx              # Application principale avec définitions de routes
└── main.jsx             # Point d'entrée de l'app avec fournisseurs
```

## Flux d'Authentification

### 1. **Chargement Initial de la Page**

Lorsqu'un utilisateur visite l'application pour la première fois :

```
main.jsx
  ↓
AuthProvider (enveloppe l'application entière)
  ↓
App.jsx appelle useEffect → refreshUser()
  ↓
AuthContext vérifie si le token existe dans localStorage
```

### 2. **Rafraîchissement du Token (AuthContext.hydrateUserFromToken)**

Cette fonction s'exécute au démarrage de l'application :

- **Si AUCUN token n'existe** : L'utilisateur est déconnecté, l'état est défini à `null`
- **Si le token existe** : 
  1. Envoie une requête à `/user/me`
  2. Le backend valide le token et retourne les données utilisateur
  3. Les données utilisateur sont stockées dans localStorage et l'état React
  4. Si le token est invalide/expiré, le token est supprimé

### 3. **Flux de Connexion**

L'utilisateur entre son e-mail/mot de passe dans LoginForm :

```
1. Le formulaire valide l'entrée (validateEmail, validatePassword)
2. Envoie POST à /user/login avec les identifiants
3. Le backend retourne un token d'accès
4. Le token est stocké dans localStorage
5. Requête à /user/me pour obtenir les détails utilisateur
6. Les données utilisateur sont stockées dans l'état
7. Redirection vers la page spécifique au rôle (via getNavigationPath)
```

### 4. **Routes Protégées**

Trois mécanismes de protection :

**RequireAuth** : Vérifie si l'utilisateur est connecté
- ✅ Utilisateur connecté → Affiche le composant
- ❌ Utilisateur NON connecté → Redirection vers `/login`
- ⏳ Chargement → Affiche "Chargement..."

**RequireRole** : Vérifie si l'utilisateur a le rôle requis
- ✅ Utilisateur a le rôle → Affiche le composant
- ❌ Utilisateur n'a pas le rôle → Redirection vers `/`
- ⏳ Chargement → Affiche "Chargement..."

**Routes de l'App** : 
- `/` - Public (tout le monde peut visiter)
- `/about` - Public
- `/login` - Public (redirection si déjà connecté)
- `/logout` - Public
- `/emprunteur` - Protégé (ROLE_EMPRUNTEUR, ROLE_GESTIONNAIRE)
- `/prepose` - Protégé (ROLE_PREPOSE, ROLE_GESTIONNAIRE)
- `/gestionnaire` - Protégé (ROLE_GESTIONNAIRE uniquement)

### 5. **Flux de Déconnexion**

```
L'utilisateur clique sur Déconnexion
  ↓
Le composant Logout appelle logout() du AuthContext
  ↓
Le token est supprimé de localStorage
  ↓
L'état utilisateur est défini à null
  ↓
Redirection vers l'accueil ou la connexion
```

## Concepts Clés pour les Étudiants

### **JWT (JSON Web Token)**

Un JWT est un token compact contenant des informations utilisateur encodées. Il est envoyé avec chaque requête pour l'authentification :

```
localStorage.getItem("token") → Ajouté aux requêtes API → Le backend valide → Accorde l'accès
```

**Pourquoi JWT ?** 
- Sans état : Le serveur n'a pas besoin de stocker les sessions
- Fonctionne sur différents serveurs/services
- Contient les données utilisateur (pas besoin de consultation base de données)

### **Context API vs Props**

Cette application utilise React Context au lieu de la transmission de props :

```
❌ Sans Context (transmission de props) :
App → PageLayout → Header → useAuth (6 niveaux de profondeur)

✅ Avec Context :
N'importe quel composant peut appeler useAuth() directement
```

### **Contrôle d'Accès Basé sur les Rôles (RBAC)**

Trois rôles dans cette application :

| Rôle | Accès |
|------|-------|
| ROLE_EMPRUNTEUR | Page Emprunteur |
| ROLE_PREPOSE | Page Personnel |
| ROLE_GESTIONNAIRE | Admin - peut voir toutes les pages |

Le composant `Header` affiche dynamiquement les liens de navigation selon le rôle de l'utilisateur.

## Guide Fichier par Fichier

### `AuthContext.jsx`
- `useAuth()` - Hook personnalisé pour accéder à l'état d'authentification
- `AuthProvider` - Enveloppe l'app, fournit le contexte d'authentification à tous les enfants
- `hydrateUserFromToken()` - Vérifie si l'utilisateur a un token valide au démarrage
- `login()` - Gère la connexion avec e-mail/mot de passe
- `logout()` - Efface le token et l'état utilisateur
- `RequireAuth` - Garde de composant pour les utilisateurs authentifiés
- `RequireRole` - Garde de composant pour les utilisateurs ayant des rôles spécifiques

### `App.jsx`
- Définit toutes les routes en utilisant React Router
- Appelle `refreshUser()` au montage pour restaurer la session
- Utilise `RequireAuth` et `RequireRole` pour protéger les routes

### `LoginForm.jsx`
- Valide l'e-mail et le mot de passe à l'aide de fonctions utilitaires
- Appelle `login()` du AuthContext
- Redirection vers la page spécifique au rôle après une connexion réussie

### `Header.jsx`
- Obtient l'utilisateur actuel du `useAuth()`
- Affiche différents liens de navigation selon le rôle de l'utilisateur
- Affiche les informations utilisateur lorsque connecté

## Questions Courantes des Étudiants

**Q : D'où vient le token JWT ?**
R : L'endpoint `/user/login` du backend le retourne après validation des identifiants.

**Q : Pourquoi stocker le token dans localStorage ?**
R : Pour que l'utilisateur reste connecté même après actualisation de la page. Le token persiste dans localStorage.

**Q : Que se passe-t-il si le token expire ?**
R : Lorsque `hydrateUserFromToken()` s'exécute, le backend rejette le token expiré, il est supprimé de localStorage, et l'utilisateur est déconnecté.

**Q : Pourquoi utiliser Context API ?**
R : Évite la transmission de props. L'état d'authentification est nécessaire à de nombreux endroits, Context le rend accessible partout avec `useAuth()`.

**Q : Comment les rôles sont-ils vérifiés côté backend ?**
R : Le backend valide le token JWT (qui contient le rôle) avant d'autoriser l'accès aux endpoints protégés.

## Exécution de l'Application

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Exécuter les tests
npm test

# Construire pour la production
npm build
```

## Test de l'Authentification

1. **Test du flux de connexion**: 
   - Allez à `/login`
   - Entrez les identifiants (vérifiez le backend pour les utilisateurs de test)
   - Observez le token stocké dans DevTools du navigateur → Application → localStorage

2. **Test des routes protégées** :
   - Essayez d'accéder à `/gestionnaire` sans vous connecter
   - Devrait rediriger vers `/login`

3. **Test de l'accès basé sur les rôles** :
   - Connectez-vous en tant que ROLE_EMPRUNTEUR
   - Essayez d'accéder à `/gestionnaire`
   - Devrait rediriger vers l'accueil (pas de permission)

## Prochaines Étapes d'Apprentissage

1. Vérifiez le code backend pour voir comment les tokens sont générés
2. Explorez la validation de token dans les endpoints backend
3. Comprenez la structure JWT (décodez sur jwt.io)
4. Apprenez les tokens d'actualisation (non présents dans cette version)
5. Explorez la configuration CORS pour la communication frontend-backend
