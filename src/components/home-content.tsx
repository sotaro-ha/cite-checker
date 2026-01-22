"use client";

import { Language } from "@/lib/i18n";
import { FileText, Shield, Github } from "lucide-react";
import Link from "next/link";

interface HomeContentProps {
    lang: Language;
}

export function HomeContent({ lang }: HomeContentProps) {
    const isJa = lang === "ja";

    const content = {
        tagline: isJa
            ? "学術論文の引用文献を、安全かつ簡単に検証"
            : "Verify academic citations safely and easily",
        features: [
            {
                icon: FileText,
                title: isJa ? "PDFから直接検証" : "Direct PDF Verification",
                desc: isJa
                    ? "PDFをドロップするだけ。面倒な手入力は不要。引用リストを自動抽出し、CrossrefとOpenAlexの2億件以上のデータベースと照合します。"
                    : "Just drop your PDF. No manual entry needed. We auto-extract citations and cross-check against 200M+ records in Crossref and OpenAlex.",
            },
            {
                icon: Shield,
                title: isJa ? "完全ローカル処理" : "Fully Local Processing",
                desc: isJa
                    ? "PDFの解析はすべてブラウザ内で完結。ファイルがサーバーにアップロードされることはありません。査読前の論文でも安心してご利用いただけます。"
                    : "All PDF parsing happens in your browser. Your file never leaves your device. Safe for unpublished manuscripts and confidential research.",
            },
            {
                icon: Github,
                title: isJa ? "オープンソース" : "Open Source",
                desc: isJa
                    ? "ソースコードはGitHubで公開中。CC BY 4.0ライセンスのもと、誰でも自由に利用・改変できます。透明性と信頼性を重視しています。"
                    : "Source code is public on GitHub under CC BY 4.0 license. Free to use, modify, and share. We prioritize transparency and trust.",
                link: "https://github.com/sotaro-ha/cite-checker",
                linkText: isJa ? "GitHubで見る" : "View on GitHub",
            },
        ],
    };

    return (
        <section className="pt-16 pb-8">
            {/* Tagline */}
            <p className="text-center text-lg text-muted-foreground font-light mb-16">
                {content.tagline}
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {content.features.map((feature, i) => (
                    <div key={i} className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#DA7756]/10 text-[#DA7756]">
                            <feature.icon size={24} />
                        </div>
                        <h3 className="font-bold text-[#1A1A1A]">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {feature.desc}
                        </p>
                        {feature.link && (
                            <Link
                                href={feature.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm text-[#DA7756] hover:underline"
                            >
                                <Github size={14} />
                                {feature.linkText}
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
