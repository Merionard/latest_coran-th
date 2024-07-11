"use client";
import { sourate } from "@prisma/client";
import { SearchAyat } from "./searchAyat";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { NextFont } from "next/dist/compiled/@next/font";
import { useState } from "react";

type props = {
  sourates: sourate[];
  font: NextFont;
};
export const PageCoran = ({ sourates, font }: props) => {
  const [isSomeSearch, setIsSomeSearch] = useState(false);
  return (
    <div>
      <SearchAyat ifSomeSearch={setIsSomeSearch} />
      {!isSomeSearch && (
        <div className="space-y-5">
          {sourates.map((s) => (
            <Card
              className="flex justify-center items-center gap-5"
              key={s.number}
            >
              <Link href={`coran/${s.number}`}>
                <div
                  className={
                    font.className +
                    " text-3xl h-14 flex justify-center items-center"
                  }
                >
                  <p>
                    {s.number} {s.titre}
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
