"use client";

import {
  AyatWithTitre,
  searchAyats,
} from "@/components/serverActions/coranAction";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/searchInput";
import { cleanTashkeel } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { Pagination } from "../transverse/pagination";
import { AyatCard } from "../ayat/ayatCard";

type props = {
  ifSomeSearch: (is: boolean) => void;
};

export const SearchAyat: React.FC<props> = ({ ifSomeSearch }) => {
  const [search, setSearch] = useState<string>("");
  const [ayats, setAyats] = useState<AyatWithTitre[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const PAGE_SIZE = 10;

  const fetchAyats = useCallback(
    async (searchTerm: string, pageNumber: number): Promise<void> => {
      if (!searchTerm.trim()) {
        setAyats([]);
        setTotalPages(1);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchAyats(searchTerm, pageNumber, PAGE_SIZE);
        setAyats(result.ayats);
        setTotalPages(Math.ceil(result.totalCount / PAGE_SIZE));
        setPage(pageNumber);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(async (): Promise<void> => {
    setPage(1);
    await fetchAyats(search, 1);
  }, [search, fetchAyats]);

  const handlePageChange = useCallback(
    (newPage: number): void => {
      fetchAyats(search, newPage);
    },
    [search, fetchAyats]
  );

  // Mettre à jour ifSomeSearch quand les ayats changent
  const hasResults = ayats.length > 0;
  ifSomeSearch(hasResults);

  const highlightSearchTerm = (
    text: string,
    searchTerm: string
  ): JSX.Element => {
    if (!searchTerm.trim()) {
      return <>{text}</>;
    }
    const harakats = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0671]/g;
    const textWithoutHarakat = cleanTashkeel(text);
    const searhWithoutHarakats = cleanTashkeel(searchTerm);

    const regex = new RegExp(`(${searhWithoutHarakats})`, "gi");
    const parts = textWithoutHarakat.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part.replace(harakats, "")) ? (
            <span key={index} className="bg-yellow-400">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const hitlightSearchTrad = (search: string, traduction: string | null) => {
    if (!traduction) {
      return "";
    }
    const regex = new RegExp(`(${search})`, "gi");
    const parts = traduction.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span key={index} className="bg-yellow-400">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <SearchInput
          onSearch={(value: string) => {
            if (value === "") {
              setAyats([]);
            }
            setSearch(value);
          }}
          search={search}
          placeHolder="Rechercher dans le coran"
        />
        <Button onClick={handleSearch}>Rechercher</Button>
      </div>

      {hasResults && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <div className="space-y-4">
        <div className="mt-5 space-y-5">
          {ayats.map((a) => (
            <div key={a.id} className="border-b-2 space-y-3 bg-card p-3">
              <div className="">
                {" "}
                Sourate {a.sourate_number} verset {a.number}{" "}
                <span>{a.titre}</span>
              </div>
              <p className="text-2xl text-right">
                {highlightSearchTerm(a.content, search)}
              </p>
              <p>{hitlightSearchTrad(search, a.traduction)}</p>
            </div>
          ))}
        </div>

        {hasResults && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};
