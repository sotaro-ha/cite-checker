"use client";

import { Card } from "@/components/ui/card";

export function PrivacyNotice() {
    return (
        <Card className="p-4 bg-blue-50/50 border-blue-200/50">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 size-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-600"
                        aria-hidden="true"
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-blue-900">
                        プライバシー保護について
                    </h3>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        PDFファイルの解析はすべてお使いのブラウザ内で行われます。
                        論文本文がサーバーに送信されることはありません。
                        サーバーに送信されるのは、grobidによる引用の解析を経て抽出された引用文献情報のみです。
                        査読前の論文も安心してご利用いただけます。
                    </p>
                </div>
            </div>
        </Card>
    );
}
