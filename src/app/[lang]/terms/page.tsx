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
        title: isJa ? "利用規約 | Cite Checker" : "Terms of Service | Cite Checker",
        description: isJa
            ? "Cite Checkerの利用規約。利用条件、免責事項、禁止事項について詳しく説明します。"
            : "Cite Checker terms of service. Details on usage conditions, disclaimers, and prohibited activities.",
    };
}

export default function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                <Breadcrumbs
                    lang={lang}
                    items={[{ label: lang === "ja" ? "利用規約" : "Terms of Service" }]}
                />
                {lang === "ja" ? (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">利用規約</h1>
                        <p className="text-sm text-muted-foreground">最終更新日: 2025年2月9日</p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. 規約への同意</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker（以下「本サービス」）を利用することにより、
                                ユーザーは本利用規約に同意したものとみなされます。
                                本規約に同意いただけない場合は、本サービスの利用をお控えください。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. サービスの説明</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは、学術論文のPDFから引用文献を抽出し、Crossref・OpenAlexデータベースとの
                                照合により検証を行う無料のWebツールです。PDF処理はクライアント側（ブラウザ内）で行われ、
                                抽出された引用テキストのみが検証APIに送信されます。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. 利用条件</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>個人的な研究・学術目的での利用は無料です</li>
                                <li>利用にあたりアカウント登録やログインは不要です</li>
                                <li>検証結果は参考情報であり、最終確認はご自身で行ってください</li>
                                <li>常識的な範囲での利用をお願いいたします（過度なAPI呼び出し等はお控えください）</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. 禁止事項</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                以下の行為は禁止されています：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>本サービスの機能を悪用するスクレイピングや自動化ツールの使用</li>
                                <li>サービスのインフラに過度な負荷をかける行為</li>
                                <li>他のユーザーのサービス利用を妨害する行為</li>
                                <li>本サービスを違法な目的で利用する行為</li>
                                <li>本サービスのセキュリティを侵害する試み</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. 免責事項</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは「現状のまま」提供されます。運営者は以下について一切保証しません：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>検証結果の正確性、完全性、信頼性</li>
                                <li>サービスの継続的な利用可能性</li>
                                <li>特定の目的への適合性</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスの利用により生じたいかなる損害についても、運営者は責任を負いません。
                                詳細は<Link href={`/${lang}/disclaimer`} className="underline hover:text-[#DA7756]">免責事項</Link>をご確認ください。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. 知的財産権</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスのソースコードは
                                <a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">CC BY 4.0ライセンス</a>
                                の下で
                                <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub</a>
                                にて公開されています。ユーザーがアップロードしたPDFの著作権はユーザーに帰属します。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. 広告について</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは無料で提供するため、Google AdSense等の広告を掲載しています。
                                広告の内容は第三者により配信されており、運営者はその内容について責任を負いません。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. 規約の変更</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                運営者は、事前の通知なく本規約を変更する場合があります。
                                変更後のサービス利用をもって、変更後の規約に同意したものとみなします。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">9. 準拠法・管轄</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本規約の解釈および適用は日本法に準拠します。
                                本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">10. お問い合わせ</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本規約に関するご質問は、
                                <a href="https://github.com/sotaro-ha/cite-checker/issues" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
                                までお寄せください。
                            </p>
                        </section>
                    </article>
                ) : (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">Terms of Service</h1>
                        <p className="text-sm text-muted-foreground">Last updated: February 9, 2025</p>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. Acceptance of Terms</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                By using Cite Checker (the &quot;Service&quot;), you agree to these Terms of Service.
                                If you do not agree to these terms, please refrain from using the Service.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. Description of Service</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The Service is a free web tool that extracts citations from academic paper PDFs
                                and verifies them against Crossref and OpenAlex databases. PDF processing occurs
                                client-side (within your browser), and only extracted citation text is sent to verification APIs.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. Usage Conditions</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Personal research and academic use is free</li>
                                <li>No account registration or login is required</li>
                                <li>Verification results are for reference only; always perform final checks yourself</li>
                                <li>Please use the Service within reasonable limits (avoid excessive API calls)</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. Prohibited Activities</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The following activities are prohibited:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Using scraping or automation tools that abuse the Service&apos;s functionality</li>
                                <li>Placing excessive load on the Service&apos;s infrastructure</li>
                                <li>Interfering with other users&apos; use of the Service</li>
                                <li>Using the Service for illegal purposes</li>
                                <li>Attempting to breach the Service&apos;s security</li>
                            </ul>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. Disclaimer</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The Service is provided &quot;as is.&quot; The operator makes no guarantees regarding:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Accuracy, completeness, or reliability of verification results</li>
                                <li>Continuous availability of the Service</li>
                                <li>Fitness for a particular purpose</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The operator is not responsible for any damages arising from the use of this Service.
                                See our <Link href={`/${lang}/disclaimer`} className="underline hover:text-[#DA7756]">Disclaimer</Link> for details.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. Intellectual Property</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The source code of this Service is available on
                                <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer"> GitHub</a> under
                                the <a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">CC BY 4.0 license</a>.
                                Copyright of uploaded PDFs remains with the user.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. Advertising</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                To provide this Service for free, we display advertisements through Google AdSense and similar services.
                                Ad content is delivered by third parties, and the operator is not responsible for their content.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. Changes to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The operator may modify these terms without prior notice.
                                Continued use of the Service after changes constitutes acceptance of the modified terms.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">9. Governing Law and Jurisdiction</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                These terms shall be governed by and construed in accordance with the laws of Japan.
                                Any disputes arising from this Service shall be subject to the exclusive jurisdiction of the Tokyo District Court.
                            </p>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">10. Contact</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                For questions regarding these terms, please visit our
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
                        "name": lang === "ja" ? "利用規約" : "Terms of Service",
                        "url": `https://www.citechecker.app/${lang}/terms`,
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
