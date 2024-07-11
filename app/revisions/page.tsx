import { ChoixRevision } from "@/components/clientComponents/revisions/choixRevision";
import { ExoCaroussel } from "@/components/clientComponents/revisions/exoCaroussel";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { MessageCircleWarning } from "lucide-react";

export default async function Revisions() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <Alert>
        <MessageCircleWarning className="h-4 w-4" />
        <AlertTitle>Oups</AlertTitle>
        <AlertDescription>
          Vous devez vous connecter pour accéder à vos Ayats!
        </AlertDescription>
      </Alert>
    );
  }
  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      myAyats: true,
      ayatsLearned: true,
      hadithsLearned: true,
      myHadiths: true,
    },
  });
  const ayatsToLearn = await prisma.ayat.findMany({ where: { toLearn: true } });
  if (!userData) {
    return (
      <Alert>
        <MessageCircleWarning className="h-4 w-4" />
        <AlertTitle>Oups</AlertTitle>
        <AlertDescription>Une erreur est survenue</AlertDescription>
      </Alert>
    );
  }
  // Mélanger les myAyats aléatoirement
  const shuffleFavoriteAyat = userData.myAyats.sort(() => 0.5 - Math.random());
  const shufflelearnedAyat = userData.ayatsLearned.sort(
    () => 0.5 - Math.random()
  );
  // Limiter à 5 éléments
  const limitedAyats = shufflelearnedAyat.slice(0, 5);
  //userData.myAyats = limitedAyats;

  return (
    <ChoixRevision
      ayatsToLearn={ayatsToLearn}
      myAyats={shuffleFavoriteAyat}
      randomLearnedAyat={limitedAyats}
      myHadith={[]}
      randomHadithLearned={[]}
    />
  );
}
