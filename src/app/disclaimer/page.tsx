import Link from "next/link";

export default function DisclaimerPage() {
    return (
        <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 py-12 px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="border-b border-[#E5E2DD] pb-6">
                    <Link href="/" className="text-xl font-sans font-bold tracking-tight text-[#1A1A1A] hover:opacity-80 transition-opacity">
                        Cite Checker
                    </Link>
                </header>

                <section className="space-y-6">
                    <div className="space-y-6 border-b border-[#E5E2DD] pb-8 mb-8">
                        <h1 className="text-2xl font-bold text-[#1A1A1A]">免責事項</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            当サイトの利用により生じた損害等の責任は一切負いません。
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            本サービスは、CrossrefおよびOpenAlexのAPIを利用して引用文献の検証を行いますが、その正確性や完全性を保証するものではありません。
                            検索結果はあくまで参考情報としてご利用いただき、最終的な確認は必ずご自身で行ってください。
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-[#1A1A1A]">Disclaimer</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            The owner of this website assumes no responsibility for any damages arising from the use of this service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                            This service uses Crossref and OpenAlex APIs to verify citations, but does not guarantee the accuracy or completeness of the results.
                            Please use the search results for reference purposes only and ensure to perform the final verification yourself.
                        </p>
                    </div>
                </section>

                <section className="pt-8 border-t border-[#E5E2DD]">
                    <Link href="/" className="text-sm text-[#DA7756] hover:underline hover:text-[#DA7756]/80 transition-colors">
                        ← トップページに戻る
                    </Link>
                </section>
            </div>
        </main>
    );
}
