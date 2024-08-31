import { AyatCard } from "@/components/clientComponents/ayat/ayatCard";
import { FavorisBtn } from "@/components/clientComponents/favoris/favorisBtn";
import { DeleteThemeBtn } from "@/components/clientComponents/theme/deleteThemeBtn";
import { toogleFavoriteTheme } from "@/components/serverActions/favorisAction";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { ayat, hadith } from "@prisma/client";
import { MessageCircleWarning, Undo2 } from "lucide-react";
import Link from "next/link";
import { ThemeDialogForm } from "../../../components/clientComponents/theme/newThemeDialogForm";
import {
  createNewThemeCoran,
  updateTheme,
} from "../../../components/serverActions/themeCoranAction";
import ThemeSearchAyat from "../../../components/serverComponents/ThemeSearchAyat";
import { HadithItem } from "@/components/clientComponents/hadith/hadithItem";
import { SelectHadith } from "@/components/clientComponents/hadith/selectHadith";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Berkshire_Swash } from "next/font/google";
import { SousThemeList } from "@/components/clientComponents/theme/sousThemeList";
import { cn } from "@/lib/utils";
import { clsx } from "clsx";

const berkshire = Berkshire_Swash({ weight: "400", subsets: ["latin"] });

export default async function ViewTheme({
  params,
}: {
  params: { themeCoranId: string };
}) {
  const session = await getAuthSession();

  const [theme] = await Promise.all([
    prisma.theme.findUnique({
      where: { id: Number(params.themeCoranId) },
      include: {
        ayats: {
          include: { sourate: true },
          orderBy: [{ sourate_number: "asc" }, { number: "asc" }],
        },
        hadiths: true,
        subThemes: true,
      },
    }),
  ]);

  if (!theme) {
    throw new Error("Ce thème n'existe pas!");
  }

  const user = session
    ? await prisma.user.findFirst({
        where: { id: session.user.id },
        include: {
          myAyats: true,
          myThemes: true,
          ayatsLearned: true,
          myHadiths: true,
          hadithsLearned: true,
        },
      })
    : null;

  const isAyatFavorite = (ayat: ayat) =>
    user?.myAyats.some((a) => a.id === ayat.id) || false;
  const isAyatLearned = (ayat: ayat) =>
    user?.ayatsLearned.some((a) => a.id === ayat.id) || false;
  const isThemeFavorite = () =>
    user?.myThemes.some((t) => t.id === theme.id) || false;
  const isHadithFavorite = (hadith: hadith) =>
    user?.myHadiths.some((h) => h.id === hadith.id) || false;
  const isHadithLearned = (hadith: hadith) =>
    user?.hadithsLearned.some((h) => h.id === hadith.id) || false;

  const getAyatContent = () => {
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
          {session?.user.role === "ADMIN" && (
            <div className="m-auto w-3/4 my-5 md:my-16">
              <ThemeSearchAyat themeId={Number(params.themeCoranId)} />
            </div>
          )}
          {theme.description && (
            <div
              className="border p-3 md:p-8
              border-black bg-[#f2c166]"
            >
              <p>{theme.description}</p>
            </div>
          )}
          {theme.ayats.length > 0 && (
            <div className="mt-10">
              <h3
                className={
                  berkshire.className +
                  " text-4xl mb-3 text-center text-orange-400 "
                }
              >
                Versets
              </h3>
              <div className="space-y-5 ">
                {theme.ayats.map((a) => (
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
          )}
        </div>
      </div>
    );
  };

  const getSubThemeContent = () => {
    if (theme.ayats.length === 0 && theme.hadiths.length === 0) {
      return null;
    }
    if (theme.subThemes.length > 0) {
      return (
        <div className="hidden md:block ">
          <h3 className="text-4xl mt-5 mb-3 font-bold text-orange-500">
            Sous thèmes
          </h3>
          <div className="flex flex-col gap-2">
            {theme.subThemes.map((subTheme) => (
              <Link
                href={`/themes_coran/${subTheme.id}`}
                key={subTheme.id}
                className="text-primary active:text-black p-2 border rounded-xl duration-300 cursor-pointer border-gray-600 hover:bg-primary hover:text-white"
              >
                {subTheme.name}
              </Link>
            ))}
          </div>
        </div>
      );
    }
  };

  const getHierarchy = async (parentId: number | null) => {
    const breadcrumbs = [];

    while (parentId) {
      const parent = await prisma.theme.findUnique({ where: { id: parentId } });
      if (parent) {
        breadcrumbs.unshift(
          <>
            <BreadcrumbItem key={parent.id} className="md:text-xl">
              <BreadcrumbLink asChild>
                <Link href={`/themes_coran/${parent.id}`}>{parent.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        );
        parentId = parent.parentId;
      } else {
        break;
      }
    }

    return breadcrumbs;
  };

  if (session?.user.role === "ADMIN") {
    const [allOtherThemes, books] = await Promise.all([
      prisma.theme.findMany({
        where: { NOT: { id: Number(params.themeCoranId) } },
      }),

      prisma.hadithBook.findMany({
        select: { id: true, title: true },
      }),
    ]);
    return (
      <div className="flex flex-grow gap-3">
        {getSubThemeContent()}
        <div className="md:w-3/4 mx-auto">
          <div className="flex justify-center mb-10">
            {theme.parentId && (
              <Breadcrumb>
                <BreadcrumbList>
                  {getHierarchy(theme.parentId)}
                  <BreadcrumbItem className="md:text-xl">
                    <BreadcrumbPage>{theme.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          <h2
            className={
              berkshire.className +
              " text-4xl md:text-6xl text-center text-primary"
            }
          >
            {theme?.name}
          </h2>
          <div className="flex justify-end gap-2 mt-10 mb-2">
            <Button
              asChild
              variant="outline"
              size="icon"
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
          </div>
          {getAyatContent()}
          <div>
            <h4
              className={
                berkshire.className +
                " text-4xl mt-5 mb-3 text-center text-orange-400 "
              }
            >
              Hadiths
            </h4>
            <div className="m-auto w-3/4 my-5 md:my-16 hidden md:block">
              <SelectHadith books={books} themeId={theme.id} />
            </div>
            <div className="space-y-5">
              {theme.hadiths.map((h) => (
                <HadithItem
                  key={h.id}
                  hadith={h}
                  isFavorite={isHadithFavorite(h)}
                  isLearned={isHadithLearned(h)}
                  themeId={theme.id}
                />
              ))}
            </div>
          </div>
          <h4
            className={
              berkshire.className +
              " text-4xl mt-5 mb-3 text-center text-orange-400 "
            }
          >
            Sous thèmes
          </h4>
          <div className="flex flex-col gap-2">
            {theme.subThemes.map((subTheme) => (
              <Link
                href={`/themes_coran/${subTheme.id}`}
                key={subTheme.id}
                className="text-primary active:text-black p-2 border rounded-xl duration-300 cursor-pointer border-gray-600 hover:bg-primary hover:text-white"
              >
                {subTheme.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-grow gap-3 items-baseline">
      {getSubThemeContent()}
      <div className="md:w-3/4 mx-auto">
        <div className="flex justify-center mb-10 flex-1">
          {theme.parentId && (
            <Breadcrumb>
              <BreadcrumbList>
                {getHierarchy(theme.parentId)}
                <BreadcrumbItem className="md:text-xl">
                  <BreadcrumbPage>{theme.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        <h2
          className={
            berkshire.className +
            " text-4xl md:text-6xl text-center text-primary"
          }
        >
          {theme?.name}
        </h2>
        <div
          className={cn(
            "flex md:justify-end gap-2 mt-10 mb-2",
            (theme.ayats.length > 0 || theme.hadiths.length > 0) &&
              theme.subThemes.length > 0
              ? "justify-between"
              : "justify-end"
          )}
        >
          {(theme.ayats.length > 0 || theme.hadiths.length > 0) && (
            <SousThemeList subThemes={theme.subThemes} />
          )}
          <div>
            <Button
              asChild
              variant="outline"
              size="icon"
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
          </div>
        </div>
        {getAyatContent()}
        <div>
          {theme.hadiths.length > 0 && (
            <>
              <h4
                className={
                  berkshire.className +
                  " text-4xl mt-5 mb-3 text-center text-orange-400 "
                }
              >
                Hadiths
              </h4>
              <div className="space-y-5">
                {theme.hadiths.map((h) => (
                  <HadithItem
                    key={h.id}
                    hadith={h}
                    isFavorite={isHadithFavorite(h)}
                    isLearned={isHadithLearned(h)}
                    themeId={theme.id}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {theme.ayats.length === 0 && theme.hadiths.length === 0 && (
          <div>
            <h4
              className={
                berkshire.className +
                " text-4xl mt-5 mb-3 text-center text-orange-400 "
              }
            >
              Sous thèmes
            </h4>
            <div className="flex flex-col gap-2">
              {theme.subThemes.map((subTheme) => (
                <Link
                  href={`/themes_coran/${subTheme.id}`}
                  key={subTheme.id}
                  className="text-primary active:text-black p-2 border rounded-xl duration-300 cursor-pointer border-gray-600 hover:bg-primary hover:text-white"
                >
                  {subTheme.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
