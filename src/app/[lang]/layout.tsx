import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { FeedbackButton } from "@/components/feedback-button";
import { Language } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = (await params) as { lang: Language };

  const title = lang === 'en'
    ? "Cite Checker - Privacy-First Citation Verifier (No AI Hallucinations)"
    : "Cite Checker - 引用の信頼性を確かめる (完全ローカル・AIなし)";

  const description = lang === 'en'
    ? "Secure, local PDF citation checker. Detects fake references directly from Crossref/OpenAlex. No AI hallucinations."
    : "PDFの引用文献を完全ローカルで検証。AIハルシネーションなしで、Crossref/OpenAlexと直接照合します。";

  return {
    title,
    description,
    keywords: [
      "citation checker", "reference verifier", "privacy first", "no ai", "Crossref", "OpenAlex",
      "引用チェック", "引用検証", "AIなし", "完全ローカル", "ハルシネーション対策"
    ],
    metadataBase: new URL("https://cite-checker.vercel.app"),
  };
}

export async function generateStaticParams() {
  return [{ lang: 'ja' }, { lang: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = (await params) as { lang: Language };

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
        <FeedbackButton />
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
