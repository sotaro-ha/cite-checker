"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Language, translations } from "@/lib/i18n";

interface WarningBannerProps {
    count: number;
    lang: Language;
}

export function WarningBanner({ count, lang }: WarningBannerProps) {
    if (count === 0) return null;
    const t = translations[lang];

    return (
        <Alert variant="destructive" className="bg-amber-50 border-amber-200/50 text-amber-900 shadow-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-600"
                aria-hidden="true"
            >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <AlertTitle className="text-amber-800 font-sans font-medium tracking-wide flex items-center gap-2">
                {t.warningTitle} ({count})
            </AlertTitle>
            <AlertDescription className="text-amber-700/80 mt-1 font-mono text-xs">
                {t.warningDesc}
            </AlertDescription>
        </Alert>
    );
}
