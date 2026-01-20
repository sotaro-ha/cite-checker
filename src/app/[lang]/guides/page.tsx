import Link from "next/link";
import { Language } from "@/lib/i18n";
import { guides, guideList } from "@/lib/guides";
import { ArrowLeft, BookOpen, Calendar } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
    return [{ lang: "ja" }, { lang: "en" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang } = await params;

    const title = lang === "ja"
        ? "学術引用ガイド | Cite Checker"
        : "Academic Citation Guides | Cite Checker";

    const description = lang === "ja"
        ? "引用検証、AIハルシネーション、引用スタイルについての詳細ガイド。研究者・学生のための学術論文作成に役立つ情報を提供します。"
        : "Comprehensive guides on citation verification, AI hallucination, and citation styles. Helpful information for researchers and students writing academic papers.";

    return { title, description };
}

export default async function GuidesPage({ params }: PageProps) {
    const { lang } = await params;
    const language = lang as Language;

    const t = {
        title: language === "ja" ? "学術引用ガイド" : "Academic Citation Guides",
        subtitle: language === "ja"
            ? "引用検証と学術論文作成に役立つ情報"
            : "Helpful resources for citation verification and academic writing",
        backToHome: language === "ja" ? "ホームに戻る" : "Back to Home",
        readMore: language === "ja" ? "続きを読む" : "Read more",
        readingTime: language === "ja" ? "読了時間" : "Reading time",
        minutes: language === "ja" ? "分" : "min",
    };

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Back link */}
                <Link
                    href={`/${language}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#DA7756] transition-colors mb-8"
                >
                    <ArrowLeft size={16} />
                    {t.backToHome}
                </Link>

                {/* Header */}
                <header className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-[#1A1A1A]">{t.title}</h1>
                    <p className="text-lg text-muted-foreground">{t.subtitle}</p>
                </header>

                {/* Guide list */}
                <div className="grid gap-6">
                    {guideList.map(slug => {
                        const guide = guides[slug];
                        const content = guide[language] || guide.en;

                        // Calculate reading time
                        const readingTime = language === "ja"
                            ? Math.ceil(content.content.length / 400)
                            : Math.ceil(content.content.split(/\s+/).length / 200);

                        return (
                            <Link
                                key={slug}
                                href={`/${language}/guides/${slug}`}
                                className="block p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#DA7756]/30 hover:shadow-sm transition-all group"
                            >
                                <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#DA7756] transition-colors">
                                    {content.title}
                                </h2>
                                <p className="text-muted-foreground mb-4 line-clamp-2">
                                    {content.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen size={14} />
                                        {t.readingTime}: {readingTime}{t.minutes}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {content.lastUpdated}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <section className="mt-16 p-8 bg-[#DA7756]/5 rounded-2xl border border-[#DA7756]/10 text-center">
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
