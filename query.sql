DROP TABLE IF EXISTS pharmacies;

CREATE TABLE pharmacies (
  Nom VARCHAR(255) PRIMARY KEY,
  Tel VARCHAR(255),
  Adresse VARCHAR(255),
  Quartier VARCHAR(255),
  Ville VARCHAR(255),
  Geographie VARCHAR(255),   
);

SELECT * FROM pharmacies
