"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <>
      {theme === "dark" ? (
        <SunIcon
          className="h-[1.2rem] w-[1.2rem]   scale-100 transition-all dark:-rotate-90 cursor-pointer dark:scale-110"
          onClick={toggleTheme}
        />
      ) : (
        <MoonIcon
          className=" h-[1.2rem] w-[1.2rem]   transition-all dark:rotate-0 cursor-pointer light:scale-110 "
          onClick={toggleTheme}
        />
      )}
    </>
  );
}
