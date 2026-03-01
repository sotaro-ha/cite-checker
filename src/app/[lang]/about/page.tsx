import Link from "next/link";
import { Language } from "@/lib/i18n";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { use } from "react";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return [{ lang: "ja" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const isJa = lang === "ja";
    return {
        title: isJa ? "Cite Checkerについて | Cite Checker" : "About Cite Checker",
        description: isJa
            ? "Cite Checkerは、学術論文の引用を無料で検証するプライバシー重視のオープンソースツールです。開発背景、技術スタック、ミッションをご紹介します。"
            : "Cite Checker is a privacy-first, open-source tool for verifying academic citations for free. Learn about our development background, tech stack, and mission.",
    };
}

export default function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                <Breadcrumbs
                    lang={lang}
                    items={[{ label: lang === "ja" ? "サービスについて" : "About" }]}
                />
                {lang === "ja" ? (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">Cite Checkerについて</h1>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">ミッション</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checkerは、すべての研究者・学生が<strong>無料かつ安全に</strong>引用文献を検証できる環境を提供することを目指しています。
                                生成AIの普及により架空の引用（ハルシネーション）が増加する中、正確な参考文献リストの重要性はこれまで以上に高まっています。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">サービスの特徴</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>完全無料</strong>：研究者・学生は制限なく無料で利用可能</li>
                                <li><strong>登録不要</strong>：アカウント作成やログインの必要なし</li>
                                <li><strong>プライバシー重視</strong>：PDFはブラウザ内で処理され、サーバーにアップロードされません</li>
                                <li><strong>2億件以上の学術文献</strong>：CrossrefとOpenAlexの包括的なデータベースで照合</li>
                                <li><strong>多言語対応</strong>：日本語・英語のインターフェース</li>
                                <li><strong>オープンソース</strong>：CC BY 4.0ライセンスでソースコードを公開</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">開発の背景</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                ChatGPTをはじめとする生成AIの急速な普及に伴い、AIが生成した架空の引用文献（ハルシネーション）が
                                学術論文に紛れ込むリスクが顕在化しました。研究によると、AIが生成した参考文献の最大30%が
                                実在しない可能性があるとされています。
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                しかし、既存の引用検証ツールの多くは有料であるか、使い勝手が悪いものでした。
                                Cite Checkerは、誰でも簡単に使える無料の引用検証ツールとして開発されました。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">技術スタック</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checkerは最新のWeb技術を活用して構築されています：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>フロントエンド</strong>：Next.js（React）、TypeScript、Tailwind CSS</li>
                                <li><strong>PDF解析</strong>：pdf.js（ブラウザ内処理）</li>
                                <li><strong>文献解析</strong>：GROBID（機械学習ベースの書誌情報解析）</li>
                                <li><strong>データベース</strong>：Crossref API、OpenAlex API</li>
                                <li><strong>レイアウト検出</strong>：YOLOv10（2段組PDF対応）</li>
                                <li><strong>ホスティング</strong>：Vercel</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">検証の仕組み</h2>
                            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                                <li>PDFをブラウザ内で解析し、参考文献セクションを特定</li>
                                <li>GROBIDを使用して各引用の書誌情報（著者、タイトル、年、ジャーナル）を構造化</li>
                                <li>Crossref API（1億件以上）で一次検索を実施</li>
                                <li>信頼度が低い場合、OpenAlex API（2億件以上）でフォールバック検索</li>
                                <li>タイトル類似度（50%）、著者一致度（30%）、出版年（20%）で総合信頼度を算出</li>
                            </ol>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">オープンソース</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checkerは透明性を重視し、ソースコードを
                                <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub</a>
                                で公開しています。バグ報告、機能リクエスト、プルリクエストを歓迎します。
                            </p>
                        </section>
                    </article>
                ) : (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">About Cite Checker</h1>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker aims to provide an environment where all researchers and students can verify
                                their citations <strong>for free and securely</strong>.
                                With the rise of generative AI increasing the risk of fabricated citations (hallucinations),
                                maintaining accurate reference lists is more important than ever.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Key Features</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>Completely Free</strong>: No usage limits for researchers and students</li>
                                <li><strong>No Registration</strong>: No account creation or login required</li>
                                <li><strong>Privacy-First</strong>: PDFs are processed in-browser and never uploaded to servers</li>
                                <li><strong>200M+ Scholarly Works</strong>: Cross-referenced against comprehensive Crossref and OpenAlex databases</li>
                                <li><strong>Multilingual</strong>: Japanese and English interface</li>
                                <li><strong>Open Source</strong>: Source code available under CC BY 4.0 license</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Why We Built This</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The rapid adoption of generative AI tools like ChatGPT has brought a new risk to academic writing:
                                AI-generated fabricated citations (hallucinations) finding their way into research papers.
                                Studies suggest that up to 30% of AI-generated references may be entirely fictitious.
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                However, most existing citation verification tools are either paid or difficult to use.
                                Cite Checker was developed as a free, easy-to-use citation verification tool accessible to everyone.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Technology Stack</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker is built with modern web technologies:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>Frontend</strong>: Next.js (React), TypeScript, Tailwind CSS</li>
                                <li><strong>PDF Parsing</strong>: pdf.js (in-browser processing)</li>
                                <li><strong>Bibliographic Analysis</strong>: GROBID (ML-based citation parsing)</li>
                                <li><strong>Databases</strong>: Crossref API, OpenAlex API</li>
                                <li><strong>Layout Detection</strong>: YOLOv10 (for 2-column PDF support)</li>
                                <li><strong>Hosting</strong>: Vercel</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">How Verification Works</h2>
                            <ol className="list-decimal list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Parse the PDF in-browser and identify the reference section</li>
                                <li>Use GROBID to structure bibliographic data (authors, title, year, journal) for each citation</li>
                                <li>Perform primary search via Crossref API (100M+ works)</li>
                                <li>If confidence is low, fallback search via OpenAlex API (200M+ works)</li>
                                <li>Calculate overall confidence using title similarity (50%), author match (30%), and publication year (20%)</li>
                            </ol>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Open Source</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker values transparency and publishes its source code on
                                <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer"> GitHub</a>.
                                We welcome bug reports, feature requests, and pull requests.
                            </p>
                        </section>
                    </article>
                )}

                {/* CTA */}
                <section className="p-8 bg-[#DA7756]/5 rounded-2xl border border-[#DA7756]/10 text-center">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-3">
                        {lang === "ja" ? "今すぐ引用を検証" : "Verify Your Citations Now"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {lang === "ja"
                            ? "PDFをアップロードして、参考文献の正確性を確認しましょう。"
                            : "Upload your PDF to check the accuracy of your references."}
                    </p>
                    <Link
                        href={`/${lang}`}
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#DA7756] text-white font-medium rounded-lg hover:bg-[#c56a4d] transition-colors"
                    >
                        {lang === "ja" ? "Cite Checkerを使う" : "Use Cite Checker"}
                    </Link>
                </section>

                <div className="pt-6 border-t border-gray-100">
                    <Link
                        href={`/${lang}`}
                        className="text-sm text-muted-foreground hover:text-[#DA7756] transition-colors underline underline-offset-4"
                    >
                        {lang === "ja" ? "← トップページに戻る" : "← Back to Home"}
                    </Link>
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "AboutPage",
                        "name": lang === "ja" ? "Cite Checkerについて" : "About Cite Checker",
                        "url": `https://www.citechecker.app/${lang}/about`,
                        "description": lang === "ja"
                            ? "学術論文の引用を無料で検証するプライバシー重視のオープンソースツール"
                            : "A privacy-first, open-source tool for verifying academic citations for free",
                        "isPartOf": {
                            "@type": "WebSite",
                            "name": "Cite Checker",
                            "url": "https://www.citechecker.app"
                        }
                    }),
                }}
            />
        </main>
    );
}
