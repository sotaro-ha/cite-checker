export interface Citation {
    id: string;
    raw: string;
    title: string | null;
    authors: string | null;
    venue?: string | null;
    year: string | null;
    style?: string;
    isGrobidEnriched?: boolean;
}
