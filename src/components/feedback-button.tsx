"use client";

import { MessageCircle } from "lucide-react";

export function FeedbackButton() {
    return (
        <a
            href="https://forms.gle/9AdZTrEZYNBjPEKC9"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-50 flex items-center justify-center size-12 bg-slate-900 hover:bg-[#DA7756] text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl group"
            aria-label="Send Feedback"
            title="Send Feedback"
        >
            <MessageCircle className="w-6 h-6 stroke-[1.5]" />
            <span className="sr-only">Feedback</span>

            {/* Tooltip-ish text that appears on hover could be nice, but simple round button was requested */}
        </a>
    );
}
