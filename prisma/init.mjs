import fs from "fs";
import test from "../script/Classeur1.txt";

// Nom de la table dans la base de données
const nomTable = "coran_db";

// Nom des colonnes dans la table
const colonnes = ["surah", "ayah", "traduction"];

// Fonction pour échapper les caractères spéciaux dans les valeurs
const escapeValue = (value) => {
  return value.replace(/'/g, "''");
};

// Lecture du fichier CSV
fs.readFile(test, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // Séparation des lignes
  const lignes = data.split("\n");

  // Parcours de chaque ligne
  lignes.forEach((ligne) => {
    // Séparation des valeurs
    const valeurs = ligne.split(";");

    // Création de l'instruction INSERT
    let instructionSQL = `INSERT INTO ${nomTable} (${colonnes.join(
      ", "
    )}) VALUES (`;
    valeurs.forEach((valeur, index) => {
      // Échapper les caractères spéciaux
      valeur = escapeValue(valeur.trim());

      // Ajouter la valeur à l'instruction SQL
      instructionSQL += `'${valeur}'`;

      // Ajouter une virgule si ce n'est pas la dernière valeur
      if (index < valeurs.length - 1) {
        instructionSQL += ", ";
      }
    });
    instructionSQL += ");";

    // Affichage de l'instruction SQL
    console.log(instructionSQL);
  });
});
