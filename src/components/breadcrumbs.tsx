import Link from "next/link";
import { Language } from "@/lib/i18n";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    lang: Language;
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ lang, items }: BreadcrumbsProps) {
    const homeLabel = lang === "ja" ? "ホーム" : "Home";
    const allItems: BreadcrumbItem[] = [
        { label: homeLabel, href: `/${lang}` },
        ...items,
    ];

    return (
        <>
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                    {allItems.map((item, i) => {
                        const isLast = i === allItems.length - 1;
                        return (
                            <li key={i} className="flex items-center gap-1">
                                {i > 0 && <ChevronRight size={14} className="text-gray-300" />}
                                {isLast || !item.href ? (
                                    <span className={isLast ? "text-[#1A1A1A] font-medium" : ""}>
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="hover:text-[#DA7756] transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* BreadcrumbList JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": allItems.map((item, i) => ({
                            "@type": "ListItem",
                            "position": i + 1,
                            "name": item.label,
                            ...(item.href
                                ? { "item": `https://www.citechecker.app${item.href}` }
                                : {}),
                        })),
                    }),
                }}
            />
        </>
    );
}
