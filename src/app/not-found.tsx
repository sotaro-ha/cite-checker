import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-dvh bg-white text-slate-800 font-sans selection:bg-[#DA7756]/20 flex items-center justify-center px-6">
            <div className="text-center space-y-6 max-w-md">
                <p className="text-6xl font-bold text-[#DA7756]">404</p>
                <h1 className="text-2xl font-bold text-[#1A1A1A]">
                    Page Not Found
                </h1>
                <p className="text-muted-foreground">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <p className="text-muted-foreground">
                    お探しのページは見つかりませんでした。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Link
                        href="/en"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#DA7756] text-white font-medium rounded-lg hover:bg-[#c56a4d] transition-colors"
                    >
                        Go to Home (EN)
                    </Link>
                    <Link
                        href="/ja"
                        className="inline-flex items-center justify-center px-6 py-3 border border-[#DA7756] text-[#DA7756] font-medium rounded-lg hover:bg-[#DA7756]/5 transition-colors"
                    >
                        ホームへ戻る (JA)
                    </Link>
                </div>
            </div>
        </main>
    );
}
