import { AyatCard } from "@/components/clientComponents/ayat/ayatCard";
import { FavorisBtn } from "@/components/clientComponents/favoris/favorisBtn";
import { DeleteThemeBtn } from "@/components/clientComponents/theme/deleteThemeBtn";
import { toogleFavoriteTheme } from "@/components/serverActions/favorisAction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { ayat } from "@prisma/client";
import { MessageCircleWarning, Undo2 } from "lucide-react";
import Link from "next/link";
import { ThemeDialogForm } from "../../../components/clientComponents/theme/newThemeDialogForm";
import {
  createNewThemeCoran,
  updateTheme,
} from "../../../components/serverActions/themeCoranAction";
import ThemeSearchAyat from "../../../components/serverComponents/ThemeSearchAyat";

export default async function ViewTheme({
  params,
}: {
  params: { themeCoranId: string };
}) {
  const theme = await prisma.theme.findUnique({
    where: { id: Number(params.themeCoranId) },
    include: {
      ayats: {
        include: { sourate: true },
        orderBy: [{ sourate_number: "asc" }, { number: "asc" }],
      },
      subThemes: true,
    },
  });
  const allOtherThemes = await prisma.theme.findMany({
    where: { NOT: { id: Number(params.themeCoranId) } },
  });

  if (theme === null) {
    throw new Error("Ce thème n'existe pas!");
  }

  const session = await getAuthSession();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
    include: { myAyats: true, myThemes: true, ayatsLearned: true },
  });
  const isAyatFavorite = (ayat: ayat) => {
    if (!session) return false;
    if (user) return user.myAyats.some((a) => a.id === ayat.id);
    return false;
  };

  const isAyatLearned = (ayat: ayat) => {
    if (!session) return false;
    if (user) return user.ayatsLearned.some((a) => a.id === ayat.id);
    return false;
  };

  const isThemeFavorite = () => {
    if (!session) return false;
    if (user) {
      return user.myThemes.some((t) => t.id === theme.id);
    }
    return false;
  };

  const getContent = () => {
    if (!session && theme.subThemes.length === 0 && theme.ayats.length === 0) {
      return (
        <Alert>
          <MessageCircleWarning className="h-4 w-4" />

          <AlertTitle>Oups</AlertTitle>
          <AlertDescription>
            Ce thème n&apos; pas encore de Ayats associées!
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          {session && session.user.role === "ADMIN" && (
            <div className="m-auto w-3/4 my-5 md:my-16">
              <ThemeSearchAyat themeId={Number(params.themeCoranId)} />
            </div>
          )}
          {theme.description && (
            <div className="border p-3 md:p-10 md:w-2/3 mx-auto border-black">
              <p>{theme.description}</p>
            </div>
          )}

          <div className="space-y-5 pt-5  p-3 md:p-6">
            {theme?.ayats.map((a) => (
              <AyatCard
                key={a.id}
                ayat={a}
                titreSourate={a.sourate.titre}
                themeId={theme.id}
                isFavorite={isAyatFavorite(a)}
                isLearned={isAyatLearned(a)}
              />
            ))}
          </div>
        </div>
        {theme.subThemes.length > 0 && (
          <div>
            {theme.ayats.length > 0 && (
              <hr className="mx-auto w-3/4 border-2 border-black" />
            )}
            <h3 className="text-center text-4xl my-3">Sous thèmes</h3>
            {theme?.subThemes.map((subTheme) => (
              <Link
                href={`/themes_coran/${subTheme.id}`}
                key={subTheme.id}
                className="active:bg-primary"
              >
                <div
                  className="p-5 border mb-3 transition ease-in-out delay-150 hover:scale-110 duration-300 cursor-pointer text-center text-xl 
          bg-card"
                >
                  {subTheme.name}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-4xl md:text-6xl text-center">{theme?.name}</h2>
      <div className="flex justify-end gap-2 mt-10 mb-2 ">
        <Button
          asChild
          variant={"outline"}
          size={"icon"}
          className="rounded-full"
        >
          <Link
            href={
              theme?.parentId !== null
                ? `/themes_coran/${theme?.parentId}`
                : "/themes_coran/"
            }
          >
            <Undo2 />
          </Link>
        </Button>
        <FavorisBtn
          isFavorite={isThemeFavorite()}
          handleClick={toogleFavoriteTheme}
          id={theme.id}
        />
        {session && session.user.role === "ADMIN" && (
          <>
            <ThemeDialogForm
              onSubmitForm={updateTheme}
              parentId={Number(params.themeCoranId)}
              theme={theme}
              parentThemes={allOtherThemes}
            />
            <ThemeDialogForm
              onSubmitForm={createNewThemeCoran}
              parentId={Number(params.themeCoranId)}
            />
            <DeleteThemeBtn themeId={theme.id} />
          </>
        )}
      </div>
      {getContent()}
    </div>
  );
}
