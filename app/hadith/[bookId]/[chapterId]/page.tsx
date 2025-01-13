import { HadithItem } from "@/components/clientComponents/hadith/hadithItem";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { hadith } from "@prisma/client";

export default async function ChapterPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const hadiths = await prisma.hadith.findMany({
    where: { hadith_chapter: Number(params.chapterId) },
    include: { hadithChapter: { include: { hadithBook: true } } },
  });

  //@ts-ignore
  const sortedHadiths = hadiths.sort((a, b) => {
    const extractParts = (reference: string | null) => {
      if (!reference) return null;
      const numericPart = parseInt(reference.replace(/\D/g, ""), 10) || 0; // Partie numérique
      const alphaPart = reference.replace(/\d/g, ""); // Partie alphabétique
      return { numericPart, alphaPart };
    };

    const aParts = extractParts(a.hadithReference);
    const bParts = extractParts(b.hadithReference);

    // Comparaison des parties numériques
    if (aParts && bParts && aParts.numericPart !== bParts?.numericPart) {
      return aParts?.numericPart - bParts?.numericPart;
    }

    // Comparaison des parties alphabétiques (ordre lexicographique)
    if (aParts && bParts)
      return aParts.alphaPart.localeCompare(bParts.alphaPart);
  });

  const session = await getAuthSession();
  let userData = null;
  if (session) {
    userData = await prisma.user.findUnique({
      where: { id: session?.user.id },
      include: { myHadiths: true, hadithsLearned: true },
    });
  }

  const isHadithFavorite = (hadith: hadith) => {
    if (!userData) {
      return false;
    }
    return userData.myHadiths.some((h) => h.id === hadith.id);
  };

  const isHadithLearned = (hadith: hadith) => {
    if (!userData) {
      return false;
    }
    return userData.hadithsLearned.some((h) => h.id === hadith.id);
  };

  return (
    <div className="space-y-3 md:container">
      <h2 className="text-center text-4xl  md:text-6xl ">
        {hadiths[0].hadithChapter.titleEn} - {hadiths[0].hadithChapter.title}
      </h2>
      {sortedHadiths.map((a) => (
        <HadithItem
          hadith={a}
          isFavorite={isHadithFavorite(a)}
          key={a.id}
          isLearned={isHadithLearned(a)}
          metadata={{
            bookId: hadiths[0].hadithChapter.hadith_book_id,
            bookName: hadiths[0].hadithChapter.hadithBook.titleTraductionEn,
            chapterName: hadiths[0].hadithChapter.titleEn,
          }}
        />
      ))}
    </div>
  );
}
