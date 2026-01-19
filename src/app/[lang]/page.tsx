"use client";

import { useState, useCallback, use, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { UploadZone } from "@/components/upload-zone";
const CitationCardList = dynamic(() => import("@/components/citation-card-list").then(mod => mod.CitationCardList), {
  ssr: false,
  loading: () => <div className="h-96 w-full animate-pulse bg-gray-50/50 rounded-xl border border-gray-100" />
});
import { extractTextFromPDF, extractCitations, Citation } from "@/lib/pdf-parser";
import { searchCrossref, searchSemanticScholar, searchOpenAlex, calculateConfidence, calculateConfidenceWithBreakdown, SearchResult } from "@/lib/search-api";
import { HomeContent } from "@/components/home-content";
import { WarningBanner } from "@/components/warning-banner";
import { Language, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  // Unwrap params
  const { lang } = use(params) as { lang: Language };

  // State
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
          // Progressive Search Strategy (async-parallel optimization)
          // Start both API calls in parallel speculatively
          const crossrefPromise = searchCrossref(query);
          const openAlexPromise = searchOpenAlex(query);

          // 1. Wait for Crossref first (primary source)
          const papers = await crossrefPromise;
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

          // 2. Use OpenAlex results if confidence is low (< 0.8)
          // OpenAlex request was already started in parallel
          if (bestConfidence < 0.8) {
            const oaPapers = await openAlexPromise;
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

      // Start Progressive Enrichment (Non-blocking)
      (async () => {
        const BATCH_SIZE = 5;
        try {
          // toast.info(lang === "ja" ? "バックグラウンドでGrobid解析中..." : "Enriching with Grobid in background...", { duration: 3000 });

          for (let i = 0; i < extracted.length; i += BATCH_SIZE) {
            const batchSlice = extracted.slice(i, i + BATCH_SIZE);
            const rawBatch = batchSlice.map(c => c.raw);

            try {
              const response = await fetch("/api/grobid", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ citations: rawBatch }),
              });

              if (response.ok) {
                const data = await response.json();
                const grobidResults = data.results;

                setCitations(prevCitations => {
                  const nextCitations = [...prevCitations];
                  const enrichedBatch: Citation[] = [];

                  batchSlice.forEach((c, idx) => {
                    const g = grobidResults[idx];
                    if (g) {
                      const globalIndex = i + idx;
                      if (nextCitations[globalIndex]) {
                        nextCitations[globalIndex] = {
                          ...nextCitations[globalIndex],
                          title: g.title || nextCitations[globalIndex].title,
                          authors: g.authors || nextCitations[globalIndex].authors,
                          venue: g.venue || nextCitations[globalIndex].venue,
                          year: g.year || nextCitations[globalIndex].year,
                          isGrobidEnriched: true,
                        };
                        enrichedBatch.push(nextCitations[globalIndex]);
                      }
                    } else {
                      enrichedBatch.push(c);
                    }
                  });

                  // Search these new enriched citations
                  startProgressiveSearch(enrichedBatch);

                  return nextCitations;
                });

              } else {
                console.error("Grobid batch failed");
                startProgressiveSearch(batchSlice); // Fallback search
              }
            } catch (e) {
              console.error("Grobid batch error", e);
              startProgressiveSearch(batchSlice); // Fallback search
            }

            // Small delay to be polite
            await new Promise(r => setTimeout(r, 200));
          }
        } catch (err) {
          console.error("Grobid enrichment process error", err);
        }
      })();

      setIsProcessing(false);
      setLastUploaded({ name: file.name, size: file.size });

    } catch (err) {
      console.error(err);
      setUploadError(t.parseError);
      setIsProcessing(false);
    }
  };

  // Memoize derived values to avoid recalculation on every render (rerender-memo)
  const detectedStyle = useMemo(
    () => citations.length > 0 ? citations[0].style || null : null,
    [citations]
  );
  const notFoundCount = useMemo(
    () => Object.values(searchResults).filter(r => r && !r.found).length,
    [searchResults]
  );

  return (
    <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#1A1A1A] leading-tight text-balance">
            {t.subtitle}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed text-pretty">
            {t.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-sm text-muted-foreground/80 font-medium">
            <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4 text-[#DA7756]" aria-hidden="true" /> {t.heroBullet1}</span>
            <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4 text-[#DA7756]" aria-hidden="true" /> {t.heroBullet2}</span>
            <span className="flex items-center justify-center gap-1.5"><Check className="w-4 h-4 text-[#DA7756]" aria-hidden="true" /> {t.heroBullet3}</span>
          </div>
        </div>

        {/* Upload Section */}
        <section className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-[#DA7756]/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative">
            <UploadZone onFileSelected={handleFileSelect} isLoading={isProcessing} lang={lang} />
          </div>
          {/* rendering-conditional-render: use ternary instead of && */}
          {uploadError ? (
            <div className="mt-6 p-4 bg-red-50 text-red-700/80 rounded-lg text-sm text-center border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
              {uploadError}
            </div>
          ) : null}
        </section>

        {/* Instructions / Privacy Note */}
        {citations.length === 0 ? (
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed font-normal border-t border-[#E5E2DD] pt-8 inline-block px-4 sm:px-12 max-w-2xl">
              {t.privacy} <Link href={`/${lang}/disclaimer`} className="underline hover:text-muted-foreground transition-colors ml-1">{t.disclaimerLink}</Link>
            </p>

            {/* Rich Content for AdSense / SEO */}
            <HomeContent lang={lang} />
          </div>
        ) : null}

        {/* Results Section */}
        {citations.length > 0 ? (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-backwards">
            {/* Warning Banner */}
            {notFoundCount > 0 ? (
              <div className="max-w-3xl mx-auto">
                <WarningBanner count={notFoundCount} lang={lang} />
              </div>
            ) : null}

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
        ) : null}
      </div>
    </main>
  );
}
