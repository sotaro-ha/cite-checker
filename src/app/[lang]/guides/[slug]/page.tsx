import Link from "next/link";
import { notFound } from "next/navigation";
import { Language } from "@/lib/i18n";
import { guides, guideList, GuideSlug } from "@/lib/guides";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    const paths: { lang: string; slug: string }[] = [];
    for (const lang of ["ja", "en"]) {
        for (const slug of guideList) {
            paths.push({ lang, slug });
        }
    }
    return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const guide = guides[slug as GuideSlug];

    if (!guide) {
        return { title: "Not Found" };
    }

    const content = guide[lang as Language] || guide.en;

    return {
        title: `${content.title} | Cite Checker`,
        description: content.description,
    };
}

export default async function GuidePage({ params }: PageProps) {
    const { lang, slug } = await params;
    const language = lang as Language;

    const guide = guides[slug as GuideSlug];

    if (!guide) {
        notFound();
    }

    const content = guide[language] || guide.en;

    const t = {
        backToHome: language === "ja" ? "ホームに戻る" : "Back to Home",
        readingTime: language === "ja" ? "読了時間" : "Reading time",
        minutes: language === "ja" ? "分" : "min",
        lastUpdated: language === "ja" ? "最終更新" : "Last updated",
        relatedGuides: language === "ja" ? "関連ガイド" : "Related Guides",
    };

    // Calculate reading time (approx 400 chars per minute for Japanese, 200 words for English)
    const readingTime = language === "ja"
        ? Math.ceil(content.content.length / 400)
        : Math.ceil(content.content.split(/\s+/).length / 200);

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Back link */}
                <Link
                    href={`/${language}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#DA7756] transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    {t.backToHome}
                </Link>

                {/* Article header */}
                <article className="space-y-8">
                    <header className="space-y-4 border-b border-gray-100 pb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
                            {content.title}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {content.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} />
                                {t.readingTime}: {readingTime}{t.minutes}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {t.lastUpdated}: {content.lastUpdated}
                            </span>
                        </div>
                    </header>

                    {/* Article content */}
                    <div
                        className="prose prose-slate prose-lg max-w-none
                            prose-headings:text-[#1A1A1A] prose-headings:font-bold
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                            prose-p:text-muted-foreground prose-p:leading-relaxed
                            prose-a:text-[#DA7756] prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-[#1A1A1A]
                            prose-ul:text-muted-foreground prose-li:text-muted-foreground
                            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
                        "
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdown(content.content)
                        }}
                    />
                </article>

                {/* Related guides */}
                <section className="mt-16 pt-8 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">{t.relatedGuides}</h2>
                    <div className="grid gap-4">
                        {guideList.filter(s => s !== slug).map(otherSlug => {
                            const otherGuide = guides[otherSlug];
                            const otherContent = otherGuide[language] || otherGuide.en;
                            return (
                                <Link
                                    key={otherSlug}
                                    href={`/${language}/guides/${otherSlug}`}
                                    className="block p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#DA7756]/30 hover:bg-gray-50/80 transition-colors"
                                >
                                    <h3 className="font-bold text-[#1A1A1A] mb-1">{otherContent.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{otherContent.description}</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-12 p-8 bg-[#DA7756]/5 rounded-2xl border border-[#DA7756]/10 text-center">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
                        {language === "ja" ? "今すぐ引用を検証" : "Verify Your Citations Now"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {language === "ja"
                            ? "PDFをアップロードして、参考文献の正確性を確認しましょう。"
                            : "Upload your PDF to check the accuracy of your references."}
                    </p>
                    <Link
                        href={`/${language}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#DA7756] text-white font-medium rounded-lg hover:bg-[#c56a4d] transition-colors"
                    >
                        {language === "ja" ? "Cite Checkerを使う" : "Use Cite Checker"}
                    </Link>
                </section>
            </div>
        </main>
    );
}

// Simple markdown parser
function parseMarkdown(markdown: string): string {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Code blocks
        .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        // Line breaks - paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Lists
        .replace(/^- (.*$)/gm, '<li>$1</li>');

    // Wrap lists (use [\s\S] instead of . with s flag for cross-line matching)
    html = html.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');
    // Clean up multiple ul tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*<h/g, '<h');
    html = html.replace(/<\/h([23])>\s*<\/p>/g, '</h$1>');
    html = html.replace(/<p>\s*<ul>/g, '<ul>');
    html = html.replace(/<\/ul>\s*<\/p>/g, '</ul>');
    html = html.replace(/<p>\s*<pre>/g, '<pre>');
    html = html.replace(/<\/pre>\s*<\/p>/g, '</pre>');

    return html;
}
