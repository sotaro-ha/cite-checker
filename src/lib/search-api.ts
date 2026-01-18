import { Citation } from "./citation-types";

export interface ConfidenceBreakdown {
    title: { score: number; max: number; matched: boolean };
    authors: { score: number; max: number; matched: boolean };
    year: { score: number; max: number; matched: boolean };
}

export interface SearchResult {
    citation: Citation;
    found: boolean;
    source: "crossref" | "google" | "semantic_scholar" | "openalex" | null;
    paper?: {
        title: string;
        authors: string[];
        year: number | null;
        url: string;
        doi?: string;
        venue?: string;
    };
    confidence: number;
    confidenceBreakdown?: ConfidenceBreakdown;
    error?: string;
    query?: string; // Debug info
}

// Crossref API configuration - polite pool with email
const CROSSREF_EMAIL = "yokoi@cyber.t.u-tokyo.ac.jp";
const CROSSREF_BASE_URL = "https://api.crossref.org";

/**
 * Search for a paper using Crossref API
 */
/**
 * Search for a paper using Crossref API (returns top 3 candidates)
 */
export async function searchCrossref(
    query: string
): Promise<SearchResult["paper"][]> {
    try {
        const encodedQuery = encodeURIComponent(query);
        // Request 3 rows instead of 1
        const url = `${CROSSREF_BASE_URL}/works?query=${encodedQuery}&rows=3&mailto=${CROSSREF_EMAIL}`;

        console.log(`\n🔍 [Crossref Search]`);
        console.log(`   Query: "${query}"`);
        console.log(`   URL: ${url}`);

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "User-Agent": `CitationVerifier/1.0 (mailto:${CROSSREF_EMAIL})`,
            },
        });

        if (!response.ok) {
            console.error(`   ❌ API Error: ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (!data.message?.items || data.message.items.length === 0) {
            console.log(`   ❌ No results found`);
            return [];
        }

        // Process up to 3 items
        const rawItems = data.message.items; // Limit is controlled by 'rows=3' query param
        const results: SearchResult["paper"][] = [];

        for (const work of rawItems) {
            // Extract authors
            const authors = work.author?.map((a: { given?: string; family?: string }) =>
                [a.given, a.family].filter(Boolean).join(" ")
            ) || [];

            // Extract year from published-print or published-online or created
            const dateInfo = work["published-print"] || work["published-online"] || work.created;
            const year = dateInfo?.["date-parts"]?.[0]?.[0] || null;

            // Get title (can be an array)
            const title = Array.isArray(work.title) ? work.title[0] : work.title || "";

            results.push({
                title,
                authors,
                year,
                url: work.URL || `https://doi.org/${work.DOI}`,
                doi: work.DOI,
                venue: work["container-title"]?.[0] || "",
            });
        }

        console.log(`   ✅ Found ${results.length} candidates from Crossref`);
        return results;

    } catch (error) {
        console.error(`   ❌ Error:`, error);
        return [];
    }
}


/**
 * Search for a paper using Google Custom Search API (requires API key)
 */
