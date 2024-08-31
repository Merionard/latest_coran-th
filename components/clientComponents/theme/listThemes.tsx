"use client";

import { useMemo, useState, useCallback } from "react";
import { ThemeWithSubThemes } from "@/app/themes_coran/page";
import { createNewThemeCoran } from "@/components/serverActions/themeCoranAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SearchInput } from "@/components/ui/searchInput";
import { cn } from "@/lib/utils";
import { Grid3X3, List } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ThemeDialogForm } from "./newThemeDialogForm";
import { ThemeCard } from "./themeCard";

type props = {
  themes: ThemeWithSubThemes[];
  admin: boolean;
};
export const ListThemes = ({ themes, admin }: props) => {
  const [search, setSearch] = useState("");
  const [gridMod, setGridMode] = useState(false);
  const { theme: colorTheme } = useTheme();

  const filteredThemes = useMemo(() => {
    return search
      ? themes.filter((t) =>
          t.name.toUpperCase().includes(search.toUpperCase())
        )
      : themes.filter((t) => t.parentId === null);
  }, [search, themes]);

  const getAllThemesWithRecursiveSubThemes = useCallback(
    (theme: ThemeWithSubThemes, subLevel: number) => {
      const subThemes = themes.filter((t) => t.parentId === theme.id);
      const mapLevelColor: { [key: number]: string } = {
        4: "#F97316",
        2: "#3357FF",
        6: "#22C55E",
        8: "#F43F5E",
      };
      const getColorForNumber = (num: number): string => {
        return mapLevelColor[num] || "#000000"; // Noir par défaut si le nombre n'existe pas
      };

      if (gridMod && theme.parentId === null) {
        return (
          <ThemeCard key={theme.id} {...theme}>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant="link" className="p-0">
                  Afficher sous thèmes
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {subThemes.map((s) =>
                  getAllThemesWithRecursiveSubThemes(s, subLevel + 2)
                )}
              </CollapsibleContent>
            </Collapsible>
          </ThemeCard>
        );
      }
      return (
        <div
          className={cn(
            gridMod
              ? theme.parentId === null
                ? "pl-0 mt-3"
                : "pl-3"
              : theme.parentId === null
              ? "pl-2 mt-3"
              : "pl-10"
          )}
          key={theme.id}
        >
          <Link
            href={`/themes_coran/${theme.id}`}
            className={cn({
              "text-base": gridMod,
              "font-bold text-2xl": !gridMod && theme.parentId === null,
              "text-xl": !gridMod && theme.parentId !== null,
              "active:underline": true,
              "arrow-dark":
                theme.parentId !== null &&
                (colorTheme === "light" || !colorTheme),
              "arrow-white": theme.parentId !== null && colorTheme === "dark",
            })}
            style={{ color: getColorForNumber(subLevel) }}
          >
            {theme.name}
            {theme.ayats.length > 0 && <span>({theme.ayats.length})</span>}
          </Link>
          {subThemes.map((s) =>
            getAllThemesWithRecursiveSubThemes(s, subLevel + 2)
          )}
        </div>
      );
    },
    [themes, gridMod, colorTheme]
  );

  const renderThemes = useCallback(() => {
    if (search) {
      return filteredThemes.map((t) => {
        if (gridMod)
          return (
            <Link href={`/themes_coran/${t.id}`} key={t.id}>
              <div className="p-5 border mb-3 transition ease-in-out delay-150 hover:scale-110 duration-300 cursor-pointer text-center text-xl bg-card">
                {t.name}
              </div>
            </Link>
          );
        return (
          <div key={t.id} className="mt-3">
            <Link
              href={`/themes_coran/${t.id}`}
              className={t.parentId === null ? "font-bold text-xl" : ""}
            >
              {t.name}
            </Link>
          </div>
        );
      });
    }

    return filteredThemes.map((t) => getAllThemesWithRecursiveSubThemes(t, 0));
  }, [filteredThemes, search, gridMod, getAllThemesWithRecursiveSubThemes]);

  return (
    <div>
      <h2 className="text-center text-4xl md:text-6xl text-primary">
        Arborescence des thèmes coraniques
      </h2>
      <div
        className={`flex ${admin ? "justify-between" : "justify-end"} mt-10`}
      >
        {admin && <ThemeDialogForm onSubmitForm={createNewThemeCoran} />}
        <div className="flex gap-3">
          <div className="flex">
            <Button
              variant="outline"
              className={gridMod ? "rounded-none bg-secondary" : "rounded-none"}
              onClick={() => setGridMode(true)}
              size="icon"
            >
              <Grid3X3 />
            </Button>
            <Button
              variant="outline"
              onClick={() => setGridMode(false)}
              className={gridMod ? "rounded-none" : "rounded-none bg-secondary"}
              size="icon"
            >
              <List />
            </Button>
          </div>
          <SearchInput search={search} onSearch={setSearch} />
        </div>
      </div>
      <Card className="mt-10">
        {gridMod ? (
          <CardContent className="p-6">
            <div className="space-y-3 md:space-y-0 md:grid grid-cols-3 gap-3 mt-5">
              {renderThemes()}
            </div>
          </CardContent>
        ) : (
          <CardContent className="md:py-10 md:pl-20">
            {renderThemes()}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
