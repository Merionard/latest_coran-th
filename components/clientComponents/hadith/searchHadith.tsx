"use client";

import {
  FirstSearchHadiths,
  HadithSearch,
  searchHadiths,
} from "@/components/serverActions/hadithAction";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/searchInput";
import { cleanTashkeel } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useState } from "react";

export const SearchHadith = () => {
  const [search, setSearch] = useState("");
  const [hadiths, setHadiths] = useState<HadithSearch[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  const fetchHadiths = async (searchTerm: string, pageNumber: number) => {
    if (totalPages === 1) {
      FirstSearchHadiths(searchTerm, pageNumber, pageSize).then((result) => {
        setHadiths(result.ayats);
        setTotalPages(Math.ceil(result.totalCount / pageSize));
        setPage(pageNumber);
        setIsLoading(false);
      });
    } else {
      searchHadiths(searchTerm, pageNumber, pageSize).then((result) => {
        setHadiths(result.ayats);
        setPage(pageNumber);
        setIsLoading(false);
      });
    }

    setIsLoading(true);
  };

  const onSetSearch = async () => {
    if (search === "") {
      setHadiths([]);
      setPage(1);
      setTotalPages(1);
      return;
    }
    setPage(1); // Reset to first page on new search
    await fetchHadiths(search, 1);
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchHadiths(search, newPage);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      await fetchHadiths(search, newPage);
    }
  };
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

  const getPagninationBtn = () => {
    const buttons = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === page ? "default" : "secondary"}
            onClick={() => fetchHadiths(search, i)}
          >
            {i}
          </Button>
        );
      }
      return buttons;
    } else {
      const indexPages = [1, 2, 3, totalPages];
      if (!indexPages.includes(page)) {
        indexPages.push(page);
        if (page > 3) {
          indexPages.splice(0, 3);
          indexPages.push(page - 1);
          indexPages.push(page - 2);
          indexPages.push(page - 3);
        }
        indexPages.sort((a, b) => a - b);
      }
      return indexPages.map((i) => (
        <Button
          key={i}
          variant={i === page ? "default" : "secondary"}
          onClick={() => fetchHadiths(search, i)}
        >
          {i}
        </Button>
      ));
    }
  };

  if (isLoading) {
    return <Loader className="animate-spin mx-auto" />;
  }

  const onSearch = (value: string) => {
    if (value === "") {
      setHadiths([]);
    }
    setSearch(value);
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

  return (
    <div>
      <div className="flex justify-end gap-2">
        <SearchInput
          onSearch={onSearch}
          search={search}
          placeHolder="Rechercher hadiths"
        />
        <Button onClick={onSetSearch}>Rechercher</Button>
      </div>

      {hadiths.length > 0 && (
        <div className="flex justify-center mt-5 gap-3 items-center">
          <Button
            onClick={handlePreviousPage}
            size={"icon"}
            disabled={page === 1}
            className="disabled:bg-gray-400"
          >
            <ChevronLeft />
          </Button>
          {getPagninationBtn()}
          <Button
            onClick={handleNextPage}
            size={"icon"}
            disabled={page === totalPages}
            className="disabled:bg-gray-400"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <div className="mt-5 space-y-5">
        {hadiths.map((hadith) => (
          <div key={hadith.id} className="border-b-2 space-y-3 bg-card p-3">
            <div className="flex justify-between">
              <p className="text-xl font-bold text-primary">
                {hadith.titleTraductionFr}
              </p>
              <p className="font-bold">
                Hadith numéro:{hadith.hadithReference}
              </p>
            </div>
            <p className="text-2xl text-right">
              {highlightSearchTerm(hadith.content, search)}
            </p>
            <p>{hitlightSearchTrad(search, hadith.traductionFr)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
