"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AyatCard } from "../ayat/ayatCard";
import { ayat } from "@prisma/client";

type Ayat = {
  sourate: {
    number: number;
    titre: string;
  };
} & {
  number: number;
  id: number;
  sourate_number: number;
  content: string;
  traduction: string | null;
  toLearn: boolean;
};

type Props = {
  allAyats: Ayat[];
  ayatLearnedByUser: ayat[];
  ayatInFavorite: ayat[];
};

export const ToLearnPageContent = ({
  allAyats,
  ayatLearnedByUser,
  ayatInFavorite,
}: Props) => {
  const isAyatFavorite = (ayat: ayat) =>
    ayatInFavorite.some((a) => a.id === ayat.id);
  const isAyatLearned = (ayat: ayat) =>
    ayatLearnedByUser.some((a) => a.id === ayat.id);

  // Calcul du nombre d'ayat appris et le pourcentage d'apprentissage
  const learnedCount = ayatLearnedByUser.length;
  const totalAyats = allAyats.length;
  const progressPercentage = Math.round((learnedCount / totalAyats) * 100);

  // Définition de la couleur de la jauge en fonction du pourcentage
  const progressColor =
    progressPercentage < 30
      ? "bg-red-500"
      : progressPercentage < 70
      ? "bg-yellow-500"
      : "bg-green-500";

  // Filtrer les ayats non appris
  const ayatsToLearn = allAyats.filter((a) => !isAyatLearned(a));

  return (
    <Tabs defaultValue="all">
      {/* Navigation Tabs */}
      <div className="flex justify-between">
        <div className="flex items-center w-1/3">
          {/* Jauge de progression avec pourcentage à l'intérieur */}
          <div className="relative w-3/4 bg-gray-300 rounded-lg h-4 overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full ${progressColor} flex items-center justify-center`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-semibold">
            {learnedCount}/{totalAyats}
          </span>
        </div>
        <TabsList>
          <TabsTrigger value="all">Voir tout</TabsTrigger>
          <TabsTrigger value="filter">Voir que les non apprises</TabsTrigger>
        </TabsList>
      </div>

      {/* Contenu des Ayats */}
      <TabsContent value="all">
        {allAyats.map((a) => (
          <AyatCard
            key={a.id}
            ayat={a}
            titreSourate={a.sourate.titre}
            isFavorite={isAyatFavorite(a)}
            isLearned={isAyatLearned(a)}
          />
        ))}
      </TabsContent>
      <TabsContent value="filter">
        {ayatsToLearn.map((a) => (
          <AyatCard
            key={a.id}
            ayat={a}
            titreSourate={a.sourate.titre}
            isFavorite={isAyatFavorite(a)}
            isLearned={isAyatLearned(a)}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
};
