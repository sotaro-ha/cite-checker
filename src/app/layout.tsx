import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { FeedbackButton } from "@/components/feedback-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cite Checker - Privacy-First Citation Verifier (No AI Hallucinations)",
  description: "Secure, local PDF citation checker. Your manuscript never leaves your device. Detects fake references using Crossref/OpenAlex without generative AI. 論文の引用を完全ローカルで検証。AIハルシネーションなし。",
  keywords: [
    // Japanese
    "引用チェック", "引用検証", "完全ローカル", "プライバシー重視", "AIなし", "ハルシネーション対策", "論文", "査読", "参考文献", "捏造検出",
    // English
    "citation checker", "local pdf verifier", "privacy first", "no ai hallucination", "deterministic verification",
    "reference check", "academic integrity", "Crossref", "OpenAlex", "secure manuscript check"
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
