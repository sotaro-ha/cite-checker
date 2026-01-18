"use client";

import Link from "next/link";
import { Language } from "@/lib/i18n";

interface SiteFooterProps {
    lang: Language;
}

export function SiteFooter({ lang }: SiteFooterProps) {
    return (
        <footer className="py-8 text-center border-t border-[#E5E2DD]/50 mt-12 bg-white/50 flex flex-col gap-2 items-center justify-center">
            <Link href={`/${lang}/disclaimer`} className="text-xs text-muted-foreground/60 hover:text-muted-foreground hover:underline transition-colors">
                {lang === 'ja' ? '免責事項 (Disclaimer)' : 'Disclaimer'}
            </Link>
        </footer>
    );
}
