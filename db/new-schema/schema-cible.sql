-- =============================================================================
-- LiVrai CRM — Schéma MySQL 8 cible
-- Généré dans le cadre de l'Exercice 2 (Conception de l'architecture)
-- =============================================================================
-- Ce schéma constitue une réponse de référence pour l'exercice.
-- Il reflète les besoins fonctionnels de LiVrai :
--   - 3 types d'utilisateurs : client, commercial, livraison
--   - Gestion des comptes clients
--   - Commande et suivi des livraisons
--   - Gestion de la facturation
--   - Historique des livraisons
-- =============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- Table : users
-- Gère l'authentification et les rôles du système.
-- Séparée de `clients` pour permettre plusieurs rôles (commercial, livraison)
-- sans entité client associée.
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('client', 'commercial', 'livraison') NOT NULL DEFAULT 'client',
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table : clients
-- Représente les entreprises clientes de LiVrai.
-- Liée à `users` via user_id : un compte client = un utilisateur + un profil client.
-- Permet au service commercial de créer des comptes pour certains clients.
-- -----------------------------------------------------------------------------
CREATE TABLE clients (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT           NOT NULL UNIQUE,
  company_name  VARCHAR(255)  NOT NULL,
  contact_name  VARCHAR(255)  NOT NULL,
  phone         VARCHAR(20)   DEFAULT NULL,
  address       TEXT          DEFAULT NULL,
  city          VARCHAR(100)  DEFAULT NULL,
  postal_code   VARCHAR(10)   DEFAULT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table : deliveries
-- Représente les commandes de livraison passées par les clients.
-- Statuts étendus pour couvrir le cycle de vie complet d'une livraison.
-- Liée à `clients` (entité métier) et non à `users` directement.
-- -----------------------------------------------------------------------------
CREATE TABLE deliveries (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  client_id         INT              NOT NULL,
  volume            INT              NOT NULL COMMENT 'En m³',
  weight            DECIMAL(10,2)    NOT NULL COMMENT 'En kg',
  pickup_address    TEXT             NOT NULL,
  delivery_address  TEXT             NOT NULL,
  status            ENUM(
                      'En attente',
                      'Acceptée',
                      'Refusée',
                      'En cours',
                      'Terminée',
                      'Annulée'
                    ) NOT NULL DEFAULT 'En attente',
  notes             TEXT             DEFAULT NULL,
  requested_at      TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  scheduled_at      TIMESTAMP        NULL,
  delivered_at      TIMESTAMP        NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Table : invoices
-- Représente les factures associées aux livraisons.
-- Une livraison peut générer une facture ; une facture est toujours liée à un client.
-- -----------------------------------------------------------------------------
CREATE TABLE invoices (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_id     INT             NOT NULL,
  delivery_id   INT             DEFAULT NULL,
  amount        DECIMAL(10,2)   NOT NULL,
  status        ENUM('En attente', 'Payée', 'Annulée') NOT NULL DEFAULT 'En attente',
  issued_at     TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  due_date      DATE            NOT NULL,
  paid_at       TIMESTAMP       NULL,
  FOREIGN KEY (client_id)   REFERENCES clients(id)    ON DELETE CASCADE,
  FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Données de test (optionnel — pour valider le schéma)
-- =============================================================================

-- Utilisateurs de test
INSERT INTO users (email, password_hash, role) VALUES
  ('admin@livrai.fr',    '$2b$10$hashedpassword1', 'commercial'),
  ('transport@livrai.fr','$2b$10$hashedpassword2', 'livraison'),
  ('client1@example.com','$2b$10$hashedpassword3', 'client');

-- Client de test
INSERT INTO clients (user_id, company_name, contact_name, phone, address, city, postal_code) VALUES
  (3, 'Dupont & Fils SARL', 'Jean Dupont', '0601020304', '12 rue de la Paix', 'Paris', '75001');

-- Livraison de test
INSERT INTO deliveries (client_id, volume, weight, pickup_address, delivery_address, status) VALUES
  (1, 10, 250.00, '5 avenue des Entrepôts, Lyon', '12 rue de la Paix, Paris', 'En attente');

-- Facture de test
INSERT INTO invoices (client_id, delivery_id, amount, due_date) VALUES
  (1, 1, 320.00, DATE_ADD(CURDATE(), INTERVAL 30 DAY));
