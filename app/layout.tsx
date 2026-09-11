import type { Metadata } from "next";
import { Noto_Sans_Tamil, Noto_Serif_Tamil } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonAnimationProvider from "@/components/ButtonAnimationProvider";
import { churchInfo } from "@/data/church";

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-tamil",
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["tamil"],
  weight: ["500", "600", "700"],
  variable: "--font-tamil-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://csichristchurchkallidaikurichi.com"),
  title: {
    default: `${churchInfo.name} (${churchInfo.nameEnglish}) | கல்லிடைக்குறிச்சி`,
    template: `%s | ${churchInfo.name}`,
  },
  description: `${churchInfo.name} — கல்லிடைக்குறிச்சி திருச்சபை. ஆராதனை நேரங்கள், பிரசங்கங்கள், நிகழ்வுகள், ஊழியங்கள் மற்றும் ஜெப உதவி.`,
  icons: {
    icon: churchInfo.logo,
    apple: churchInfo.logo,
  },
  openGraph: {
    title: `${churchInfo.name} - ${churchInfo.nameEnglish}`,
    description: `${churchInfo.tagline} • கல்லிடைக்குறிச்சி`,
    locale: "ta_IN",
    type: "website",
    images: [
      {
        url: churchInfo.logo,
        width: 800,
        height: 800,
        alt: churchInfo.name,
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta" className={`${notoSansTamil.variable} ${notoSerifTamil.variable}`}>
      <body className="font-tamil antialiased bg-slate-50 text-slate-900 selection:bg-gold selection:text-navy-950">
        <ButtonAnimationProvider />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
