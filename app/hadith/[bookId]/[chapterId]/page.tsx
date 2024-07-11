import { HadithItem } from "@/components/clientComponents/hadith/hadithItem";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { hadith } from "@prisma/client";
import { getServerSession } from "next-auth";

export default async function ChapterPage({
  params,
}: {
  params: { chapterId: string };
}) {
  const hadiths = await prisma.hadith.findMany({
    where: { hadith_chapter: Number(params.chapterId) },
    include: { hadithChapter: { include: { hadithBook: true } } },
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
    <div className="space-y-3">
      <h2 className="text-center text-4xl  md:text-6xl ">
        {hadiths[0].hadithChapter.titleEn} - {hadiths[0].hadithChapter.title}
      </h2>
      {hadiths.map((a) => (
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
