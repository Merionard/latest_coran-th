"use client";

import { Button } from "@/components/ui/button";
import { ayat, hadith } from "@prisma/client";
import { useState } from "react";
import { ExoCaroussel } from "./exoCaroussel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "lucide-react";

type props = {
  myAyats: ayat[];
  ayatsToLearn: ayat[];
  randomLearnedAyat: ayat[];
  myHadith: hadith[];
  randomHadithLearned: hadith[];
};
export const ChoixRevision = ({
  ayatsToLearn,
  myAyats,
  randomLearnedAyat,
  myHadith,
  randomHadithLearned,
}: props) => {
  const [ayats, setAyats] = useState<ayat[]>([]);
  return (
    <div>
      {ayats.length === 0 && (
        <Alert>
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>Choisissez votre mode de révision</AlertTitle>
          <AlertDescription>
            Révisez les ayats disponibles dans la page à apprendre ou bien
            révisez vos favoris!
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col  justify-center gap-2 mb-3 mt-3">
        {ayats.length === 0 ? (
          <>
            <Button onClick={() => setAyats(myAyats)}>
              Réviser mes favoris
            </Button>
            <Button onClick={() => setAyats(ayatsToLearn)}>
              Réviser les Ayats à apprendre
            </Button>
            <Button onClick={() => setAyats(randomLearnedAyat)}>
              Réviser aléatoirement mes ayats apprises
            </Button>
          </>
        ) : (
          <Button onClick={() => setAyats([])} variant={"secondary"}>
            Retour choix exercices
          </Button>
        )}
      </div>

      {ayats.length > 0 && <ExoCaroussel ayats={ayats} />}
    </div>
  );
};
