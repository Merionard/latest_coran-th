"use client";
import {
  HadithSearch,
  searchHadiths,
} from "@/components/serverActions/hadithAction";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/searchInput";
import { cleanTashkeel } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { Pagination } from "../transverse/pagination";
import Link from "next/link";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  isArabic?: boolean;
}

interface HadithCardProps {
  hadith: HadithSearch;
  searchTerm: string;
}

// Composant pour la mise en évidence du texte
const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  isArabic = false,
}) => {
  if (!searchTerm.trim() || !text) return <>{text}</>;

  const processText = (t: string): { processed: string; search: string } => {
    if (isArabic) {
      const textWithoutHarakat = cleanTashkeel(t);
      const searchWithoutHarakat = cleanTashkeel(searchTerm);
      return { processed: textWithoutHarakat, search: searchWithoutHarakat };
    }
    return { processed: t, search: searchTerm };
  };

  const { processed, search } = processText(text);
  const regex = new RegExp(`(${search})`, "gi");
  const parts = processed.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(
          part.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0671]/g, "")
        ) ? (
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

// Composant HadithCard
const HadithCard: React.FC<HadithCardProps> = ({ hadith, searchTerm }) => (
  <div className="border rounded-lg shadow-sm bg-card p-4 space-y-3 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-primary">
        {hadith.titleTraductionFr}
      </h3>
      <Link
        href={`/hadith/${hadith.bookId}/${hadith.chapterId}`}
        target="_blank"
      >
        <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded-full">
          Hadith n°{hadith.hadithReference}
        </span>
      </Link>
    </div>
    <p className="text-2xl text-right leading-relaxed">
      <HighlightedText
        text={hadith.content}
        searchTerm={searchTerm}
        isArabic={true}
      />
    </p>
    <p className="text-gray-700">
      <HighlightedText
        text={hadith.traductionFr ?? ""}
        searchTerm={searchTerm}
      />
    </p>
  </div>
);

// Composant principal
export const SearchHadith: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [hadiths, setHadiths] = useState<HadithSearch[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const PAGE_SIZE = 10;

  const fetchHadiths = useCallback(
    async (searchTerm: string, pageNumber: number): Promise<void> => {
      if (!searchTerm.trim()) {
        setHadiths([]);
        setTotalPages(1);
        return;
      }

      setIsLoading(true);
      try {
        const result = await searchHadiths(searchTerm, pageNumber, PAGE_SIZE);
        setHadiths(result.hadiths);
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
    await fetchHadiths(search, 1);
  }, [search, fetchHadiths]);

  const handlePageChange = useCallback(
    (newPage: number): void => {
      fetchHadiths(search, newPage);
    },
    [search, fetchHadiths]
  );

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
          onSearch={setSearch}
          search={search}
          placeHolder="Rechercher hadiths"
        />
        <Button onClick={handleSearch}>Rechercher</Button>
      </div>

      {hadiths.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <div className="space-y-4">
        {hadiths.map((hadith) => (
          <HadithCard key={hadith.id} hadith={hadith} searchTerm={search} />
        ))}
      </div>

      {hadiths.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchHadith;
