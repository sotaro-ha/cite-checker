import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  metadataBase: new URL("https://cite-checker.vercel.app"),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Cite Checker",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free PDF citation verifier. Upload your manuscript to check if references exist using Crossref & OpenAlex.",
            }),
          }}
        />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ""} />
      </body>
    </html>
  );
}
