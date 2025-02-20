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
    ref = ref.trim();
    const trimmedString = ref.replace(/\s+/g, "");

    const match = trimmedString.match(/^(\d+)([a-z]*)$/i);
    if (match) {
      return [parseInt(match[1], 10), match[2].toLowerCase()];
    }
    return [0, trimmedString];
  };

  const [numA, letterA] = splitReference(a);
  const [numB, letterB] = splitReference(b);

  if (numA !== numB) {
    //@ts-ignore
    return numA - numB;
  }
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

  // Créer une seule fois le sommaire pour l'ensemble du document
  const orderChapter = book.chapters.sort((a, b) => a.id - b.id);
  const childrenSommaire: FileChild[] = [
    new Paragraph({
      text: "SOMMAIRE",
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
  ];

  for (const chapter of orderChapter) {
    const chapterParagraph = new Paragraph({
      children: [
        new TextRun({
          text: chapter.titleFr ?? "",
        }),
      ],
    });
    childrenSommaire.push(chapterParagraph);
  }

  // Diviser les chapitres en plusieurs fichiers
  for (let i = 0; i <= book.chapters.length; i += MAX_CHAPTERS_PER_FILE) {
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

    // Ajouter le sommaire au début du premier fichier seulement
    if (i === 0) {
      children.push(...childrenSommaire);
    }

    for (const chapter of chaptersSlice) {
      children.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_2,
          pageBreakBefore: true,
        })
      );

      const sortedHadiths = chapter.hadiths.sort((a, b) =>
        compareHadithReferences(
          a.hadithReference ?? "",
          b.hadithReference ?? ""
        )
      );

      for (const hadith of sortedHadiths) {
        children.push(
          // Paragraphe pour la référence du hadith
          new Paragraph({
            children: [
              new TextRun({ text: `[${hadith.hadithReference}] `, bold: true }),
            ],
          }),

          // Paragraphe pour le contenu du hadith
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: hadith.content,
                font: { name: "Inter" },
                size: 40,
                rightToLeft: true,
              }),
            ],
          }),

          // Paragraphe vide pour ajouter un espace
          new Paragraph({}),

          // Paragraphe pour le narrateur
          new Paragraph({
            children: [
              new TextRun({
                text: ` - ${hadith.narratorFr}`,
                italics: true,
                size: 28,
                rightToLeft: false,
              }),
            ],
          }),

          // Paragraphe vide pour ajouter un espace
          new Paragraph({}),

          // Paragraphe pour la traduction
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: ` - ${hadith.traductionFr}`,
                italics: true,
                size: 28,
                rightToLeft: false,
              }),
            ],
          }),

          // Deux Paragraphs vides pour ajouter un espace après chaque hadith
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
  const bookId = 17; // Remplacez par l'ID du livre que vous voulez traiter
  await createWordDocuments(bookId);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
