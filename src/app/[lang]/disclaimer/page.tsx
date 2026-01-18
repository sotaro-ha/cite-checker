import Link from "next/link";
import { Language } from "@/lib/i18n";
import { use } from "react";

export default function DisclaimerPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = use(params) as { lang: Language };

    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <section className="space-y-6">
                    {lang === 'ja' ? (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">免責事項</h1>
                            <p className="text-muted-foreground leading-relaxed">
                                当サイトの利用により生じた損害等の責任は一切負いません。
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                本サービスは、CrossrefおよびOpenAlexのAPIを利用して引用文献の検証を行いますが、その正確性や完全性を保証するものではありません。
                                検索結果はあくまで参考情報としてご利用いただき、最終的な確認は必ずご自身で行ってください。
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                本サイトでは、サーバー維持費を賄うために広告を掲載しています。
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">Disclaimer</h1>
                            <p className="text-muted-foreground leading-relaxed">
                                The owner of this website assumes no responsibility for any damages arising from the use of this service.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                This service uses Crossref and OpenAlex APIs to verify citations, but does not guarantee the accuracy or completeness of the results.
                                Please use the search results for reference purposes only and ensure to perform the final verification yourself.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                This site displays advertisements to cover server maintenance costs.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
