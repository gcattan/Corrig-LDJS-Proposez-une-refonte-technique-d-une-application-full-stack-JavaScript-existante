# p9-dfsjs — Solution de référence

> Repository PRIVÉ — Usage formateur uniquement.

## Ce que contient ce repository

Ce repository est identique au starter étudiant, avec un ajout clé :

### `db/new-schema/schema-cible.sql`

Script SQL de référence pour l'Exercice 2 (Conception de l'architecture).

Il modélise la future base de données relationnelle MySQL 8 de LiVrai :

| Table | Rôle |
|---|---|
| `users` | Authentification + rôles (client, commercial, livraison) |
| `clients` | Profil métier des entreprises clientes |
| `deliveries` | Commandes de livraison avec cycle de vie complet |
| `invoices` | Facturation liée aux clients et aux livraisons |

### Pourquoi cette séparation `users` / `clients` ?

L'application existante (starter) fusionne utilisateur et client dans une seule table. La solution cible les sépare pour :
- Permettre des utilisateurs sans profil client (rôles commercial et livraison)
- Isoler les données d'authentification des données métier
- Faciliter la scalabilité (ajout de nouveaux rôles sans refonte)

## Structure du starter (inchangée)

Le code de l'application existante à auditer est **intentionnellement monolithique** (backend en `server.js` unique, raw mysql2, pas d'ORM, pas de couches séparées). C'est l'objet de l'audit de l'Exercice 1.
