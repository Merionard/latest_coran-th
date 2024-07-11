import { cn } from "@/lib/utils";
import { prisma } from "@/prisma/client";
import Link from "next/link";

export default async function BookPage({
  params,
}: {
  params: { bookId: string };
}) {
  const chapters = await prisma.hadithChapter.findMany({
    where: { hadith_book_id: Number(params.bookId) },
    include: { hadiths: true },
  });

  return (
    <div className="mx-auto md:w-2/3 ">
      {chapters.map((c, i) => (
        <Link href={`/hadith/${params.bookId}/${c.id}`} key={c.id}>
          <div
            className={cn("flex justify-between items-center p-3 rounded-md", {
              "bg-secondary": i % 2 === 0,
            })}
          >
            <div className="flex gap-2 md:gap-5">
              <p>{i + 1}</p>
              <p>
                {c.titleFr} ({c.hadiths.length})
              </p>
            </div>
            <p className="text-xl md:text-3xl">{c.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
