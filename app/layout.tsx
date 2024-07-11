import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cairo,
  Inter,
  Noto_Sans_Arabic,
  Roboto,
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const amiri = Amiri({ weight: "400", subsets: ["arabic", "latin"] });
const noto = Noto_Sans_Arabic({ subsets: ["arabic"], weight: "200" });

const roboto = Roboto({ weight: "300", subsets: ["latin"] });

const APP_NAME = "Coran thèmes";
const APP_DEFAULT_TITLE = "Coran thèmes";
const APP_TITLE_TEMPLATE = "%s - Coran thèmes";
const APP_DESCRIPTION = "Thèmes coraniques";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " "}>
        <Providers attribute="class" defaultTheme="light">
          <Navbar />
          <main className="px-2 md:container my-5 md:my-20 ">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
