import { Citation } from "./citation-types";
import { SearchResult } from "./search-api";

export function generateCSV(citations: Citation[], results: Record<string, SearchResult>): string {
    const headers = [
        "Title",
        "Authors",
        "Venue",
        "Year",
        "DOI",
        "Status",
        "Match Confidence",
        "Database Source"
    ];

    const rows = citations.map(citation => {
        const result = results[citation.id];
        const found = result?.found ?? false;
        const confidence = result?.confidence ? Math.round(result.confidence * 100) + "%" : "0%";

        // Use verified data if available, otherwise original
        const title = result?.paper?.title || citation.title || citation.raw;
        const authors = result?.paper?.authors?.join(", ") || citation.authors || "";
        const venue = result?.paper?.venue || citation.venue || "";
        const year = result?.paper?.year || citation.year || "";
        const doi = result?.paper?.doi || "";
        const source = result?.source || "";
        const status = found
            ? (result?.confidence && result.confidence > 0.9 ? "Confirmed" : "Found (Low Confidence)")
            : "Not Found";

        // Escape CSV fields
        const escape = (text: string | number | null | undefined) => {
            const str = String(text || "");
            // Prevent formula injection (starts with =, +, -, @)
            const prefix = /^[=+\-@]/.test(str) ? "'" : "";
            return `"${prefix}${str.replace(/"/g, '""')}"`;
        };

        return [
            escape(title),
            escape(authors),
            escape(venue),
            escape(year),
            escape(doi),
            escape(status),
            escape(confidence),
            escape(source)
        ].join(",");
    });

    return [headers.join(","), ...rows].join("\n");
}

export function generateTXT(citations: Citation[], results: Record<string, SearchResult>): string {
    return citations.map((citation, index) => {
        const result = results[citation.id];
        const status = result?.found ? "[✓ Found]" : "[X Not Found]";

        // Use verified data if available
        const title = result?.paper?.title || citation.title || citation.raw;
        const authors = result?.paper?.authors?.join(", ") || citation.authors || "Unknown Authors";
        const venue = result?.paper?.venue || citation.venue || "";
        const year = result?.paper?.year || citation.year || "";
        const doi = result?.paper?.doi ? `DOI: https://doi.org/${result.paper.doi}` : "";

        return `${index + 1}. ${status} ${title}\n   ${authors} (${year}) ${venue}\n   ${doi}\n`;
    }).join("\n");
}

export function generateBibTeX(citations: Citation[], results: Record<string, SearchResult>): string {
    return citations.map((citation, index) => {
        const result = results[citation.id];
        // Use verified data if available
        const title = result?.paper?.title || citation.title || citation.raw;
        const authors = result?.paper?.authors?.join(" and ") || citation.authors || "";
        const venue = result?.paper?.venue || citation.venue || "";
        const year = result?.paper?.year || citation.year || "";
        const doi = result?.paper?.doi || "";

        // Create a unique key (AuthorYear)
        const firstAuthorSurname = authors.split(",")[0].split(" ").pop()?.replace(/[^a-zA-Z]/g, "") || "Unknown";
        const cleanYear = year || "n.d.";
        const key = `${firstAuthorSurname}${cleanYear}${index}`;

        const entryType = venue.toLowerCase().includes("journal") ? "article" : "misc";

        let bib = `@${entryType}{${key},\n`;
        bib += `  title = {${title}},\n`;
        if (authors) bib += `  author = {${authors}},\n`;
        if (venue) bib += `  journal = {${venue}},\n`;
        if (year) bib += `  year = {${year}},\n`;
        if (doi) bib += `  doi = {${doi}},\n`;
        if (result?.found) bib += `  note = {Verified via Cite Checker},\n`;
        bib += `}\n`;

        return bib;
    }).join("\n");
}
