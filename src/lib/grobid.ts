export interface GrobidCitation {
    raw: string;
    title: string | null;
    authors: string | null;
    venue: string | null;
    year: string | null;
    doi: string | null;
}

const GROBID_API_URL = process.env.GROBID_API_URL

export async function parseCitationWithGrobid(citations: string[]): Promise<GrobidCitation[]> {
    const results: GrobidCitation[] = [];

    // Parallel processing with limited concurrency is better, but allow batching if possible.
    // Grobid `processCitation` endpoint takes one citation string at a time usually,
    // or `processCitations` (plural) for a list.
    // The endpoint `/api/processCitation` expects `citations` parameter.
    // However, the standard Grobid API for batched citation processing is often `/api/processCitation` called multiple times or specific batch endpoints.
    // The 'processCitation' endpoint allows sending 'citations' as form data.

    // Let's implement a simple loop for now, or batching if supported.
    // "https://grobid.readthedocs.io/en/latest/Grobid-service/#api-processcitation"
    // It takes a single `citations` field.

    // We'll use Promise.all with some concurrency limit to be polite to the demo server.
    // We'll use 1 to be safe on free tier hardware.
    const CONCURRENCY = 1;

    for (let i = 0; i < citations.length; i += CONCURRENCY) {
        const chunk = citations.slice(i, i + CONCURRENCY);
        const chunkPromises = chunk.map(async (raw) => {
            try {
                const params = new URLSearchParams();
                params.append("citations", raw);
                params.append("consolidationCitations", "0");

                const response = await fetch(`${GROBID_API_URL}/processCitation`, {
                    method: "POST",
                    body: params,
                });

                if (!response.ok) {
                    console.error(`Grobid error for: ${raw.substring(0, 20)}...`, response.statusText);
                    return null;
                }

                const textResult = await response.text();
                return parseGrobidXML(textResult, raw);

            } catch (e) {
                console.error("Grobid request failed", e);
                return null;
            }
        });

        const chunkResults = await Promise.all(chunkPromises);
        chunkResults.forEach(r => {
            if (r) results.push(r);
            else results.push({ raw: citations[results.length + (r === null ? 0 : 0)], title: null, authors: null, venue: null, year: null, doi: null }); // Fallback empty
        });
    }

    return results;
}

// Grobid returns TEI XML. We need a simple XML parser or regex.
// Since we are in a text-heavy environment, regex might be fragile but fast.
// Or use a DOMParser if available (Client) or similar (Server).
// Since this runs on Server (Node), we might need `jsdom` or `cheerio` or regex.
// Let's use Regex for simplicity as TEI output from Grobid is quite standard.

function parseGrobidXML(xml: string, raw: string): GrobidCitation {
    // Remove newlines to make regex easier
    const cleanXml = xml.replace(/\n/g, " ").replace(/\r/g, "");

    // Helper to strip HTML/XML tags
    const stripTags = (str: string) => {
        return str.replace(/<[^>]+>/g, "").trim();
    };

    const extractTag = (tag: string) => {
        // Use \b to ensure we don't match substrings (e.g., 'title' inside 'titleStmt')
        // We match <tag> OR <tag ...>
        const regex = new RegExp(`<${tag}\\b[^>]*>(.*?)</${tag}>`, "i");
        const match = cleanXml.match(regex);
        return match ? stripTags(match[1]) : null; // Clean content immediately
    };

    const extractTitle = () => {
        // Priority 1: Article Title <title level="a">
        const levelA = cleanXml.match(/<title level="a"[^>]*>(.*?)<\/title>/i);
        if (levelA) return stripTags(levelA[1]);

        // Priority 2: Main Title (no level or level="m" which typically means monogr)
        // Check for specific level="m"
        const levelM = cleanXml.match(/<title level="m"[^>]*>(.*?)<\/title>/i);
        if (levelM) return stripTags(levelM[1]);

        // Priority 3: Any title that is NOT level="j" (Journal)
        // This is tricky with regex. Let's fall back to strict tag extraction if nothing else.
        // But exclude <title level="j"> match if possible.

        const generic = extractTag("title");
        if (generic) return generic;

        return null;
    };

    let title = extractTitle();

    // Venue: <title level="j"> for journal
    const journalMatch = cleanXml.match(/<title level="j"[^>]*>(.*?)<\/title>/i);
    let venue = journalMatch ? stripTags(journalMatch[1]) : null;

    // Authors
    // <author><persName><forename>A</forename><surname>Smith</surname></persName></author>
    // We want a flattened string "A. Smith, B. Jones"
    const authorMatches = cleanXml.matchAll(/<author>(.*?)<\/author>/gi);
    const authorsList: string[] = [];
    for (const m of authorMatches) {
        const content = m[1];
        const forename = content.match(/<forename[^>]*>(.*?)<\/forename>/i);
        const surname = content.match(/<surname[^>]*>(.*?)<\/surname>/i);
        if (surname) {
            let name = stripTags(surname[1]);
            if (forename) {
                const fName = stripTags(forename[1]);
                name = `${fName} ${name}`;
            }
            authorsList.push(name);
        }
    }
    const authors = authorsList.length > 0 ? authorsList.join(", ") : null;

    // Year
    // <date type="published" when="2010">
    const dateMatch = cleanXml.match(/<date[^>]*when="(\d{4})"[^>]*>/i);
    const year = dateMatch ? dateMatch[1] : null;

    // DOI
    // <idno type="DOI">10.1234/...</idno>
    const doiMatch = cleanXml.match(/<idno type="DOI">(.*?)<\/idno>/i);
    const doi = doiMatch ? stripTags(doiMatch[1]) : null;

    return {
        raw,
        title: title || null,
        authors: authors || null,
        venue: venue || null,
        year: year || null,
        doi: doi || null
    };
}
