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
        title: isJa ? "プライバシーポリシー | Cite Checker" : "Privacy Policy | Cite Checker",
        description: isJa
            ? "Cite Checkerのプライバシーポリシー。データの取り扱い、Cookie、第三者サービスについて詳しく説明します。"
            : "Cite Checker privacy policy. Details on data handling, cookies, and third-party services.",
    };
}

export default function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                <Breadcrumbs
                    lang={lang}
                    items={[{ label: lang === "ja" ? "プライバシーポリシー" : "Privacy Policy" }]}
                />
                {lang === "ja" ? (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">プライバシーポリシー</h1>
                        <p className="text-sm text-muted-foreground">最終更新日: 2025年2月9日</p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. はじめに</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker（以下「本サービス」）は、ユーザーのプライバシーを最優先に設計されたツールです。
                                本プライバシーポリシーでは、本サービスが収集、使用、保護する情報について説明します。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. 収集する情報</h2>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.1 PDFデータ</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                アップロードされたPDFファイルは<strong>お使いのブラウザ内でのみ処理</strong>されます。
                                ファイル自体が当方のサーバーに送信されることは一切ありません。
                                PDFから抽出された引用文献のメタデータ（タイトル、著者名、出版年等）のみが、
                                検証のためにAPIサーバーを経由して外部データベースに送信されます。
                            </p>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.2 アクセスログ</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                サービス改善のため、Google Analyticsを使用してアクセス情報を収集しています。
                                収集される情報には、ページビュー、参照元、ブラウザの種類、画面解像度などが含まれます。
                                これらの情報は統計データとして利用され、個人を特定することはありません。
                            </p>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.3 ユーザーアカウント</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスはアカウント登録やログインを必要としません。
                                メールアドレス、氏名などの個人情報は一切収集しません。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. Cookieの使用</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスでは以下の目的でCookieを使用しています：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>Google Analytics</strong>：アクセス解析のためのCookie（_ga、_gidなど）</li>
                                <li><strong>Google AdSense</strong>：パーソナライズド広告の配信のためのCookie</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                ブラウザの設定により、Cookieの受け入れを拒否することが可能です。
                                ただし、一部の機能が正常に動作しない場合があります。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. 第三者サービス</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは以下の第三者サービスを利用しています。各サービスのプライバシーポリシーもご確認ください：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>
                                    <a href="https://policies.google.com/privacy" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Google Analytics</a> — アクセス解析
                                </li>
                                <li>
                                    <a href="https://policies.google.com/technologies/ads" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Google AdSense</a> — 広告配信
                                </li>
                                <li>
                                    <a href="https://www.crossref.org/privacy/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Crossref</a> — 学術文献メタデータ検索
                                </li>
                                <li>
                                    <a href="https://docs.openalex.org/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">OpenAlex</a> — オープン学術データベース
                                </li>
                                <li>
                                    <a href="https://grobid.readthedocs.io/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GROBID</a> — 引用文献の構造化解析
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. データの保存と安全性</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスはユーザーのデータをサーバー側で保存しません。
                                PDF処理はすべてブラウザ内で完結し、セッション終了後にデータは破棄されます。
                                検証結果のエクスポート（CSV/BibTeX）はユーザーのローカルデバイスに保存されます。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. お子様のプライバシー</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは13歳未満のお子様を対象としていません。
                                13歳未満の方から意図的に個人情報を収集することはありません。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. ポリシーの変更</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本プライバシーポリシーは、必要に応じて更新される場合があります。
                                重要な変更がある場合は、本ページにて告知いたします。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. お問い合わせ</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                プライバシーに関するご質問やご懸念は、
                                <a href="https://github.com/sotaro-ha/cite-checker/issues" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
                                までお寄せください。
                            </p>
                        </section>
                    </article>
                ) : (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">Privacy Policy</h1>
                        <p className="text-sm text-muted-foreground">Last updated: February 9, 2025</p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. Introduction</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker (the &quot;Service&quot;) is designed with user privacy as a top priority.
                                This Privacy Policy explains the information that the Service collects, uses, and protects.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. Information We Collect</h2>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.1 PDF Data</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Uploaded PDF files are <strong>processed entirely within your browser</strong>.
                                The files themselves are never sent to our servers.
                                Only extracted citation metadata (titles, author names, publication years, etc.)
                                is sent through our API server to external databases for verification.
                            </p>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.2 Access Logs</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                We use Google Analytics to collect access information for service improvement.
                                Collected information includes page views, referrers, browser types, and screen resolutions.
                                This information is used as statistical data and does not identify individuals.
                            </p>
                            <h3 className="text-lg font-medium text-[#1A1A1A]">2.3 User Accounts</h3>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service does not require account registration or login.
                                We do not collect any personal information such as email addresses or names.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. Use of Cookies</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service uses cookies for the following purposes:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>Google Analytics</strong>: Cookies for access analysis (_ga, _gid, etc.)</li>
                                <li><strong>Google AdSense</strong>: Cookies for personalized advertising</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                You can configure your browser to reject cookies.
                                However, some features may not function properly.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. Third-Party Services</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service uses the following third-party services. Please review their respective privacy policies:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>
                                    <a href="https://policies.google.com/privacy" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Google Analytics</a> — Access analysis
                                </li>
                                <li>
                                    <a href="https://policies.google.com/technologies/ads" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Google AdSense</a> — Advertising
                                </li>
                                <li>
                                    <a href="https://www.crossref.org/privacy/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Crossref</a> — Academic metadata search
                                </li>
                                <li>
                                    <a href="https://docs.openalex.org/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">OpenAlex</a> — Open academic database
                                </li>
                                <li>
                                    <a href="https://grobid.readthedocs.io/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GROBID</a> — Citation structure analysis
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. Data Storage and Security</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service does not store user data on the server side.
                                All PDF processing is completed within the browser, and data is discarded when the session ends.
                                Exported verification results (CSV/BibTeX) are saved to the user&apos;s local device.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. Children&apos;s Privacy</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service is not intended for children under 13 years of age.
                                We do not knowingly collect personal information from children under 13.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. Changes to This Policy</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Privacy Policy may be updated as needed.
                                Significant changes will be announced on this page.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. Contact</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                For privacy-related questions or concerns, please visit our
                                <a href="https://github.com/sotaro-ha/cite-checker/issues" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer"> GitHub Issues</a>.
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
                        "@type": "WebPage",
                        "name": lang === "ja" ? "プライバシーポリシー" : "Privacy Policy",
                        "url": `https://www.citechecker.app/${lang}/privacy`,
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
