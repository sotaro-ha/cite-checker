import Link from "next/link";
import { Language } from "@/lib/i18n";
import { use } from "react";

export default function DisclaimerPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
                {lang === 'ja' ? (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">免責事項・利用規約</h1>
                        <p className="text-sm text-muted-foreground">最終更新日: 2025年1月22日</p>

                        {/* サービス概要 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. サービス概要</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker（以下「本サービス」）は、学術論文のPDFから引用文献を抽出し、
                                外部データベース（Crossref、OpenAlex）と照合して検証を行う無料のWebツールです。
                                本サービスは研究者、学生、編集者の方々が引用の正確性を確認する際の補助ツールとして提供されています。
                            </p>
                        </section>

                        {/* 免責事項 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. 免責事項</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスの利用により生じたいかなる損害（直接的、間接的、偶発的、結果的損害を含む）についても、
                                運営者は一切の責任を負いません。これには以下が含まれますが、これらに限定されません：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>検証結果の誤りに基づく判断による損害</li>
                                <li>論文の却下、修正要求、その他の学術的影響</li>
                                <li>サービスの中断や利用不能による損害</li>
                                <li>データの損失や破損</li>
                            </ul>
                        </section>

                        {/* 検証精度と限界 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. 検証精度と限界</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスの検証結果は参考情報であり、その正確性や完全性を保証するものではありません。
                                以下の点にご注意ください：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>PDFからの引用抽出はレイアウトや書式により精度が変動します</li>
                                <li>外部データベースに登録されていない文献は「見つからない」と表示される場合があります</li>
                                <li>書籍、報告書、Webページなど、学術論文以外の引用は検証できない場合があります</li>
                                <li>著者名や年の表記揺れにより、正しい文献でも低いマッチ度になる場合があります</li>
                                <li>最終的な確認は必ずご自身で行ってください</li>
                            </ul>
                        </section>

                        {/* データの取り扱い */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. データの取り扱い</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスはプライバシーを重視して設計されています：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>PDF処理</strong>：アップロードされたPDFはお使いのブラウザ内でのみ処理され、当方のサーバーにアップロードされることはありません</li>
                                <li><strong>引用データ</strong>：抽出された引用のメタデータ（タイトル、著者名等）は、検証のため外部APIに送信されます</li>
                                <li><strong>アクセスログ</strong>：サービス改善のため、アクセス解析（Google Analytics）を使用しています</li>
                                <li><strong>Cookie</strong>：広告配信のため、第三者によるCookieが使用される場合があります</li>
                            </ul>
                        </section>

                        {/* 外部サービス */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. 外部サービスの利用</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは以下の外部APIを利用しています。これらのサービスの利用規約もご確認ください：
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><a href="https://www.crossref.org/documentation/retrieve-metadata/rest-api/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Crossref REST API</a> - 学術文献のメタデータ検索</li>
                                <li><a href="https://docs.openalex.org/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">OpenAlex API</a> - オープンな学術データベース</li>
                                <li><a href="https://grobid.readthedocs.io/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GROBID</a> - 引用文献の構造化解析（オプション）</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                これらの外部サービスの可用性、精度、変更について、当方は責任を負いません。
                            </p>
                        </section>

                        {/* 知的財産権 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. 知的財産権</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスのソースコードは<a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">CC BY 4.0ライセンス</a>の下で
                                <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub</a>にて公開されています。
                                ユーザーがアップロードしたPDFの著作権はユーザーに帰属し、本サービスはそれに対するいかなる権利も主張しません。
                            </p>
                        </section>

                        {/* 広告について */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. 広告について</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスは無料で提供するため、Google AdSense等の広告を掲載しています。
                                広告の内容は第三者によって配信されており、本サービスの運営者はその内容について責任を負いません。
                                広告に関するお問い合わせは各広告主にお願いいたします。
                            </p>
                        </section>

                        {/* サービスの変更・終了 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. サービスの変更・終了</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                運営者は、事前の通知なく本サービスの内容を変更、または提供を終了する場合があります。
                                これによりユーザーに生じた損害について、運営者は責任を負いません。
                            </p>
                        </section>

                        {/* 準拠法 */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">9. 準拠法・管轄</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本規約の解釈および適用は日本法に準拠します。
                                本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
                            </p>
                        </section>

                        {/* お問い合わせ */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">10. お問い合わせ</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                本サービスに関するご質問やフィードバックは、
                                <a href="https://github.com/sotaro-ha/cite-checker/issues" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub Issues</a>
                                までお寄せください。
                            </p>
                        </section>
                    </article>
                ) : (
                    <article className="space-y-8">
                        <h1 className="text-3xl font-bold text-[#1A1A1A] text-balance">Disclaimer & Terms of Use</h1>
                        <p className="text-sm text-muted-foreground">Last updated: January 22, 2025</p>

                        {/* Service Overview */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">1. Service Overview</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Cite Checker (the &quot;Service&quot;) is a free web tool that extracts citations from academic paper PDFs
                                and verifies them against external databases (Crossref, OpenAlex).
                                This Service is provided as an assistive tool for researchers, students, and editors to check citation accuracy.
                            </p>
                        </section>

                        {/* Disclaimer */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">2. Disclaimer of Liability</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The operator assumes no responsibility for any damages arising from the use of this Service,
                                including but not limited to direct, indirect, incidental, or consequential damages. This includes:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Damages from decisions based on incorrect verification results</li>
                                <li>Paper rejections, revision requests, or other academic consequences</li>
                                <li>Damages from service interruption or unavailability</li>
                                <li>Data loss or corruption</li>
                            </ul>
                        </section>

                        {/* Accuracy and Limitations */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">3. Accuracy and Limitations</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                Verification results are for reference only and are not guaranteed to be accurate or complete.
                                Please note the following:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li>Citation extraction accuracy varies depending on PDF layout and formatting</li>
                                <li>References not registered in external databases may appear as &quot;not found&quot;</li>
                                <li>Books, reports, and web pages may not be verifiable</li>
                                <li>Author name or year variations may result in low match scores for valid references</li>
                                <li>Always perform final verification yourself</li>
                            </ul>
                        </section>

                        {/* Data Handling */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">4. Data Handling</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service is designed with privacy in mind:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><strong>PDF Processing</strong>: Uploaded PDFs are processed entirely in your browser and are never uploaded to our servers</li>
                                <li><strong>Citation Data</strong>: Extracted citation metadata (titles, author names, etc.) is sent to external APIs for verification</li>
                                <li><strong>Access Logs</strong>: We use Google Analytics for service improvement</li>
                                <li><strong>Cookies</strong>: Third-party cookies may be used for advertising purposes</li>
                            </ul>
                        </section>

                        {/* Third-Party Services */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">5. Third-Party Services</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                This Service uses the following external APIs. Please review their terms of service:
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                                <li><a href="https://www.crossref.org/documentation/retrieve-metadata/rest-api/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">Crossref REST API</a> - Academic metadata search</li>
                                <li><a href="https://docs.openalex.org/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">OpenAlex API</a> - Open academic database</li>
                                <li><a href="https://grobid.readthedocs.io/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GROBID</a> - Citation structure analysis (optional)</li>
                            </ul>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                We are not responsible for the availability, accuracy, or changes to these external services.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">6. Intellectual Property</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The source code of this Service is available on <a href="https://github.com/sotaro-ha/cite-checker" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">GitHub</a> under
                                the <a href="https://creativecommons.org/licenses/by/4.0/" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer">CC BY 4.0 license</a>.
                                Copyright of uploaded PDFs remains with the user, and this Service claims no rights over them.
                            </p>
                        </section>

                        {/* Advertising */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">7. Advertising</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                To provide this Service for free, we display advertisements through Google AdSense and similar services.
                                Ad content is delivered by third parties, and the operator is not responsible for their content.
                                Please direct advertising inquiries to the respective advertisers.
                            </p>
                        </section>

                        {/* Service Changes */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">8. Service Changes and Termination</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                The operator may modify or terminate this Service without prior notice.
                                The operator is not responsible for any damages resulting from such changes.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">9. Governing Law and Jurisdiction</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                These terms shall be governed by and construed in accordance with the laws of Japan.
                                Any disputes arising from this Service shall be subject to the exclusive jurisdiction of the Tokyo District Court.
                            </p>
                        </section>

                        {/* Contact */}
                        <section className="space-y-3">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">10. Contact</h2>
                            <p className="text-muted-foreground leading-relaxed text-pretty">
                                For questions or feedback about this Service, please visit our
                                <a href="https://github.com/sotaro-ha/cite-checker/issues" className="underline hover:text-[#DA7756]" target="_blank" rel="noopener noreferrer"> GitHub Issues</a>.
                            </p>
                        </section>
                    </article>
                )}

                {/* Back link */}
                <div className="pt-6 border-t border-gray-100">
                    <Link
                        href={`/${lang}`}
                        className="text-sm text-muted-foreground hover:text-[#DA7756] transition-colors underline underline-offset-4"
                    >
                        {lang === 'ja' ? '← トップページに戻る' : '← Back to Home'}
                    </Link>
                </div>
            </div>
        </main>
    );
}
