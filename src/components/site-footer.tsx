"use client";

import Link from "next/link";
import { Language } from "@/lib/i18n";

interface SiteFooterProps {
    lang: Language;
}

export function SiteFooter({ lang }: SiteFooterProps) {
    const t = {
        guides: lang === "ja" ? "ガイド" : "Guides",
        disclaimer: lang === "ja" ? "免責事項" : "Disclaimer",
        copyright: `© ${new Date().getFullYear()} Cite Checker`,
    };

    return (
        <footer className="border-t border-gray-100 bg-gray-50/50">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        {t.copyright}
                    </p>
                    <nav className="flex items-center gap-6">
                        <Link
                            href={`/${lang}/guides`}
                            className="text-sm text-muted-foreground hover:text-[#DA7756] transition-colors"
                        >
                            {t.guides}
                        </Link>
                        <Link
                            href={`/${lang}/disclaimer`}
                            className="text-sm text-muted-foreground hover:text-[#DA7756] transition-colors"
                        >
                            {t.disclaimer}
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
