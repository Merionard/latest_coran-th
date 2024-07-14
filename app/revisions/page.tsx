import { ChoixRevision } from "@/components/clientComponents/revisions/choixRevision";
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

  try {
    const [userData, ayatsToLearn] = await Promise.all([
      getUserData(session.user.id),
      getAyatsToLearn(),
    ]);

    if (!userData) {
      return (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />
          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>Une erreur est survenue</AlertDescription>
        </Alert>
      );
    }

    const shuffledFavoriteAyats = shuffleArray(userData.myAyats);
    const shuffledLearnedAyats = shuffleArray(userData.ayatsLearned);
    const limitedLearnedAyats = shuffledLearnedAyats.slice(0, 5);

    return (
      <ChoixRevision
        ayatsToLearn={ayatsToLearn}
        myAyats={shuffledFavoriteAyats}
        randomLearnedAyat={limitedLearnedAyats}
        myHadith={[]}
        randomHadithLearned={[]}
      />
    );
  } catch (error) {
    return (
      <Alert>
        <MessageCircleWarning className="h-4 w-4" />
        <AlertTitle>Oups</AlertTitle>
        <AlertDescription>Une erreur est survenue</AlertDescription>
      </Alert>
    );
  }
}

async function getUserData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      myAyats: true,
      ayatsLearned: true,
      hadithsLearned: true,
      myHadiths: true,
    },
  });
}

async function getAyatsToLearn() {
  return prisma.ayat.findMany({ where: { toLearn: true } });
}

// Fonction pour mélanger un tableau
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}
