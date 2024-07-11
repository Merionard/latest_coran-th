"use client";

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
import { useState } from "react";
import { ThemeDialogForm } from "./newThemeDialogForm";
import { ThemeCard } from "./themeCard";

export const ListThemes = (props: {
  themes: ThemeWithSubThemes[];
  admin: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [gridMod, setGridMode] = useState(false);
  const { data } = useSession();
  const { theme: colorTheme } = useTheme();

  const getAllThemesWithRecursiveSubThemes = (
    theme: ThemeWithSubThemes,
    subLevel: number
  ) => {
    if (theme.subThemes.length > 0) {
      const subThemes = props.themes.filter((t) => t.parentId === theme.id);

      if (gridMod && theme.parentId === null) {
        return (
          <ThemeCard
            key={theme.id}
            id={theme.id}
            name={theme.name}
            parentId={theme.parentId}
            description={theme.description}
            order={theme.order}
          >
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button variant={"link"} className="p-0">
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
          className={
            gridMod
              ? theme.parentId === null
                ? "pl-0 mt-3"
                : "pl-3"
              : theme.parentId === null
              ? "pl-2 mt-3"
              : "pl-10"
          }
          key={theme.id}
        >
          <Link
            href={`/themes_coran/${theme.id}`}
            className={cn({
              "text-base": gridMod,
              "font-bold text-2xl": !gridMod && theme.parentId === null,
              "text-xl": !gridMod && theme.parentId !== null,
              "active:text-primary": true,
              "arrow-dark":
                theme.parentId !== null &&
                (colorTheme === "light" || !colorTheme),
              "arrow-white": theme.parentId !== null && colorTheme === "dark",
            })}
          >
            {theme.name}
            {theme.ayats.length > 0 && <span>({theme.ayats.length})</span>}
          </Link>

          {subThemes.map((s) =>
            getAllThemesWithRecursiveSubThemes(s, subLevel + 2)
          )}
        </div>
      );
    } else {
      if (gridMod && theme.parentId === null) {
        return (
          <ThemeCard
            key={theme.id}
            id={theme.id}
            name={theme.name}
            parentId={theme.parentId}
            description={theme.description}
            order={theme.order}
          />
        );
      }

      return (
        <div
          className={
            gridMod
              ? theme.parentId === null
                ? "pl-0 mt-3"
                : "pl-3"
              : theme.parentId === null
              ? "pl-2 mt-3"
              : "pl-10"
          }
          key={theme.id}
        >
          <Link
            href={`/themes_coran/${theme.id}`}
            className={cn({
              "text-base": gridMod,
              "font-bold text-2xl": !gridMod && theme.parentId === null,
              "text-xl": !gridMod && theme.parentId !== null,
              "active:text-primary": true,
              "arrow-dark":
                theme.parentId !== null &&
                (colorTheme === "light" || !colorTheme),
              "arrow-white": theme.parentId !== null && colorTheme === "dark",
            })}
          >
            {theme.name}
            {<span> ({theme.ayats.length})</span>}
          </Link>
        </div>
      );
    }
  };

  const getThemes = () => {
    if (search !== "") {
      return props.themes
        .filter((t) => t.name.toUpperCase().includes(search.toUpperCase()))
        .map((t) => {
          if (gridMod)
            return (
              <Link href={`/themes_coran/${t.id}`} key={t.id}>
                <div className="p-5 border mb-3 transition ease-in-out delay-150 hover:scale-110 duration-300 cursor-pointer text-center text-xl bg-card">
                  {t.name}
                </div>
              </Link>
            );
          return (
            <div key={t.id} className=" mt-3">
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
    return props.themes
      .filter((t) => t.parentId === null)
      .map((t) => getAllThemesWithRecursiveSubThemes(t, 0));
  };
  return (
    <div>
      <h2 className="text-center text-4xl  md:text-6xl ">
        Arborescence des thèmes coraniques
      </h2>
      <div
        className={`flex ${
          data && data.user.role === "ADMIN" ? "justify-between" : "justify-end"
        } mt-10`}
      >
        {props.admin && <ThemeDialogForm onSubmitForm={createNewThemeCoran} />}
        <div className="flex gap-3">
          <div className="flex">
            <Button
              variant={"outline"}
              className={gridMod ? "rounded-none bg-secondary" : "rounded-none"}
              onClick={() => setGridMode(true)}
              size={"icon"}
            >
              <Grid3X3 />
            </Button>
            <Button
              variant={"outline"}
              onClick={() => setGridMode(false)}
              className={gridMod ? "rounded-none" : "rounded-none bg-secondary"}
              size={"icon"}
            >
              <List />
            </Button>
          </div>
          <SearchInput
            search={search}
            onSearch={(search: string) => setSearch(search)}
          />
        </div>
      </div>
      <Card className="mt-10">
        {gridMod ? (
          <CardContent className="p-6">
            <div className="space-y-3 md:space-y-0 md:grid grid-cols-3 gap-3 mt-5">
              {getThemes()}
            </div>
          </CardContent>
        ) : (
          <CardContent className="md:py-10 md:pl-20 ">
            {getThemes()}
          </CardContent>
        )}
      </Card>
    </div>
  );
};
