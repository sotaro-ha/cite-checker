import Link from "next/link";
import { notFound } from "next/navigation";
import { Language } from "@/lib/i18n";
import { getBlogPost, getBlogPosts, getBlogSlugs } from "@/lib/blog";
import { guides, GuideSlug } from "@/lib/guides";
import { parseMarkdown } from "@/lib/markdown";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Calendar, BookOpen, Tag, User } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getBlogSlugs();
    const paths: { lang: string; slug: string }[] = [];
    for (const lang of ["ja", "en"]) {
        for (const slug of slugs) {
            paths.push({ lang, slug });
        }
    }
    return paths;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;
    const post = getBlogPost(slug, lang as Language);

    if (!post) {
        return { title: "Not Found" };
    }

    return {
        title: `${post.title} | Cite Checker`,
        description: post.description,
    };
}

export default async function BlogPostPage({ params }: PageProps) {
    const { lang, slug } = await params;
    const language = lang as Language;
    const post = getBlogPost(slug, language);

    if (!post) {
        notFound();
    }

    const t = {
        blog: language === "ja" ? "ブログ" : "Blog",
        readingTime: language === "ja" ? "読了時間" : "Reading time",
        minutes: language === "ja" ? "分" : "min",
        relatedGuides: language === "ja" ? "関連ガイド" : "Related Guides",
        relatedPosts: language === "ja" ? "関連記事" : "Related Articles",
    };

    // Get related guide content
    const relatedGuideItems = post.relatedGuides
        .filter(slug => slug in guides)
        .map(slug => {
            const guide = guides[slug as GuideSlug];
            const content = guide[language] || guide.en;
            return { slug, title: content.title, description: content.description };
        });

    // Get other blog posts (excluding current)
    const allPosts = getBlogPosts(language);
    const relatedPosts = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20">
            <div className="max-w-3xl mx-auto px-6 py-12">
                <Breadcrumbs
                    lang={language}
                    items={[
                        { label: t.blog, href: `/${language}/blog` },
                        { label: post.title },
                    ]}
                />

                {/* Article header */}
                <article className="space-y-8">
                    <header className="space-y-4 border-b border-gray-100 pb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight">
                            {post.title}
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {post.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <User size={14} />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <BookOpen size={14} />
                                {t.readingTime}: {post.readingTime}{t.minutes}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {post.date}
                            </span>
                        </div>
                        {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-xs text-muted-foreground rounded-full"
                                    >
                                        <Tag size={10} />
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
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
                            prose-ol:text-muted-foreground
                            prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
                            prose-table:text-sm prose-th:bg-gray-50 prose-th:p-3 prose-td:p-3 prose-table:border prose-table:border-gray-200
                        "
                        dangerouslySetInnerHTML={{
                            __html: parseMarkdown(post.content)
                        }}
                    />
                </article>

                {/* Related Guides */}
                {relatedGuideItems.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">{t.relatedGuides}</h2>
                        <div className="grid gap-4">
                            {relatedGuideItems.map(guide => (
                                <Link
                                    key={guide.slug}
                                    href={`/${language}/guides/${guide.slug}`}
                                    className="block p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#DA7756]/30 hover:bg-gray-50/80 transition-colors"
                                >
                                    <h3 className="font-bold text-[#1A1A1A] mb-1">{guide.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{guide.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="mt-12 pt-8 border-t border-gray-100">
                        <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">{t.relatedPosts}</h2>
                        <div className="grid gap-4">
                            {relatedPosts.map(p => (
                                <Link
                                    key={p.slug}
                                    href={`/${language}/blog/${p.slug}`}
                                    className="block p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-[#DA7756]/30 hover:bg-gray-50/80 transition-colors"
                                >
                                    <h3 className="font-bold text-[#1A1A1A] mb-1">{p.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

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

            {/* BlogPosting JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        "headline": post.title,
                        "description": post.description,
                        "datePublished": post.date,
                        "dateModified": post.date,
                        "author": {
                            "@type": "Organization",
                            "name": post.author,
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Cite Checker",
                            "url": "https://www.citechecker.app",
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": `https://www.citechecker.app/${language}/blog/${slug}`,
                        },
                        "keywords": post.tags.join(", "),
                        "inLanguage": language,
                        "isPartOf": {
                            "@type": "Blog",
                            "name": language === "ja" ? "Cite Checker ブログ" : "Cite Checker Blog",
                            "url": `https://www.citechecker.app/${language}/blog`,
                        },
                    }),
                }}
            />
        </main>
    );
}