export async function searchGoogle(
    query: string,
    apiKey: string,
    searchEngineId: string
): Promise<SearchResult["paper"] | null> {
    try {
        const encodedQuery = encodeURIComponent(`${query} academic paper`);
        const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodedQuery}&num=3`
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return null;
        }

        const item = data.items[0];
        return {
            title: item.title,
            authors: [],
            year: null,
            url: item.link,
        };
    } catch (error) {
        console.error("Google search error:", error);
        return null;
    }
}

/**
 * Normalize string for comparison
 */
function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")  // Replace punctuation with space
        .replace(/\s+/g, " ")       // Collapse multiple spaces
        .trim();
}

/**
 * Calculate similarity between two strings using bigrams (more robust for titles)
 */
function calculateSimilarity(str1: string, str2: string): number {
    const s1 = normalizeString(str1);
    const s2 = normalizeString(str2);

    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;

    // Check if shorter string is prefix/contained in longer string
    // This handles cases like "StructJumper" vs "StructJumper: A Tool to Help..."
    const shorter = s1.length < s2.length ? s1 : s2;
    const longer = s1.length < s2.length ? s2 : s1;

    // Check prefix match (short title is beginning of long title)
    if (longer.startsWith(shorter)) {
        // Return high score - the shorter title is a valid prefix
        return Math.max(0.85, shorter.length / longer.length);
    }

    // Check if shorter is contained with word boundaries
    if (longer.includes(shorter + " ") || longer.includes(" " + shorter)) {
        return Math.max(0.8, shorter.length / longer.length);
    }

    // Fallback to bigram similarity (Dice coefficient)
    const getBigrams = (str: string) => {
        const bigrams = new Set<string>();
        for (let i = 0; i < str.length - 1; i++) {
            bigrams.add(str.substring(i, i + 2));
        }
        return bigrams;
    };

    const bigrams1 = getBigrams(s1);
    const bigrams2 = getBigrams(s2);

    const intersection = new Set([...bigrams1].filter((x) => bigrams2.has(x)));

    if (bigrams1.size === 0 || bigrams2.size === 0) return 0;
    return (2 * intersection.size) / (bigrams1.size + bigrams2.size);
}

/**
 * Calculate author similarity score
 */
function calculateAuthorSimilarity(citationAuthors: string, paperAuthors: string[]): number {
    if (!citationAuthors || !paperAuthors || paperAuthors.length === 0) return 0;

    const citAuthorsLower = citationAuthors.toLowerCase();
    let matchCount = 0;

    for (const author of paperAuthors) {
        // Extract last name (family name)
        const lastName = author.toLowerCase().split(" ").pop() || "";
        if (lastName.length > 2 && citAuthorsLower.includes(lastName)) {
            matchCount++;
        }
    }

    // Return ratio of matched authors
    if (matchCount === 0) return 0;
    return Math.min(1, matchCount / Math.min(paperAuthors.length, 3)); // Cap at first 3 authors
}

/**
 * Calculate confidence score for a search result with breakdown
 */
export function calculateConfidenceWithBreakdown(
    citation: Citation,
    paper: SearchResult["paper"]
): { score: number; breakdown: ConfidenceBreakdown } {
    const defaultBreakdown: ConfidenceBreakdown = {
        title: { score: 0, max: 0.5, matched: false },
        authors: { score: 0, max: 0.3, matched: false },
        year: { score: 0, max: 0.2, matched: false },
    };

    if (!paper) return { score: 0, breakdown: defaultBreakdown };

    let titleScore = 0;
    let authorScore = 0;
    let yearScore = 0;
    let titleMatched = false;
    let authorsMatched = false;
    let yearMatched = false;

    // Title similarity (50% weight)
    if (citation.title && paper.title) {
        const similarity = calculateSimilarity(citation.title, paper.title);
        // If similarity is excessively low, penalize heavily (it's likely a different paper)
        if (similarity < 0.3) {
            return { score: 0, breakdown: defaultBreakdown };
        }
        titleScore = similarity * 0.5;
        titleMatched = similarity >= 0.7;
    } else {
        // Try raw similarity fallback
        const rawSim = calculateSimilarity(citation.raw.substring(0, 100), paper.title);
        if (rawSim < 0.3) {
            return { score: 0, breakdown: defaultBreakdown };
        }
        titleScore = rawSim * 0.4;
        titleMatched = rawSim >= 0.7;
    }

    // Author similarity (30% weight)
    if (citation.authors && paper.authors && paper.authors.length > 0) {
        const authorSim = calculateAuthorSimilarity(citation.authors, paper.authors);
        authorScore = authorSim * 0.3;
        authorsMatched = authorSim >= 0.5;
    }

    // Year match (20% weight)
    if (citation.year && paper.year) {
        const citYear = parseInt(citation.year);
        const paperYear = paper.year;
        if (Math.abs(citYear - paperYear) <= 1) {
            yearScore = 0.2;
            yearMatched = true;
        } else if (Math.abs(citYear - paperYear) <= 2) {
            yearScore = 0.1;
            yearMatched = false;
        }
    }

    const totalScore = Math.max(0, Math.min(titleScore + authorScore + yearScore, 1));

    return {
        score: totalScore,
        breakdown: {
            title: { score: titleScore, max: 0.5, matched: titleMatched },
            authors: { score: authorScore, max: 0.3, matched: authorsMatched },
            year: { score: yearScore, max: 0.2, matched: yearMatched },
        },
    };
}

/**
 * Calculate confidence score for a search result (simple version for backward compatibility)
 */
export function calculateConfidence(
    citation: Citation,
    paper: SearchResult["paper"]
): number {
    return calculateConfidenceWithBreakdown(citation, paper).score;
}

/**
 * Search/Fallback using Semantic Scholar
 */
export async function searchSemanticScholar(
    query: string
): Promise<SearchResult["paper"] | null> {
    try {
        // Semantic Scholar API (Free Tier, rate limited)
        const encodedQuery = encodeURIComponent(query);
        // We request specific fields
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&limit=1&fields=title,authors,year,venue,externalIds,url`;

        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (!data.data || data.data.length === 0) {
            return null;
        }

        const work = data.data[0];

        return {
            title: work.title,
            authors: work.authors?.map((a: any) => a.name) || [],
            year: work.year || null,
            venue: work.venue || "",
            url: work.url || (work.externalIds?.DOI ? `https://doi.org/${work.externalIds.DOI}` : ""),
            doi: work.externalIds?.DOI,
        };

    } catch (e) {
        console.error("Semantic Scholar error", e);
        return null;
    }
}

/**
 * Search using OpenAlex API (free, no auth required)
 */
/**
 * Search using OpenAlex API (returns top 3 candidates)
 */
export async function searchOpenAlex(
    query: string
): Promise<SearchResult["paper"][]> {
    try {
        const encodedQuery = encodeURIComponent(query);
        // Request 3 results using per_page=3
        const url = `https://api.openalex.org/works?search=${encodedQuery}&per_page=3&mailto=${CROSSREF_EMAIL}`;

        console.log(`\n🔍 [OpenAlex Search]`);
        console.log(`   Query: "${query}"`);

        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            console.error(`   ❌ API Error: ${response.status}`);
            return [];
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            console.log(`   ❌ No results found`);
            return [];
        }

        const rawItems = data.results;
        const results: SearchResult["paper"][] = [];

        for (const work of rawItems) {
            // Extract authors
            const authors = work.authorships?.map((a: any) =>
                a.author?.display_name || ""
            ).filter(Boolean) || [];

            // Extract year
            const year = work.publication_year || null;

            // Get title
            const title = work.title || "";

            // Get DOI (remove https://doi.org/ prefix if present)
            const doi = work.doi?.replace("https://doi.org/", "") || undefined;

            results.push({
                title,
                authors,
                year,
                url: work.doi || work.id || "",
                doi,
                venue: work.primary_location?.source?.display_name || "",
            });
        }

        console.log(`   ✅ Found ${results.length} candidates from OpenAlex`);
        return results;

    } catch (error) {
        console.error(`   ❌ OpenAlex Error:`, error);
        return [];
    }
}
