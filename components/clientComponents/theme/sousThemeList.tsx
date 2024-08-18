"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type props = {
  subThemes: {
    id: number;
    name: string;
    parentId: number | null;
    description: string | null;
    order: number | null;
  }[];
};

export const SousThemeList = ({ subThemes }: props) => {
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [subThemes]);

  const handleClickOutside = (event: MouseEvent) => {
    // @ts-expect-error js is js
    if (event.target.id === "triggerSubThemesList") {
      setShowList((prev) => !prev);
    }
    if (
      event.target &&
      // @ts-expect-error js is js
      event.target.id !== "triggerSubThemesList" &&
      // @ts-expect-error js is js
      event.target.id !== "subThemesList"
    ) {
      setShowList(false);
    }
  };

  return (
    <div className="md:hidden">
      {subThemes.length > 0 && (
        <Button id="triggerSubThemesList">
          <Eye className="mr-1" /> sous-Themes({subThemes.length})
        </Button>
      )}

      <div
        id="subThemesList"
        className={
          showList
            ? "fixed md:hidden left-0 bottom-1/4 w-[60%]  border-r  ease-in-out duration-500 bg-card flex flex-col z-10 pt-2 "
            : "ease-in-out w-[60%] duration-500 fixed bottom-1/4  left-[-100%]  flex flex-col "
        }
      >
        <p className="text-2xl font-bold text-center text-orange-500">
          Sous thèmes
        </p>
        {subThemes.map((subTheme) => (
          <Link
            href={`/themes_coran/${subTheme.id}`}
            key={subTheme.id}
            className="p-4 border-b rounded-xl duration-300  cursor-pointer border-gray-600   uppercase"
          >
            {subTheme.name}
          </Link>
        ))}
      </div>
    </div>
  );
};
