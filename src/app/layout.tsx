import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cite Checker - 引用の信頼性を確かめる (Verify Citations)",
  description: "Free PDF citation verifier. Upload your manuscript to check if references exist. Uses Crossref & OpenAlex. 論文の引用文献を自動チェック。ハルシネーション検出、参考文献の検証に。",
  keywords: [
    // Japanese
    "引用チェック", "引用検証", "論文", "査読", "参考文献", "自動チェック", "ハルシネーション", "捏造検出", "PDF解析", "研究", "大学院",
    // English
    "citation checker", "reference verifier", "citation verification", "pdf citation check",
    "hallucination detector", "fake citation check", "academic integrity", "research tools",
    "Crossref", "OpenAlex", "bibliography check", "manuscript tools"
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
