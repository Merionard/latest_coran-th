import { PrismaClient } from "@prisma/client";
const { Translate } = require("@google-cloud/translate").v2;

const prisma = new PrismaClient();
const projectId = "themecoran";
const translate = new Translate({
  projectId,
  key: "test",
});

async function main() {
  await prisma.$connect();

  const chapters = await prisma.hadithChapter.findMany({
    where: { titleEn: { not: "" } },
  });

  for (const chapter of chapters) {
    const translate = await translateText(chapter.titleEn);
    await prisma.hadithChapter.update({
      where: { id: chapter.id },
      data: {
        titleFr: translate,
      },
    });
  }
}

async function translateText(text: string) {
  const target = "fr";
  const [translation] = await translate.translate(text, target);
  return translation;
}

main();
