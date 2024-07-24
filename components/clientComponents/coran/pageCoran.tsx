"use client";
import { SourateWhithAyat } from "@/components/serverComponents/ThemeSearchAyat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { AyatCoran } from "../ayat/ayatCoran";
import { SearchAyat } from "./searchAyat";

type props = {
  sourateWhithAyat: SourateWhithAyat[];
};
export const PageCoran = ({ sourateWhithAyat }: props) => {
  const [isSomeSearch, setIsSomeSearch] = useState(false);
  const [sourateSelected, setSourateSelected] = useState<number | null>(null);
  const [selectedAyatId, setSelectedAyatId] = useState<number | null>(null);

  const resetSearch = () => {
    setSourateSelected(null);
    setSelectedAyatId(null);
  };
  return (
    <div>
      <SearchAyat ifSomeSearch={setIsSomeSearch} />
      {!isSomeSearch && (
        <div className="flex mx-auto md:w-2/3 gap-3 mb-5">
          <Select onValueChange={(value) => setSourateSelected(Number(value))}>
            <SelectTrigger className=" text-xl">
              <SelectValue placeholder="Sourate" />
            </SelectTrigger>
            <SelectContent>
              {sourateWhithAyat.map((s) => (
                <SelectItem
                  value={s.number.toString()}
                  key={s.number}
                  className="text-3xl"
                >
                  {s.titre} ({s.number})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(ayat) => setSelectedAyatId(Number(ayat))}>
            <SelectTrigger className="text-xl">
              <SelectValue placeholder="Ayat" />
            </SelectTrigger>
            <SelectContent>
              {sourateWhithAyat
                .filter((s) => s.number === sourateSelected)
                .map((s) => s.ayats)
                .flatMap((a) => a)
                .map((a) => (
                  <SelectItem
                    key={a.number}
                    value={a.id.toString()}
                    className="text-xl"
                  >
                    {a.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button variant={"destructive"} onClick={resetSearch}>
            Reset selection
          </Button>
        </div>
      )}

      {!isSomeSearch &&
        !selectedAyatId &&
        sourateWhithAyat.map((s) => (
          <Link
            href={`coran/${s.number}`}
            key={s.number}
            className="block mb-3"
          >
            <Card className="flex justify-center items-center gap-5 transition  delay-150 ease-in-out  hover:scale-105 hover:bg-primary duration-300">
              <div className="flex flex-col justify-center items-center py-3 text-3xl">
                <p>
                  {s.number} {s.titre}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      {selectedAyatId &&
        sourateWhithAyat
          .map((s) => s.ayats)
          .flatMap((s) => s)
          .filter((a) => a.id === selectedAyatId)
          .map((a) => <AyatCoran ayat={a} isFavorite={false} key={a.id} />)}
    </div>
  );
};
