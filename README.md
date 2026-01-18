# Cite Checker - 引用の信頼性を確かめる (Verify Citations)

Cite Checker is a privacy-first tool designed to verify the existence of citations in your manuscript PDF.
It helps researchers detect "hallucinated" or incorrect references by cross-checking your bibliography against trusted academic databases (Crossref & OpenAlex).

![Cite Checker Demo](./public/og-image.png)

## ✨ Key Features (主な特徴)

### 🔒 Privacy-First: Local PDF Parsing (完全ローカル処理)
We prioritize your research confidentiality. Your manuscript **never leaves your device**.
- **Client-Side Processing**: We use **browser-based PDF parsing** (via `pdf.js`).
- **No File Uploads**: The full PDF file is **NOT** uploaded to our server.
- **Minimal Data Transfer**: Only the extracted citation text strings (e.g., "Smith et al., 2020...") are sent to our API strictly for the purpose of search verification.

### 🚫 Deterministic Verification (AI非依存の検証)
Unlike tools that use LLMs to "guess" validity, this tool **does NOT use Generative AI** to verify citations.
- **Fact-Based**: Verification is performed by querying **Crossref** and **OpenAlex** APIs directly.
- **No Hallucinations**: We ensure that the validation result itself is based on real database records, avoiding the "AI checking AI" problem.

### ⚡ Smart Search & UX
- **Robust Extraction**: Handles multi-column layouts and various citation styles (IEEE, APA, etc.).
- **Smart Fallback**: Strategies include Crossref -> OpenAlex -> Google Search (if enabled).
- **Interactive**: Clickable DOIs and direct links to found papers.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
git clone https://github.com/sotaro-ha/cite-checker.git
cd cite-checker
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: For Google Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: For Google Custom Search fallback (if you want deeper search coverage)
# GOOGLE_API_KEY=your_api_key
# GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: Tailwind CSS, Shadcn/ui
- **Animation**: Framer Motion
- **Parsing**: pdfjs-dist (Client-side)
- **Data**: [Crossref API](https://www.crossref.org/), [OpenAlex API](https://openalex.org/)

## 📝 License

This project is open source.

## ⚠️ Disclaimer

This tool is provided "as is". While we strive for accuracy, we cannot guarantee that every valid citation will be found (e.g., due to database coverage gaps or typo mismatches). Always manually review critical flags before submission.
