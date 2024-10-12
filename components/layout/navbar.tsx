"use client";

import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuthentBtn } from "../clientComponents/auth/authentBtn";
import { ModeToggle } from "./modeToggle";

export const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { data: session } = useSession();

  const links = [
    { name: "coran", url: "/coran", needSession: false },
    { name: "thèmes coraniques", url: "/themes_coran", needSession: false },
    { name: "hadith", url: "/hadith", needSession: false },
    { name: "mes ayats", url: "/mes_ayats", needSession: true },
    { name: "mes thèmes", url: "/mes_themes", needSession: true },
    { name: "mes hadiths", url: "/mes_hadiths", needSession: true },
    { name: "A apprendre", url: "/a_apprendre", needSession: false },
    { name: "revisions", url: "/revisions", needSession: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 h-20 bg-background p-5 md:flex md:justify-end tracking-widest shadow-md transition-transform duration-300 z-10 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="hidden md:flex items-center gap-5">
          {links
            .filter((l) => {
              if (session) {
                return true;
              } else {
                return !l.needSession;
              }
            })
            .map((l) => (
              <Link
                key={l.name}
                href={l.url}
                className="cursor-pointer uppercase"
              >
                {l.name}
              </Link>
            ))}
          <ModeToggle />
          <AuthentBtn onMobile={false} />
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 md:hidden ">
          <ModeToggle />
          <div className="flex items-center gap-3">
            {showMobileMenu ? (
              <X
                onClick={() => setShowMobileMenu(false)}
                className="cursor-pointer"
              />
            ) : (
              <Menu
                onClick={() => setShowMobileMenu(true)}
                className="cursor-pointer"
              />
            )}
            <AuthentBtn onMobile={true} />
          </div>
        </div>
      </nav>
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      <ul
        id="mobileMenu"
        className={`fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-card flex flex-col z-30 transition-all duration-500 ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {links
          .filter((l) => {
            if (session) {
              return true;
            } else {
              return !l.needSession;
            }
          })
          .map((l) => (
            <Link
              key={l.name}
              href={l.url}
              className="p-4 border-b rounded-xl duration-300 cursor-pointer border-gray-600 uppercase"
              onClick={() => setShowMobileMenu(false)}
            >
              {l.name}
            </Link>
          ))}
      </ul>
    </>
  );
};
