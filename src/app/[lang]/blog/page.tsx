import Link from "next/link";
import { Language } from "@/lib/i18n";
import { getBlogPosts } from "@/lib/blog";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookOpen, Calendar, Tag } from "lucide-react";
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
        ? "ブログ - 引用検証の最新情報 | Cite Checker"
        : "Blog - Citation Verification Insights | Cite Checker";

    const description = lang === "ja"
        ? "AI生成引用の検証方法、引用エラーの対策、学術データベースの活用法など、研究者に役立つ最新記事をお届けします。"
        : "Practical articles on verifying AI-generated citations, avoiding citation errors, and leveraging academic databases for researchers.";

    return { title, description };
}

export default async function BlogPage({ params }: PageProps) {
    const { lang } = await params;
    const language = lang as Language;
    const posts = getBlogPosts(language);

    const t = {
        title: language === "ja" ? "ブログ" : "Blog",
        subtitle: language === "ja"
            ? "引用検証と学術論文作成に役立つ記事"
            : "Articles on citation verification and academic writing",
        readMore: language === "ja" ? "続きを読む" : "Read more",
        readingTime: language === "ja" ? "読了" : "read",
        minutes: language === "ja" ? "分" : "min",
        blog: language === "ja" ? "ブログ" : "Blog",
    };

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <Breadcrumbs lang={language} items={[{ label: t.blog }]} />

                {/* Header */}
                <header className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-[#1A1A1A]">{t.title}</h1>
                    <p className="text-lg text-muted-foreground">{t.subtitle}</p>
                </header>

                {/* Blog list */}
                <div className="grid gap-6">
                    {posts.map(post => (
                        <Link
                            key={post.slug}
                            href={`/${language}/blog/${post.slug}`}
                            className="block p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#DA7756]/30 hover:shadow-sm transition-all group"
                        >
                            <h2 className="text-xl font-bold text-[#1A1A1A] mb-2 group-hover:text-[#DA7756] transition-colors">
                                {post.title}
                            </h2>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                                {post.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <BookOpen size={14} />
                                    {post.readingTime}{t.minutes}{t.readingTime}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {post.date}
                                </span>
                                {post.tags.length > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <Tag size={14} />
                                        {post.tags.slice(0, 3).join(", ")}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
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
