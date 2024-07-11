"use client";

import { hadithUser } from "@/app/mes_hadiths/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BookCheck, Heart, MessageCircleWarning } from "lucide-react";
import { useState } from "react";
import { HadithItem } from "../hadith/hadithItem";

type props = {
  hadithsUser: hadithUser;
};

export const FavorisHadithPage = ({ hadithsUser }: props) => {
  const [favorisView, setFavorisView] = useState(true);

  const isHadithFavorite = (hadithId: number) => {
    if (!hadithsUser) {
      return false;
    }
    return hadithsUser?.myHadiths.some((a) => a.id === hadithId);
  };

  const isHadithLearned = (hadithId: number) => {
    if (!hadithsUser) {
      return false;
    }
    return hadithsUser?.hadithsLearned.some((a) => a.id === hadithId);
  };

  return (
    <div>
      <div className="flex justify-end  mb-2">
        <Button
          variant={"outline"}
          className={favorisView ? "rounded-none bg-secondary" : "rounded-none"}
          size={"icon"}
          onClick={() => setFavorisView(true)}
        >
          <Heart />
        </Button>
        <Button
          variant={"outline"}
          className={
            !favorisView ? "rounded-none bg-secondary" : "rounded-none"
          }
          size={"icon"}
          onClick={() => setFavorisView(false)}
        >
          <BookCheck />
        </Button>
      </div>
      {favorisView && hadithsUser?.myHadiths.length === 0 && (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />

          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Vous n&apos; avez pas encore de favoris!
          </AlertDescription>
        </Alert>
      )}
      {!favorisView && hadithsUser?.hadithsLearned.length === 0 && (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />

          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Vous n&apos; avez pas encore appris de hadith!
          </AlertDescription>
        </Alert>
      )}
      {favorisView && (
        <div className="space-y-5">
          {hadithsUser?.myHadiths.map((hadith) => (
            <HadithItem
              hadith={hadith}
              key={hadith.id}
              isFavorite={isHadithFavorite(hadith.id)}
              isLearned={isHadithLearned(hadith.id)}
              metadata={{
                bookId: hadith.hadithChapter.hadithBook.id,
                bookName: hadith.hadithChapter.hadithBook.title,
                chapterName:
                  hadith.hadithChapter.titleFr ?? hadith.hadithChapter.titleEn,
              }}
            />
          ))}
        </div>
      )}

      {!favorisView && (
        <div className="space-y-5">
          {hadithsUser?.hadithsLearned.map((hadith) => (
            <HadithItem
              hadith={hadith}
              key={hadith.id}
              isFavorite={isHadithFavorite(hadith.id)}
              isLearned={isHadithLearned(hadith.id)}
              metadata={{
                bookId: hadith.hadithChapter.hadithBook.id,
                bookName: hadith.hadithChapter.hadithBook.title,
                chapterName:
                  hadith.hadithChapter.titleFr ?? hadith.hadithChapter.titleEn,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
