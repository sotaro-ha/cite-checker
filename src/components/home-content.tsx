"use client";

import { Language, translations } from "@/lib/i18n";
import { Upload, Search, CheckCircle2, AlertTriangle, FileText, Shield } from "lucide-react";

export function HomeContent({ lang }: { lang: Language }) {
    const t = translations[lang];

    return (
        <div className="space-y-24 py-12">

            {/* How it Works Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">{t.howItWorksTitle}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#DA7756]">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t.step1Title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.step1Desc}</p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#DA7756]">
                            <FileText size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t.step2Title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.step2Desc}</p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center space-y-4 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-[#DA7756]">
                            <Search size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{t.step3Title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.step3Desc}</p>
                    </div>
                </div>
            </section>

            {/* Why Verify Section */}
            <section className="space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-[#1A1A1A]">{t.whyTitle}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Reason 1 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-red-600 mb-2">
                            <AlertTriangle size={20} />
                            <h3 className="font-bold">{t.reason1Title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-red-100 pl-4">
                            {t.reason1Desc}
                        </p>
                    </div>

                    {/* Reason 2 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-amber-600 mb-2">
                            <AlertTriangle size={20} />
                            <h3 className="font-bold">{t.reason2Title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-amber-100 pl-4">
                            {t.reason2Desc}
                        </p>
                    </div>

                    {/* Reason 3 */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-emerald-600 mb-2">
                            <CheckCircle2 size={20} />
                            <h3 className="font-bold">{t.reason3Title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-emerald-100 pl-4">
                            {t.reason3Desc}
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-3xl mx-auto space-y-8 bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">{t.faqTitle}</h2>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-900">{t.faq1Q}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.faq1A}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-900">{t.faq2Q}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.faq2A}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-900">{t.faq3Q}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{t.faq3A}</p>
                    </div>
                </div>
            </section>

        </div>
    );
}
