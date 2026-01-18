"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { UploadZone } from "@/components/upload-zone";
import { CitationCardList } from "@/components/citation-card-list";
import { extractTextFromPDF, extractCitations, Citation } from "@/lib/pdf-parser";
import { searchCrossref, searchSemanticScholar, searchOpenAlex, calculateConfidence, calculateConfidenceWithBreakdown, SearchResult } from "@/lib/search-api";
import { WarningBanner } from "@/components/warning-banner";
import { Language, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export default function Home() {
  // State
  const [lang, setLang] = useState<Language>("ja");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [searchResults, setSearchResults] = useState<Record<string, SearchResult>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploaded, setLastUploaded] = useState<{ name: string, size: number } | null>(null);

  const t = translations[lang];

  // Logic
  const startProgressiveSearch = useCallback(async (citationsToSearch: Citation[]) => {
    // Process in batches of 3
    const BATCH_SIZE = 3;

    for (let i = 0; i < citationsToSearch.length; i += BATCH_SIZE) {
      const batch = citationsToSearch.slice(i, i + BATCH_SIZE);

      await Promise.all(batch.map(async (citation) => {
        // Construct query: Clean up title or use raw text
        let textToClean = citation.title || citation.raw.substring(0, 100);

        // Fix hyphenated words broken by newlines/spaces (e.g. "Address-\n ing" -> "Address- ing" -> "Addressing")
        // Only matches if there is NO space before the hyphen (to avoid removing subtitle separators like "Title - Subtitle")
        textToClean = textToClean.replace(/(\w)-\s+(\w)/g, "$1$2");

        // Ensure newlines are replaced by spaces to prevent search issues
        const rawQuery = textToClean.replace(/[^\w\s]/g, " ");
        const query = rawQuery.replace(/\s+/g, " ").trim();

        try {
          // Progressive Search Strategy
          // 1. Try Crossref (Returns top 3)
          let papers = await searchCrossref(query);
          let source: "crossref" | "semantic_scholar" | "openalex" | null = papers.length > 0 ? "crossref" : null;

          // Find best match in Crossref results
          let bestPaper = null;
          let bestConfidence = 0;
          let bestBreakdown = undefined;

          for (const p of papers) {
            const { score, breakdown } = calculateConfidenceWithBreakdown(citation, p);
            if (score > bestConfidence) {
              bestConfidence = score;
              bestBreakdown = breakdown;
              bestPaper = p;
            }
          }

          // 2. Fallback to OpenAlex if confidence is low (< 0.8)
          // (Semantic Scholar removed per user request to prioritize OpenAlex)
          if (bestConfidence < 0.8) {
            const oaPapers = await searchOpenAlex(query);
            if (oaPapers.length > 0) {

              // Find best match in OpenAlex results
              for (const p of oaPapers) {
                const { score, breakdown } = calculateConfidenceWithBreakdown(citation, p);

                // Update if this is the best found so far (across both services)
                if (score > bestConfidence) {
                  bestConfidence = score;
                  bestBreakdown = breakdown;
                  bestPaper = p;
                  source = "openalex";
                }
              }
            }
          }

          const found = !!bestPaper;

          const result: SearchResult = {
            citation,
            found: found && bestConfidence > 0.4,
            source: source,
            paper: bestPaper || undefined,
            confidence: found ? bestConfidence : 0,
            confidenceBreakdown: found ? bestBreakdown : undefined,
            query: query // Debug info
          };

          setSearchResults(prev => ({
            ...prev,
            [citation.id]: result
          }));
        } catch (error) {
          console.error("Search failed for citation", citation.id, error);
          const result: SearchResult = {
            citation,
            found: false,
            source: null,
            confidence: 0,
            error: "Search failed",
            query: query // Debug info
          };
          setSearchResults(prev => ({
            ...prev,
            [citation.id]: result
          }));
        }
      }));

      // Delay for rate limiting
      await new Promise(resolve => setTimeout(resolve, 600));
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    if (lastUploaded && file.name === lastUploaded.name && file.size === lastUploaded.size) {
      toast.warning(lang === "ja" ? "すでに同じPDFがアップロードされています" : "This PDF has already been uploaded");
      return;
    }

    setIsProcessing(true);
    setUploadError(null);
    setCitations([]);
    setSearchResults({});

    try {
      const text = await extractTextFromPDF(file);
      const extracted = extractCitations(text);

      if (extracted.length === 0) {
        setUploadError(t.noCitations);
        setIsProcessing(false);
        return;
      }

      setCitations(extracted);
      setIsProcessing(false);
      setLastUploaded({ name: file.name, size: file.size });
      startProgressiveSearch(extracted);


    } catch (err) {
      console.error(err);
      setUploadError(t.parseError);
      setIsProcessing(false);
    }
  };

  const detectedStyle = citations.length > 0 ? citations[0].style || null : null;
  // Count items that have been searched (result exists) AND found is false
  const notFoundCount = Object.values(searchResults).filter(r => r && !r.found).length;

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E2DD]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-sans font-bold tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity">
              {t.title}
            </a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-[#FAF9F7] rounded-full p-1 border border-[#E5E2DD]">
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full transition-all duration-200",
                  lang === "en" ? "bg-white text-[#DA7756] shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLang("ja")}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full transition-all duration-200",
                  lang === "ja" ? "bg-white text-[#DA7756] shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                日本語
              </button>
            </div>

            <a href="https://github.com/sotaro-ha/cite-checker" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/40 hover:text-muted-foreground transition-colors p-1" aria-label="GitHub Repository">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {t.subtitle}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed">
            {t.description}
          </p>

          <div className="pt-2 flex justify-center gap-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
            <span>Local Processing</span>
            <span className="text-[#DA7756]">•</span>
            <span>Crossref & Semantic Scholar</span>
          </div>
        </div>

        {/* Upload Section */}
        <section className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-100 via-[#DA7756]/10 to-gray-100 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <UploadZone onFileSelected={handleFileSelect} isLoading={isProcessing} lang={lang} />
          </div>
          {uploadError && (
            <div className="mt-6 p-4 bg-red-50 text-red-700/80 rounded-lg text-sm text-center border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
              {uploadError}
            </div>
          )}
        </section>

        {/* Instructions / Privacy Note */}
        {citations.length === 0 && (
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-normal border-t border-[#E5E2DD] pt-8 inline-block px-4 sm:px-12 max-w-2xl">
              {t.privacy}
            </p>
          </div>
        )}

        {/* Results Section */}
        {citations.length > 0 && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-backwards">
            {/* Warning Banner */}
            {notFoundCount > 0 && (
              <div className="max-w-3xl mx-auto">
                <WarningBanner count={notFoundCount} lang={lang} />
              </div>
            )}

            <CitationCardList
              citations={citations}
              results={searchResults}
              detectedStyle={detectedStyle}
              lang={lang}
            />

            <div className="flex justify-center pt-8 pb-12">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => {
                    setCitations([]);
                    setSearchResults({});
                  }, 500);
                }}
                className="text-sm text-muted-foreground hover:text-[#DA7756] transition-colors underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-[#DA7756]/50"
              >
                {t.checkAnother}
              </button>
            </div>
          </section>
        )}
      </div>

      <footer className="py-8 text-center border-t border-[#E5E2DD]/50 mt-12 bg-white/50 flex flex-col gap-2 items-center justify-center">
        <a href="/disclaimer" className="text-xs text-muted-foreground/60 hover:text-muted-foreground hover:underline transition-colors">
          免責事項 (Disclaimer)
        </a>
      </footer>
    </main>
  );
}
