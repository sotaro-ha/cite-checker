"use client";

import { useState, useMemo } from "react";
import { Citation } from "@/lib/citation-types";
import { SearchResult, ConfidenceBreakdown } from "@/lib/search-api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, ExternalLink, CornerDownRight, HelpCircle, ArrowUpDown, ArrowUp, ArrowDown, Download, FileText, RotateCcw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateCSV, generateTXT, generateBibTeX } from "@/lib/export";
import { Language, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function ConfidenceTooltipContent({ breakdown, lang }: { breakdown: ConfidenceBreakdown; lang: Language }) {
    const items = [
        { key: "title", label: lang === "ja" ? "タイトル" : "Title", ...breakdown.title },
        { key: "authors", label: lang === "ja" ? "著者" : "Authors", ...breakdown.authors },
        { key: "year", label: lang === "ja" ? "年" : "Year", ...breakdown.year },
    ];

    return (
        <div className="min-w-[160px]">
            <div className="font-semibold mb-2 text-xs border-b border-gray-600 pb-1">
                {lang === "ja" ? "マッチ内訳" : "Match Breakdown"}
            </div>
            <div className="space-y-1.5">
                {items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between gap-4 text-xs">
                        <span className={item.matched ? "text-emerald-400" : "text-amber-400"}>
                            {item.matched ? "✓" : "✗"} {item.label}
                        </span>
                        <span className="text-gray-300">
                            {Math.round((item.score / item.max) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

type SortMode = "default" | "confidence-asc" | "confidence-desc";

interface CitationCardListProps {
    citations: Citation[];
    results: Record<string, SearchResult>;
    detectedStyle: string | null;
    lang: Language;
    onReset?: () => void;
}

export function CitationCardList({ citations, results, detectedStyle, lang, onReset }: CitationCardListProps) {
    const t = translations[lang];
    const [sortMode, setSortMode] = useState<SortMode>("default");

    // Memoize computed stats to avoid recalculation on every render (rerender-memo)
    const { total, found, searched } = useMemo(() => ({
        total: citations.length,
        found: Object.values(results).filter(r => r?.found).length,
        searched: Object.keys(results).length
    }), [citations.length, results]);

    const sortedCitations = useMemo(() => {
        if (sortMode === "default") return citations;

        return [...citations].sort((a, b) => {
            const confA = results[a.id]?.confidence ?? 1;
            const confB = results[b.id]?.confidence ?? 1;

            if (sortMode === "confidence-asc") {
                return confA - confB;
            } else {
                return confB - confA;
            }
        });
    }, [citations, results, sortMode]);

    const cycleSortMode = () => {
        setSortMode(prev => {
            if (prev === "default") return "confidence-asc";
            if (prev === "confidence-asc") return "confidence-desc";
            return "default";
        });
    };

    const getSortIcon = () => {
        if (sortMode === "confidence-asc") return <ArrowUp size={14} />;
        if (sortMode === "confidence-desc") return <ArrowDown size={14} />;
        return <ArrowUpDown size={14} />;
    };

    const getSortLabel = () => {
        if (sortMode === "confidence-asc") return lang === "ja" ? "低い順" : "Low → High";
        if (sortMode === "confidence-desc") return lang === "ja" ? "高い順" : "High → Low";
        return lang === "ja" ? "元の順序" : "Original";
    };

    const handleExport = (format: "csv" | "txt" | "bib") => {
        let content = "";
        let mimeType = "text/plain";
        let extension = "txt";

        switch (format) {
            case "csv":
                content = generateCSV(citations, results);
                mimeType = "text/csv;charset=utf-8;";
                extension = "csv";
                break;
            case "txt":
                content = generateTXT(citations, results);
                extension = "txt";
                break;
            case "bib":
                content = generateBibTeX(citations, results);
                extension = "bib";
                break;
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `citations_verified.${extension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-xl font-serif text-foreground/90 flex items-center gap-3">
                        {t.extractedTitle}
                        {detectedStyle && (
                            <Badge variant="outline" className="bg-[#FAF9F7] text-[#DA7756] border-[#DA7756]/30 font-normal shadow-sm">
                                {t.style}: {detectedStyle}
                            </Badge>
                        )}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                        {found} {t.matched} / {searched} {t.searched} / {total} Total
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={cycleSortMode}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        {getSortIcon()}
                        <span>{lang === "ja" ? "マッチ度" : "Match"}: {getSortLabel()}</span>
                    </button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                                <Download size={14} />
                                <span>{lang === "ja" ? "エクスポート" : "Export"}</span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport("csv")}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>CSV</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("txt")}>
                                <FileText className="mr-2 h-4 w-4" />
                                <span>Text (TXT)</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExport("bib")}>
                                <div className="mr-2 h-4 w-4 font-mono text-[10px] flex items-center justify-center border rounded">Bx</div>
                                <span>BibTeX</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {onReset && (
                        <button
                            onClick={onReset}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <RotateCcw size={14} />
                            <span>{lang === "ja" ? "最初から" : "Start Over"}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence initial={false}>
                    {sortedCitations.map((citation, index) => {
                        const result = results[citation.id];
                        const originalIndex = citations.findIndex(c => c.id === citation.id);

                        return (
                            <motion.div
                                key={citation.id}
                                layout="position"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: index * 0.02 }}
                            >
                                <Card className={cn(
                                    "p-6 border transition-all duration-300 relative bg-white hover:shadow-md",
                                    result?.found
                                        ? "border-[#E5E2DD] hover:border-[#DA7756]/30"
                                        : result && !result.found ? "border-amber-200 bg-amber-50/10" : "border-[#E5E2DD]"
                                )}>
                                    <div className="absolute top-6 right-6 flex items-start gap-3">
                                        {result && result.paper && (
                                            <Tooltip delayDuration={100}>
                                                <TooltipTrigger asChild>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-[10px] h-5 border shadow-none font-normal cursor-help flex items-center gap-1",
                                                            // Website detection: Low confidence (< 0.6) AND Venue starts with http/https/www
                                                            (result.confidence < 0.6 && (citation.venue?.match(/^(https?:\/\/|www\.)/i) || citation.venue?.includes("http")))
                                                                ? "text-blue-600 border-blue-200 bg-blue-50"
                                                                : result.confidence < 0.6
                                                                    ? "text-amber-600 border-amber-200 bg-amber-50"
                                                                    : result.confidence < 1
                                                                        ? "text-muted-foreground border-muted"
                                                                        : "text-emerald-600 border-emerald-200 bg-emerald-50"
                                                        )}
                                                    >
                                                        {/* Website detection label */}
                                                        {(result.confidence < 0.6 && (citation.venue?.match(/^(https?:\/\/|www\.)/i) || citation.venue?.includes("http")))
                                                            ? (lang === "ja" ? "Website?" : "Website?")
                                                            : `${Math.round(result.confidence * 100)}% Match`
                                                        }

                                                        {(result.confidence < 1 || (result.confidence < 0.6 && (citation.venue?.match(/^(https?:\/\/|www\.)/i) || citation.venue?.includes("http")))) &&
                                                            <HelpCircle size={10} className="opacity-50" aria-hidden="true" />
                                                        }
                                                    </Badge>
                                                </TooltipTrigger>
                                                {result.confidenceBreakdown && (
                                                    <TooltipContent side="bottom" align="end" className="bg-gray-900 text-white border-gray-700">
                                                        <ConfidenceTooltipContent breakdown={result.confidenceBreakdown} lang={lang} />
                                                    </TooltipContent>
                                                )}
                                            </Tooltip>
                                        )}
                                        <div className="flex flex-col items-center gap-1">
                                            {result ? (
                                                result.found ? (
                                                    // Strict check: Only show green check if confidence is very high (> 0.9)
                                                    result.confidence > 0.9 ? (
                                                        <div className="text-emerald-600 bg-emerald-50 p-1.5 rounded-full">
                                                            <CheckCircle2 size={20} aria-hidden="true" />
                                                        </div>
                                                    ) : (
                                                        // Show Triangle for "Found but uncertain" (0.4 < confidence <= 0.9)
                                                        <div className="text-amber-500 bg-amber-50 p-1.5 rounded-full">
                                                            <AlertTriangle size={20} aria-hidden="true" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="text-amber-500 bg-amber-50 p-1.5 rounded-full">
                                                        <AlertTriangle size={20} aria-hidden="true" />
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/10 border-t-[#DA7756] animate-spin" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="pr-20">
                                        <div className="font-mono text-xs text-muted-foreground/40 mb-4">#{originalIndex + 1}</div>

                                        <div className="space-y-5">
                                            {/* TITLE ROW */}
                                            <div className="group/field">
                                                <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mb-1.5 flex items-center gap-2">
                                                    {t.labelTitle}
                                                </div>
                                                <div className="pl-0 space-y-2">
                                                    <p className="font-serif text-lg text-foreground/90 leading-snug break-words">
                                                        {citation.title || (
                                                            <span className="text-muted-foreground/80 font-mono text-sm">
                                                                {citation.raw}
                                                            </span>
                                                        )}
                                                    </p>

                                                    {/* Show detected paper info */}
                                                    {result?.paper && (
                                                        <div className="relative pl-5 mt-2 animate-in fade-in slide-in-from-left-2">
                                                            <div className="absolute left-0 top-1.5 text-[#DA7756]">
                                                                <CornerDownRight size={14} aria-hidden="true" />
                                                            </div>
                                                            <a
                                                                href={result.paper.url || "#"}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm font-medium text-[#DA7756] hover:underline hover:text-[#B95E3F] leading-snug flex items-start gap-1 transition-colors block"
                                                            >
                                                                {result.paper.title} (Detected)
                                                                <ExternalLink size={10} className="mt-1 opacity-50 flex-shrink-0" aria-hidden="true" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AUTHORS ROW */}
                                            <div className="group/field">
                                                <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mb-1.5">
                                                    {t.labelAuthors}
                                                </div>
                                                <div className="pl-0 space-y-1.5">
                                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                                        {citation.authors || "-"}
                                                    </p>
                                                    {citation.authors && result?.paper?.authors && result.paper.authors.length > 0 && (
                                                        <div className="relative pl-5 animate-in fade-in slide-in-from-left-2">
                                                            <div className="absolute left-0 top-1 text-muted-foreground/40">
                                                                <CornerDownRight size={12} aria-hidden="true" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {result.paper.authors.join(", ")}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* VENUE ROW */}
                                            <div className="group/field">
                                                <div className="text-[10px] font-bold text-muted-foreground/40 uppercase mb-1.5">
                                                    {t.labelVenue}
                                                </div>
                                                <div className="pl-0 space-y-1.5">
                                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                                        {citation.venue || "-"}
                                                    </p>
                                                    {citation.venue && result?.paper?.venue && (
                                                        <div className="relative pl-5 animate-in fade-in slide-in-from-left-2">
                                                            <div className="absolute left-0 top-1 text-muted-foreground/40">
                                                                <CornerDownRight size={12} aria-hidden="true" />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                {result.paper.venue}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Source & DOI (Metadata) */}
                                            <div className="pt-2 flex flex-wrap gap-3 items-center">
                                                {result?.source && (
                                                    <Badge variant="secondary" className="bg-gray-50 text-gray-500 border-gray-100 shadow-none text-[10px] h-5">
                                                        via {result.source === "crossref" ? "Crossref" : "OpenAlex"}
                                                    </Badge>
                                                )}
                                                {result?.paper?.doi && (
                                                    <a
                                                        href={`https://doi.org/${result.paper.doi}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] font-mono text-muted-foreground/50 hover:text-[#DA7756] hover:underline transition-colors"
                                                    >
                                                        DOI: {result.paper.doi}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
