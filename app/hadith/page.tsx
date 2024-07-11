import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import Link from "next/link";

export default async function ThemesHadithsPage() {
  const books = await prisma.hadithBook.findMany();

  const nines = books.filter(
    (b) =>
      b.titleTraductionEn === "Muwatta Malik" ||
      b.titleTraductionEn === "Sunan Abi Dawud" ||
      b.titleTraductionEn === "Musnad Ahmad ibn Hanbal" ||
      b.titleTraductionEn === "Sahih al-Bukhari" ||
      b.titleTraductionEn === "Sunan al-Darimi" ||
      b.titleTraductionEn === "Sunan Ibn Majah" ||
      b.titleTraductionEn === "Sahih Muslim" ||
      b.titleTraductionEn === "Sunan al-Nasa'i" ||
      b.titleTraductionEn === "Jami' al-Tirmidhi"
  );

  const fourtys = books.filter(
    (b) =>
      b.titleTraductionEn === "The Forty Hadith of Imam Nawawi" ||
      b.titleTraductionEn === "The Forty Hadith Qudsi" ||
      b.titleTraductionEn === "The Forty Hadith of Shah Waliullah"
  );

  const others = books.filter(
    (b) =>
      b.titleTraductionEn === "Al-Adab Al-Mufrad" ||
      b.titleTraductionEn === "Bulugh al-Maram" ||
      b.titleTraductionEn === "Mishkat al-Masabih" ||
      b.titleTraductionEn === "Riyad as-Salihin" ||
      b.titleTraductionEn === "Shama'il Muhammadiyah"
  );
  return (
    <div className="space-y-10">
      <h2 className="text-center text-4xl md:text-6xl mb-10">
        Ouvrages du hadith
      </h2>
      <div>
        <h3 className="text-left text-2xl md:text-4xl mb-5">
          Les 9 classiques du hadith
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {nines.map((b) => (
            <Link href={`/hadith/${b.id}`} key={b.id}>
              <Card className="h-full transition  delay-150 ease-in-out  hover:scale-105 hover:bg-accent duration-300">
                <CardHeader>
                  <CardTitle className="text-right space-y-2">
                    <p>{b.title}</p>
                    <p>{b.titleTraductionEn}</p>
                  </CardTitle>
                  <CardDescription className="text-2xl text-right">
                    {b.author}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <hr className="mx-auto w-1/2 border-primary" />
      <div>
        <h2 className="text-left text-2xl md:text-4xl mb-5">Les 40</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {fourtys.map((b) => (
            <Link href={`/hadith/${b.id}`} key={b.id}>
              <Card className="h-full transition  delay-150 ease-in-out  hover:scale-105 hover:bg-accent duration-300">
                <CardHeader>
                  <CardTitle className="text-right space-y-2">
                    <p>{b.title}</p>
                    <p>{b.titleTraductionFr}</p>
                  </CardTitle>
                  <CardDescription className="text-2xl text-right">
                    {b.author}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <hr className="mx-auto w-1/2 border-primary" />
      <div>
        <h2 className="text-left text-2xl md:text-4xl mb-5">Autes ouvrages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          {others.map((b) => (
            <Link href={`/hadith/${b.id}`} key={b.id}>
              <Card className="h-full transition  delay-150 ease-in-out  hover:scale-105 hover:bg-accent duration-300">
                <CardHeader>
                  <CardTitle className="text-right space-y-2">
                    <p>{b.title}</p>
                    <p>{b.titleTraductionEn}</p>
                  </CardTitle>
                  <CardDescription className="text-2xl text-right">
                    {b.author}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
