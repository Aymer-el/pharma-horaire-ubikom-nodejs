
USE phu_1;

DROP TABLE IF EXISTS Ligne_horaire;
DROP TABLE IF EXISTS Pharmacie;
DROP TABLE IF EXISTS Horaire;

CREATE TABLE Pharmacie (
  id int(11) NOT NULL AUTO_INCREMENT,
  pharmacieName varchar(255) NOT NULL,
  address varchar(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) DEFAULT CHARSET=utf8;

CREATE TABLE Horaire (
  horaireId smallInt NOT NULL,
  PRIMARY KEY (horaireId)
  
) DEFAULT CHARSET=utf8;

CREATE TABLE Ligne_horaire (
  id int(16) NOT NULL AUTO_INCREMENT,
  horaireId smallInt NOT NULL,
  pharmacieId int NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (horaireId) REFERENCES Horaire(horaireId),
  FOREIGN KEY (pharmacieId) REFERENCES Pharmacie(id)
) DEFAULT CHARSET=utf8;


SELECT * FROM Pharmacie;
