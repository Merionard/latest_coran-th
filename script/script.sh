#!/bin/bash

# Vérifier si le nombre d'arguments est correct
if [ $# -ne 1 ]; then
    echo "Usage: $0 <fichier_csv>"
    exit 1
fi

# Assurez-vous que le fichier CSV existe
if [ ! -f "$1" ]; then
    echo "Le fichier $1 n'existe pas."
    exit 1
fi

# Nom du fichier de sortie fixé
fichier_sortie="output.sql"

# Préparer le fichier de sortie en s'assurant qu'il est vide
> "$fichier_sortie"

# Définir l'encodage des entrées et sorties en UTF-8
export LANG=fr_FR.UTF-8

# Lire le fichier CSV ligne par ligne en utilisant le point-virgule comme séparateur
while IFS=';' read -r surah ayah traduction; do

    # Convertir la virgule en point pour la comparaison, si nécessaire
    ayah_number=$(echo "$ayah" | sed 's/,/./')

    # Ignorer les lignes où ayah est égal à 0.5
    if [ "$ayah_number" = "0.5" ]; then
        continue
    fi
    # Échapper les apostrophes dans la chaîne traduction
    traduction_escaped=$(echo "$traduction" | sed "s/'/''/g")

    # Générer l'instruction UPDATE SQL
    sql="update quran set traduction='$traduction_escaped' where surah=$surah and ayah=$ayah;"
    
    # Afficher l'instruction SQL à l'écran
    echo "$sql"
    
    # Écrire l'instruction dans le fichier de sortie
    echo "$sql" >> "$fichier_sortie"
done < "$1"

echo "Le fichier de sortie a été généré avec succès : $fichier_sortie"