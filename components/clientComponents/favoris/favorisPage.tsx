"use client";

import { Button } from "@/components/ui/button";
import { BookCheck, Heart, MessageCircleWarning } from "lucide-react";
import { useState } from "react";
import { AyatCard } from "../ayat/ayatCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type ayat = {
  theme: {
    id: number;
    name: string;
    parentId: number | null;
    description: string | null;
    order: number | null;
  }[];
  sourate: {
    number: number;
    titre: string;
  };
} & {
  id: number;
  sourate_number: number;
  number: number;
  content: string;
  traduction: string | null;
  toLearn: boolean;
};

type props = {
  favorisAyat: ayat[];
  learnedAyat: ayat[];
};

export const FavorisPage = ({ favorisAyat, learnedAyat }: props) => {
  const [favorisView, setFavorisView] = useState(true);

  const isAyatFavorite = (ayat: ayat) => {
    return favorisAyat.some((a) => a.id === ayat.id);
  };

  const isAyatLearned = (ayat: ayat) => {
    return learnedAyat.some((a) => a.id === ayat.id);
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
      {favorisView && favorisAyat.length === 0 && (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />

          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Vous n&apos; avez pas encore de favoris!
          </AlertDescription>
        </Alert>
      )}
      {!favorisView && learnedAyat.length === 0 && (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />

          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Vous n&apos; avez pas encore de ayat apprise!
          </AlertDescription>
        </Alert>
      )}
      {favorisView && (
        <div className="space-y-5">
          {favorisAyat.map((ayat) => (
            <AyatCard
              ayat={ayat}
              titreSourate={ayat.sourate.titre}
              key={ayat.id}
              isFavorite={isAyatFavorite(ayat)}
              themes={ayat.theme}
              isLearned={isAyatLearned(ayat)}
            />
          ))}
        </div>
      )}

      {!favorisView && (
        <div className="space-y-5">
          {learnedAyat.map((ayat) => (
            <AyatCard
              ayat={ayat}
              titreSourate={ayat.sourate.titre}
              key={ayat.id}
              isFavorite={isAyatFavorite(ayat)}
              themes={ayat.theme}
              isLearned={isAyatLearned(ayat)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
