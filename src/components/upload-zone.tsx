"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { Language, translations } from "@/lib/i18n";

interface UploadZoneProps {
    onFileSelected: (file: File) => void;
    isLoading?: boolean;
    lang: Language;
}

export function UploadZone({ onFileSelected, isLoading, lang }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const t = translations[lang];

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/pdf") {
                onFileSelected(file);
            }
        },
        [onFileSelected]
    );

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onFileSelected(file);
            }
        },
        [onFileSelected]
    );

    return (
        <Card
            className={`relative flex flex-col items-center justify-center py-16 px-8 border transition-all duration-300 cursor-pointer shadow-sm group ${isDragging
                    ? "border-[#DA7756] bg-[#DA7756]/5"
                    : "border-[#E5E2DD] bg-white hover:border-[#DA7756]/50 hover:shadow-md"
                } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                disabled={isLoading}
            />

            <div className="flex flex-col items-center gap-5 text-center z-10">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? "bg-[#DA7756]/10 text-[#DA7756]" : "bg-[#FAF9F7] text-muted-foreground group-hover:text-[#DA7756] group-hover:bg-[#DA7756]/5"
                    }`}>
                    <UploadCloud size={32} strokeWidth={1.5} />
                </div>

                <div className="space-y-1">
                    <p className="text-lg font-serif text-foreground/90 font-medium">
                        {t.dragDrop}
                    </p>
                    <p className="text-sm text-muted-foreground/60 font-mono">
                        {t.orClick}
                    </p>
                </div>
            </div>

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px] rounded-lg z-30 transition-all duration-300">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#DA7756] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium text-[#DA7756] animate-pulse">{t.analyzing}</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
