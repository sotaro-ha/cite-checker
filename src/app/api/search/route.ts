import { NextRequest } from "next/server";
import {
    searchCrossref,
    searchGoogle,
    searchOpenAlex,
    calculateConfidenceWithBreakdown,
    SearchResult,
    ConfidenceBreakdown,
} from "@/lib/search-api";
import { Citation } from "@/lib/citation-types";

// Separate connection pools
const CROSSREF_MAX_CONCURRENT = 5;
const OPENALEX_MAX_CONCURRENT = 1;

// Confidence threshold for accepting a match
const CONFIDENCE_THRESHOLD = 0.6;

// Semaphore for controlling concurrent access
class Semaphore {
    private permits: number;
    private waiting: (() => void)[] = [];

    constructor(permits: number) {
        this.permits = permits;
    }

    async acquire(): Promise<void> {
        if (this.permits > 0) {
            this.permits--;
            return;
        }
        return new Promise((resolve) => {
            this.waiting.push(resolve);
        });
    }

    release(): void {
        if (this.waiting.length > 0) {
            const next = this.waiting.shift();
            next?.();
        } else {
            this.permits++;
        }
    }
}

// Create semaphores for each API
const crossrefSemaphore = new Semaphore(CROSSREF_MAX_CONCURRENT);
const openAlexSemaphore = new Semaphore(OPENALEX_MAX_CONCURRENT);

async function searchCrossrefWithLimit(query: string) {
    await crossrefSemaphore.acquire();
    try {
        return await searchCrossref(query);
    } finally {
        crossrefSemaphore.release();
    }
}

async function searchOpenAlexWithLimit(query: string) {
    await openAlexSemaphore.acquire();
    try {
        return await searchOpenAlex(query);
    } finally {
        openAlexSemaphore.release();
    }
}

async function processCitation(
    citation: Citation,
    googleApiKey?: string,
    googleSearchEngineId?: string
): Promise<SearchResult> {
    let searchQuery = citation.title || citation.raw.substring(0, 100);

    // Fix hyphenated words broken by newlines/spaces (e.g. "Address-\n ing" -> "Address- ing" -> "Addressing")
    // Only matches if there is NO space before the hyphen (to avoid removing subtitle separators like "Title - Subtitle")
    searchQuery = searchQuery.replace(/(\w)-\s+(\w)/g, "$1$2");

    console.log(`\n📄 [Citation #${citation.id}]`);
    console.log(`   Raw: "${citation.raw.substring(0, 80)}..."`);
    console.log(`   Extracted Title: "${citation.title || "N/A"}"`);
    console.log(`   Search Query: "${searchQuery.substring(0, 80)}..."`);

    // First, try Crossref (with rate limiting)
    let papers = await searchCrossrefWithLimit(searchQuery);
    let paper = null;
    let confidence = 0;
    let confidenceBreakdown: ConfidenceBreakdown | undefined = undefined;

    // Find best match in Crossref results
    for (const p of papers) {
        const { score, breakdown } = calculateConfidenceWithBreakdown(citation, p);
        if (score > confidence) {
            confidence = score;
            confidenceBreakdown = breakdown;
            paper = p;
        }
    }

    let source: SearchResult["source"] = paper ? "crossref" : null;

    console.log(`   Crossref best confidence: ${(confidence * 100).toFixed(1)}%`);

    // If Crossref confidence is too low, try OpenAlex (with separate rate limiting)
    if (confidence < CONFIDENCE_THRESHOLD) {
        console.log(`   ⚠️ Crossref confidence too low, trying OpenAlex...`);
        const openAlexPapers = await searchOpenAlexWithLimit(searchQuery);

        // Find best match in OpenAlex results
        for (const p of openAlexPapers) {
            const { score, breakdown } = calculateConfidenceWithBreakdown(citation, p);
            console.log(`   OpenAlex candidate confidence: ${(score * 100).toFixed(1)}%`);

            if (score > confidence) {
                paper = p;
                source = "openalex";
                confidence = score;
                confidenceBreakdown = breakdown;
                console.log(`   ✅ Using OpenAlex result (better match)`);
            }
        }
    }

    // Fallback to Google if still no good match
    if (confidence < CONFIDENCE_THRESHOLD && googleApiKey && googleSearchEngineId) {
        const googlePaper = await searchGoogle(searchQuery, googleApiKey, googleSearchEngineId);
        if (googlePaper) {
            const googleResult = calculateConfidenceWithBreakdown(citation, googlePaper);
            if (googleResult.score > confidence) {
                paper = googlePaper;
                source = "google";
                confidence = googleResult.score;
                confidenceBreakdown = googleResult.breakdown;
            }
        }
    }

    // Strict Verification: require high confidence score
    const isFound = paper !== null && confidence >= CONFIDENCE_THRESHOLD;

    console.log(
        `   Final Confidence: ${(confidence * 100).toFixed(1)}%, DOI: ${paper?.doi || "N/A"} → ${isFound ? "✅ FOUND" : "⚠️ NOT FOUND"}`
    );

    return {
        citation,
        found: isFound,
        source,
        paper: paper || undefined,
        confidence,
        confidenceBreakdown,
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { citations, googleApiKey, googleSearchEngineId } = body as {
            citations: Citation[];
            googleApiKey?: string;
            googleSearchEngineId?: string;
        };

        if (!citations || !Array.isArray(citations)) {
            return new Response(JSON.stringify({ error: "Citations array is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create a streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const results: SearchResult[] = [];
                let completedCount = 0;

                // Process all citations concurrently - semaphores handle rate limiting
                const promises = citations.map(async (citation) => {
                    try {
                        const result = await processCitation(citation, googleApiKey, googleSearchEngineId);
                        results.push(result);
                        completedCount++;

                        // Send progress update
                        const progress = Math.round((completedCount / citations.length) * 100);
                        const progressData = {
                            type: "progress",
                            progress,
                            completed: completedCount,
                            total: citations.length,
                            result,
                        };
                        controller.enqueue(encoder.encode(JSON.stringify(progressData) + "\n"));

                        return result;
                    } catch (error) {
                        console.error(`Error processing citation ${citation.id}:`, error);
                        const errorResult: SearchResult = {
                            citation,
                            found: false,
                            source: null,
                            confidence: 0,
                            error: "Processing failed",
                        };
                        results.push(errorResult);
                        completedCount++;

                        const progress = Math.round((completedCount / citations.length) * 100);
                        controller.enqueue(encoder.encode(JSON.stringify({
                            type: "progress",
                            progress,
                            completed: completedCount,
                            total: citations.length,
                            result: errorResult,
                        }) + "\n"));

                        return errorResult;
                    }
                });

                await Promise.all(promises);

                // Send final complete signal
                const finalData = {
                    type: "complete",
                    results,
                };
                controller.enqueue(encoder.encode(JSON.stringify(finalData) + "\n"));
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("Search API error:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
