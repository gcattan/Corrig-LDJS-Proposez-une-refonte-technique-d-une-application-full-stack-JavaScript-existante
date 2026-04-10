CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'client') NOT NULL DEFAULT 'client'
);

CREATE TABLE IF NOT EXISTS deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  volume INT NOT NULL,
  weight INT NOT NULL,
  price DECIMAL(10, 2) DEFAULT NULL,
  status ENUM('En attente', 'Acceptée', 'Refusée', 'Terminée') NOT NULL DEFAULT 'En attente',
  clientName VARCHAR(255) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
