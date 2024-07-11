"use client";
import { updateTheme } from "@/components/serverActions/themeCoranAction";
import { Input } from "@/components/ui/input";
import { theme } from "@prisma/client";
import { Check, Cross, Pencil, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const ThemeItem = (props: { theme: theme }) => {
  const [editMode, setEditMode] = useState(false);
  const [themeName, setThemeName] = useState(props.theme.name);

  const router = useRouter();

  const updateName = async () => {
    try {
      await updateTheme(themeName, props.theme.id);
      setEditMode(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <li className="flex gap-3 items-center">
      {editMode ? (
        <Input
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          className="w-44 my-2"
        />
      ) : (
        <Link
          href={`/themes_coran/${props.theme.id}`}
          className={props.theme.parentId === null ? "font-bold text-xl" : ""}
        >
          {props.theme.name}
        </Link>
      )}
      {editMode ? (
        <div className="flex gap-2">
          <Check className="w-4 " onClick={updateName} />
          <X className="w-4" onClick={() => setEditMode(false)} />
        </div>
      ) : (
        <Pencil className="w-4 " onClick={() => setEditMode((prev) => !prev)} />
      )}
    </li>
  );
};
