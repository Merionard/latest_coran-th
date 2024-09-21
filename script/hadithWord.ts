import { PrismaClient } from "@prisma/client";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  TableOfContents,
  PageBreak,
  SectionType,
  ParagraphChild,
  AlignmentType,
} from "docx";
import { FileChild } from "docx/build/file/file-child";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const MAX_CHAPTERS_PER_FILE = 10;

function compareHadithReferences(a: string, b: string): number {
  const splitReference = (ref: string) => {
    // Supprime les espaces autour de la chaîne
    ref = ref.trim();
    const trimmedString = ref.replace(/\s+/g, "");

    // Extrait un numéro suivi de lettres (si elles existent)
    const match = trimmedString.match(/^(\d+)([a-z]*)$/i);
    if (match) {
      // Retourne la partie numérique et la partie alphabétique en minuscule
      return [parseInt(match[1], 10), match[2].toLowerCase()];
    }
    return [0, trimmedString];
  };

  // Applique la fonction de découpage pour les deux références

  const [numA, letterA] = splitReference(a);
  const [numB, letterB] = splitReference(b);
  // Comparaison des parties numériques
  if (numA !== numB) {
    //@ts-ignore
    return numA - numB;
  }

  // Comparaison des parties alphabétiques (lettres) avec localeCompare
  //@ts-ignore
  return letterA.localeCompare(letterB);
}

async function createWordDocuments(bookId: number) {
  const book = await prisma.hadithBook.findUnique({
    where: { id: bookId },
    include: {
      chapters: {
        include: {
          hadiths: true,
        },
      },
    },
  });

  if (!book) {
    console.error(`Livre avec l'ID ${bookId} non trouvé.`);
    return;
  }

  const outputDir = path.join(process.cwd(), book.title);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Créer la table des matières (code inchangé)
  // ...

  // Diviser les chapitres en plusieurs fichiers
  for (let i = 0; i <= book.chapters.length; i += MAX_CHAPTERS_PER_FILE) {
    const orderChapter = book.chapters.sort((a, b) => a.id - b.id);
    const chaptersSlice = orderChapter.slice(i, i + MAX_CHAPTERS_PER_FILE);
    const partNumber = Math.floor(i / MAX_CHAPTERS_PER_FILE) + 1;

    const children: FileChild[] = [
      new Paragraph({
        text: `${book.title} - Partie ${partNumber}`,
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: `Auteur: ${book.author}`,
        heading: HeadingLevel.HEADING_1,
      }),
    ];

    children.push(
      new Paragraph({
        text: "SOMMAIRE",
        heading: HeadingLevel.HEADING_1, // Utilise un niveau de titre approprié
        alignment: AlignmentType.CENTER, // Centrer le titre si souhaité
      })
    );

    // Crée un tableau pour stocker les paragraphes du sommaire
    const childrenSommaire: FileChild[] = [];
    for (const chapter of book.chapters) {
      // Crée un nouveau paragraphe pour chaque chapitre
      const chapterParagraph = new Paragraph({
        children: [
          new TextRun({
            text: chapter.titleFr ?? "",
          }),
        ],
      });

      // Ajoute le paragraphe au sommaire
      childrenSommaire.push(chapterParagraph);
    }

    // Ajoute chaque chapitre du sommaire à la page
    children.push(...childrenSommaire);

    for (const chapter of chaptersSlice) {
      children.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_2,
          children: childrenSommaire,
          pageBreakBefore: true,
        })
      );

      // Trier les hadiths par référence
      const sortedHadiths = chapter.hadiths.sort((a, b) =>
        compareHadithReferences(
          a.hadithReference ?? "",
          b.hadithReference ?? ""
        )
      );

      for (const hadith of sortedHadiths) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `[${hadith.hadithReference}] `, bold: true }),
              new TextRun({
                text: hadith.content,
                font: {
                  name: "Inter",
                },
                size: 28,
                rightToLeft: true,
              }),
              new TextRun({ text: ` - ${hadith.narratorFr}`, italics: true }),
              new TextRun({ text: ` - ${hadith.traductionFr}`, italics: true }),
            ],
          }),
          new Paragraph({}),
          new Paragraph({})
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            type: SectionType.CONTINUOUS,
          },
          children: children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(
      path.join(
        outputDir,
        `${partNumber}_${book.title}_Partie_${partNumber}.docx`
      ),
      buffer
    );
    console.log(
      `Document Word créé : ${partNumber}_${book.title}_Partie_${partNumber}.docx`
    );
  }
}

async function main() {
  const bookId = 2; // Remplacez par l'ID du livre que vous voulez traiter
  await createWordDocuments(bookId);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
