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
        title: isJa ? "お問い合わせ | Cite Checker" : "Contact | Cite Checker",
        description: isJa
            ? "Cite Checkerへのお問い合わせ方法。バグ報告、機能リクエスト、一般的なご質問はGitHub Issuesまでお寄せください。"
            : "How to contact Cite Checker. Submit bug reports, feature requests, and general questions via GitHub Issues.",
    };
}

export default function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                <Breadcrumbs
                    lang={lang}
                    items={[{ label: lang === "ja" ? "お問い合わせ" : "Contact" }]}
                />
                {lang === "ja" ? (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">お問い合わせ</h1>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">連絡方法</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checkerに関するお問い合わせは、GitHub Issuesにてお受けしています。
                                バグ報告、機能リクエスト、一般的なご質問など、お気軽にお寄せください。
                            </p>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <a
                                    href="https://github.com/sotaro-ha/cite-checker/issues"
                                    className="text-lg font-semibold text-[#DA7756] hover:text-[#c56a4d] underline underline-offset-4 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    GitHub Issues を開く →
                                </a>
                                <p className="text-sm text-muted-foreground mt-2">
                                    GitHubアカウントが必要です（無料で作成できます）
                                </p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">お問い合わせの種類</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">バグ報告</h3>
                                    <p className="text-sm text-muted-foreground">
                                        PDFの解析エラー、表示の不具合、検証結果の問題など。
                                        再現手順とブラウザの情報を添えていただけると対応がスムーズです。
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">機能リクエスト</h3>
                                    <p className="text-sm text-muted-foreground">
                                        新機能の提案や既存機能の改善要望。
                                        具体的なユースケースを記載いただけると検討しやすくなります。
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">一般的なご質問</h3>
                                    <p className="text-sm text-muted-foreground">
                                        使い方に関する質問、技術的な質問、商用利用の相談など。
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">よくある質問（FAQ）</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: PDFが正しく解析されません</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: スキャンPDFや画像のみのPDFには対応していません。テキスト選択可能なPDFをお試しください。
                                        特殊なレイアウトの場合も解析精度が低下することがあります。
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: 引用が「見つかりません」と表示されます</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: データベースに登録されていない文献（書籍、レポート、Webサイトなど）や、
                                        非常に新しい論文は見つからない場合があります。記述ミスの可能性もあるため、手動での確認をお勧めします。
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: 商用利用は可能ですか？</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: 個人の研究目的での利用は自由です。組織での大規模利用については、GitHub Issuesでご相談ください。
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: コントリビュートしたいです</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: 大歓迎です！
                                        <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHubリポジトリ</a>
                                        からプルリクエストをお送りください。
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">レスポンスについて</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checkerは個人で運営しているプロジェクトのため、
                                お返事までにお時間をいただく場合があります。ご了承ください。
                            </p>
                        </section>
                    </article>
                ) : (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">Contact</h1>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">How to Reach Us</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                For any inquiries about Cite Checker, please use GitHub Issues.
                                Feel free to submit bug reports, feature requests, or general questions.
                            </p>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <a
                                    href="https://github.com/sotaro-ha/cite-checker/issues"
                                    className="text-lg font-semibold text-[#DA7756] hover:text-[#c56a4d] underline underline-offset-4 transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open GitHub Issues →
                                </a>
                                <p className="text-sm text-muted-foreground mt-2">
                                    A GitHub account is required (free to create)
                                </p>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Types of Inquiries</h2>
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">Bug Reports</h3>
                                    <p className="text-sm text-muted-foreground">
                                        PDF parsing errors, display issues, verification problems, etc.
                                        Including reproduction steps and browser information helps us resolve issues faster.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">Feature Requests</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Suggestions for new features or improvements to existing ones.
                                        Describing specific use cases helps us evaluate requests.
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-[#1A1A1A] mb-1">General Questions</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Usage questions, technical inquiries, commercial use consultations, etc.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: My PDF isn&apos;t parsing correctly</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: Scanned PDFs and image-only PDFs are not supported. Please try a text-selectable PDF.
                                        Special layouts may also reduce parsing accuracy.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: A citation shows &quot;Not Found&quot;</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: Works not in databases (books, reports, websites) or very recent papers may not be found.
                                        There could also be transcription errors. We recommend manual verification.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: Can I use this commercially?</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: Personal research use is free. For large-scale organizational use, please reach out via GitHub Issues.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-[#1A1A1A]">Q: I&apos;d like to contribute</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        A: We welcome contributions! Please send pull requests to our
                                        <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer"> GitHub repository</a>.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Response Times</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker is maintained by an individual, so responses may take some time.
                                Thank you for your understanding.
                            </p>
                        </section>
                    </article>
                )}

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
                        "@type": "ContactPage",
                        "name": lang === "ja" ? "お問い合わせ" : "Contact",
                        "url": `https://www.citechecker.app/${lang}/contact`,
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
