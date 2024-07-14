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

const FavorisPage = ({ favorisAyat, learnedAyat }: props) => {
  const [favorisView, setFavorisView] = useState(true);

  const isAyatFavorite = (ayat: ayat) =>
    favorisAyat.some((a) => a.id === ayat.id);
  const isAyatLearned = (ayat: ayat) =>
    learnedAyat.some((a) => a.id === ayat.id);

  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          className={favorisView ? "rounded-none bg-secondary" : "rounded-none"}
          size="icon"
          onClick={() => setFavorisView(true)}
        >
          <Heart />
        </Button>
        <Button
          variant="outline"
          className={
            !favorisView ? "rounded-none bg-secondary" : "rounded-none"
          }
          size="icon"
          onClick={() => setFavorisView(false)}
        >
          <BookCheck />
        </Button>
      </div>
      {favorisView ? (
        favorisAyat.length === 0 ? (
          <Alert>
            <MessageCircleWarning className="h-4 w-4" />
            <AlertTitle>Oups</AlertTitle>
            <AlertDescription>
              Vous n&apos;avez pas encore de favoris!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-5">
            {favorisAyat.map((ayat) => (
              <AyatCard
                key={ayat.id}
                ayat={ayat}
                titreSourate={ayat.sourate.titre}
                isFavorite={isAyatFavorite(ayat)}
                themes={ayat.theme}
                isLearned={isAyatLearned(ayat)}
              />
            ))}
          </div>
        )
      ) : learnedAyat.length === 0 ? (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />
          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Vous n&apos;avez pas encore de ayat apprise!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-5">
          {learnedAyat.map((ayat) => (
            <AyatCard
              key={ayat.id}
              ayat={ayat}
              titreSourate={ayat.sourate.titre}
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

export default FavorisPage;
