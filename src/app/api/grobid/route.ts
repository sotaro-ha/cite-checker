import { NextRequest, NextResponse } from "next/server";
import { parseCitationWithGrobid } from "@/lib/grobid";

export async function POST(req: NextRequest) {
    try {
        const { citations } = await req.json();

        if (!citations || !Array.isArray(citations)) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const parsed = await parseCitationWithGrobid(citations);
        return NextResponse.json({ results: parsed });

    } catch (error) {
        console.error("API Grobid Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
