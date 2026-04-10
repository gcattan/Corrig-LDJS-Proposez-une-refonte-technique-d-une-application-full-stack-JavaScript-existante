# LiVrai — CRM de gestion des livraisons

Application web de gestion des commandes et livraisons pour les professionnels.

## Prérequis

- [Node.js 20 LTS](https://nodejs.org/)
- [MySQL 8](https://dev.mysql.com/downloads/)
- npm

## Installation

### 1. Base de données

Créer la base de données et appliquer le schéma :

```bash
mysql -u root -p -e "CREATE DATABASE livrai;"
mysql -u root -p livrai < db/init-script.sql
```

Créer un compte administrateur :

```sql
INSERT INTO users (email, name, password, role)
VALUES ('admin@livrai.fr', 'Admin LiVrai', '$2b$10$<hash_bcrypt>', 'admin');
```

> Le mot de passe doit être hashé avec bcrypt. Utiliser un outil en ligne ou un script Node.js pour générer le hash.

### 2. Backend

```bash
cd backend
cp .env.example .env
# Renseigner les variables dans .env
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'interface est accessible sur `http://localhost:5173`.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite 5 + Tailwind CSS 3 |
| Backend | Node.js 20 LTS + Express 4 |
| Base de données | MySQL 8 |
| Auth | JWT + bcrypt |

## Structure du projet

```
p9-dfsjs-starter/
├── db/
│   ├── init-script.sql       # Schéma de la base de données existante
│   └── new-schema/           # Scripts SQL pour la nouvelle architecture
├── backend/
│   ├── server.js             # Serveur Express + routes API
│   ├── .env.example          # Variables d'environnement
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx            # Routing principal
    │   ├── components/        # Composants réutilisables
    │   └── pages/             # Pages de l'application
    ├── vite.config.js
    └── package.json
```

## API

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/login` | Connexion | Public |
| GET | `/api/users` | Liste des clients | Admin |
| POST | `/api/users` | Créer un client | Admin |
| GET | `/api/deliveries` | Liste des livraisons | Authentifié |
| POST | `/api/deliveries` | Créer une livraison | Client |
| PUT | `/api/deliveries/:id` | Mettre à jour une livraison | Admin |

## Licence

ISC
