"use client";

import { Citation } from "@/lib/citation-types";

export type { Citation };

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

interface TextItem {
  str: string;
  dir: string;
  width: number;
  height: number;
  transform: number[];
  x: number;
  y: number;
  fontSize: number;
}

interface PageLine {
  y: number;
  x: number;
  text: string;
}

async function loadPdfJs() {
  if (pdfjsLib) return pdfjsLib;
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be used in the browser");
  }
  pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjsLib;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjs = await loadPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    const midX = viewport.width / 2;

    const items: TextItem[] = textContent.items.map((item: any) => {
      const tx = item.transform;
      return {
        str: item.str,
        dir: item.dir,
        width: item.width,
        height: item.height,
        transform: tx,
        hasEOL: item.hasEOL,
        x: tx[4],
        y: tx[5],
        fontSize: Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]),
      };
    });

    if (items.length === 0) continue;

    // Detect 2-column layout (Simple Left/Right split)
    let leftItems: TextItem[] = [];
    let rightItems: TextItem[] = [];

    // Heuristic: Check density on both sides
    for (const item of items) {
      if (item.x < midX) leftItems.push(item);
      else rightItems.push(item);
    }

    const isTwoColumn = (leftItems.length > items.length * 0.3) && (rightItems.length > items.length * 0.3);

    let processGroups: TextItem[][] = [];

    if (isTwoColumn) {
      // Sort each group
      leftItems.sort(compareYThenX);
      rightItems.sort(compareYThenX);
      processGroups = [leftItems, rightItems];
    } else {
      items.sort(compareYThenX);
      processGroups = [items];
    }

    // Reconstruct Lines for each group and join
    for (const group of processGroups) {
      const groupLines = reconstructLines(group);
      const groupText = groupLines.map(l => l.text).join("\n");
      fullText += groupText + "\n";
    }
  }

  return fullText;
}

function compareYThenX(a: TextItem, b: TextItem) {
  const yDiff = Math.abs(a.y - b.y);
  if (yDiff < (a.fontSize || 10) / 2) {
    return a.x - b.x;
  }
  return b.y - a.y; // Descending Y (Top to Bottom)
}

function reconstructLines(items: TextItem[]): PageLine[] {
  const lines: PageLine[] = [];
  if (items.length === 0) return lines;

  // Determine margin (minX) to detect indentation
  // Robust MinX detection: Filter out rare outliers (e.g. page numbers)
  const xCounts: Record<number, number> = {};
  for (const item of items) {
    const bucket = Math.floor(item.x / 2) * 2; // Bucket by 2px
    xCounts[bucket] = (xCounts[bucket] || 0) + 1;
  }

  const total = items.length;
  // If we have enough items, ignore single outliers that are far left
  const threshold = total > 20 ? 2 : 1;

  let validXs = Object.keys(xCounts).map(Number).filter(x => xCounts[x] >= threshold);
  if (validXs.length === 0) validXs = Object.keys(xCounts).map(Number); // Fallback

  const minX = Math.min(...validXs);

  let currentLineY = items[0].y;
  let currentLineText: string[] = [];
  let currentLineX = items[0].x;

  // Track previous Y to detect blank lines
  let lastY = currentLineY;

  for (const item of items) {
    // Line break detection
    if (Math.abs(item.y - currentLineY) < (item.fontSize || 10) / 2) {
      currentLineText.push(item.str);
    } else {
      // Commit current line
      // Check for indentation
      const isIndented = currentLineX > minX + 5; // 5 units tolerance
      const prefix = isIndented ? "  " : "";

      lines.push({
        y: currentLineY,
        x: currentLineX,
        text: prefix + currentLineText.join(" "),
      });

      // Check for vertical gap (Blank Line)
      const gap = Math.abs(item.y - lastY);
      // Typical line height is ~1.2 * fontSize.
      // If gap > 2 * fontSize, assume blank line.
      if (gap > (item.fontSize || 10) * 2.0) {
        lines.push({ y: (item.y + lastY) / 2, x: minX, text: "" }); // Blank line
      }

      currentLineY = item.y;
      currentLineText = [item.str];
      currentLineX = item.x;
      lastY = item.y;
    }
  }
  if (currentLineText.length > 0) {
    const isIndented = currentLineX > minX + 5;
    const prefix = isIndented ? "  " : "";
    lines.push({
      y: currentLineY,
      x: currentLineX,
      text: prefix + currentLineText.join(" "),
    });
  }
  return lines;
}

/**
 * Robust extraction using strict structure analysis
 */
export function extractCitations(text: string): Citation[] {
  let processedText = text;

  // 0. Pre-process: split merged headers
  const mergedHeaderRegex = /^(.*(?:References|REFERENCES|参考文献).{0,5})\s+(\[[0-9]+\]|[0-9]+\.)\s+(.*)$/gm;
  processedText = processedText.replace(mergedHeaderRegex, "$1\n$2 $3");

  // 1. Identify the References section
  const lines = processedText.split(/\n/);
  let startLineIndex = -1;
  const refHeaderPattern = /^\s*(?:References|REFERENCES|参考文献|Works Cited|Bibliography|References\s+and\s+Notes)(?:\s|$)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (refHeaderPattern.test(line) || /^\s*\d+\.?\s*References\s*$/i.test(line)) {
      startLineIndex = i;
      console.log(`📚 References header found at line ${i}: "${line}"`);
      break;
    }
  }

  // Fallback
  if (startLineIndex === -1) {
    console.log("⚠️ References header not found, searching for first [1]");
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*\[\s*1\s*\]/.test(lines[i])) {
        startLineIndex = i;
        break;
      }
    }
  }

  const relevantLines = startLineIndex !== -1 ? lines.slice(startLineIndex) : lines;
  const rawCitations: { refNum: string; raw: string }[] = [];

  // 2. Detect Dominant Style
  let bracketCount = 0;
  let dotCount = 0;

  const bracketStartTest = /^\s*\[\s*(\d+)\s*\]/;
  const dotStartTest = /^\s*(\d+)\.\s+/;

  for (const line of relevantLines) {
    if (bracketStartTest.test(line)) bracketCount++;
    else {
      const match = line.match(dotStartTest);
      if (match && parseInt(match[1]) < 500) {
        dotCount++;
      }
    }
  }

  const useBracket = bracketCount > 0 && bracketCount >= dotCount;
  const useDot = dotCount > 0 && dotCount > bracketCount;
  const isUnnumbered = bracketCount === 0 && dotCount === 0;

  console.log(`Style detection: [n]=${bracketCount}, n.=${dotCount} => Mode: ${useBracket ? "BRACKET" : (useDot ? "DOT" : "UNNUMBERED")}`);

  // 3. Line-by-Line Extraction
  let currentRefNum: string | null = null;
  let currentRawLines: string[] = [];
  let unnumberedCounter = 1;

  const bracketStart = /^\s*\[\s*(\d+)\s*\]\s*(.*)/;
  const dotStart = /^\s*(\d+)\.\s+(.*)/;

  for (const line of relevantLines) {
    // Check for Blank Line (separator)
    const isBlank = !line.trim();

    if (isBlank && isUnnumbered) {
      if (currentRefNum && currentRawLines.length > 0) {
        // Maybe commit here if we wanted strict blank line splitting?
        // But we assume indentation logic handles commits.
      }
      currentRefNum = null; // Force reset
      continue;
    }

    if (isBlank) continue;

    let match = null;
    let isNewCitation = false;
    let newRefNumStr = "";
    let content = "";

    const trimmed = line.trim();

    if (useBracket) {
      match = line.match(bracketStart);
      if (match) {
        isNewCitation = true;
        newRefNumStr = match[1];
        content = match[2];
      }
    } else if (useDot) {
      match = line.match(dotStart);
      if (match) {
        const numVal = parseInt(match[1]);
        if (numVal < 500) {
          isNewCitation = true;
          newRefNumStr = match[1];
          content = match[2];
        }
      }
    } else {
      // UNNUMBERED Logic
      const isIndented = line.startsWith(" ");
      const startsWithCap = /^[A-Z]/.test(trimmed);

      if (!isIndented && startsWithCap) {
        isNewCitation = true; // Hanging indent start logic
      } else if (currentRefNum === null) {
        if (startsWithCap) {
          isNewCitation = true;
        }
      }

      if (isNewCitation) {
        newRefNumStr = String(unnumberedCounter++);
        content = trimmed;
      }
    }

    if (isNewCitation) {
      // Commit previous
      if (currentRefNum && currentRawLines.length > 0) {
        const raw = currentRawLines.join(" ").trim();
        if (raw.length > 10) {
          rawCitations.push({ refNum: currentRefNum, raw });
        }
      }

      currentRefNum = newRefNumStr;
      currentRawLines = [content];
    } else {
      // Continuation
      if (currentRefNum) {
        currentRawLines.push(trimmed);
      }
    }
  } // End Loop

  // Commit last
  if (currentRefNum && currentRawLines.length > 0) {
    const raw = currentRawLines.join(" ").trim();
    if (raw.length > 10) {
      rawCitations.push({ refNum: currentRefNum, raw });
    }
  }

  // 4. Post-Process: Clean "References" header if it leaked into First Citation
  if (rawCitations.length > 0) {
    const first = rawCitations[0];
    const headerRegex = /^(?:References|REFERENCES|参考文献|Works Cited|Bibliography)\s*/;
    if (headerRegex.test(first.raw)) {
      console.log("Cleaning leaked header from first citation...");
      first.raw = first.raw.replace(headerRegex, "").trim();
    }
  }

  // 5. Determine Final Style Name
  let detectedStyle = "Unknown";
  if (useBracket) detectedStyle = "IEEE / Numbered [n]";
  else if (useDot) detectedStyle = "Numbered (n.)";
  else if (isUnnumbered) detectedStyle = "APA / Chicago (Author-Year)";

  console.log(`📊 Extracted ${rawCitations.length} citations. Style: ${detectedStyle}`);

  return rawCitations.map((item, index) => {
    const c = parseCitation(String(index + 1), item.raw);
    c.style = detectedStyle;
    return c;
  });
}

function parseCitation(id: string, raw: string): Citation {
  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : null;

  let title: string | null = null;
  let venue: string | null = null;

  const quotedTitle = raw.match(/["「『]([^"」』]+)["」』]/);
  if (quotedTitle) title = quotedTitle[1].trim();

  if (!title && year) {
    const yearRegex = new RegExp(`\\b${year}\\b[).]?\\s*`);
    const splitParts = raw.split(yearRegex);
    if (splitParts.length > 1) {
      let candidate = splitParts[1];
      // Updated blockers list
      const blockers = [/\.\s+In\b/i, /\.\s+Proceedings/i, /\.\s+Proc\./i, /\.\s+Journal/i, /\.\s+Trans\./i, /\.\s+IEEE/i, /\.\s+ACM/i, /\.\s+Springer/i, /\.\s+Vol\./i, /\.\s+http/i];
      let bestIdx = candidate.length;
      let matchedBlocker = -1;

      for (let i = 0; i < blockers.length; i++) {
        const match = candidate.match(blockers[i]);
        if (match && match.index !== undefined && match.index < bestIdx) {
          bestIdx = match.index;
          matchedBlocker = i;
        }
      }

      if (bestIdx === candidate.length) {
        const firstPeriod = candidate.match(/\.\s+[A-Z]/);
        if (firstPeriod && firstPeriod.index !== undefined) bestIdx = firstPeriod.index;
      }

      // If we found a specific blocker like "In" or "Proc", the REST is potential Venue
      if (matchedBlocker !== -1) {
        // Extract venue from the rest
        let venueText = candidate.substring(bestIdx).trim();
        // Remove leading ". " or ". In "
        venueText = venueText.replace(/^\.\s+(In\s+)?/i, "").trim();
        // Cleanup trailing punctuation
        venueText = venueText.replace(/[.,]$/, "");
        if (venueText.length > 2) venue = venueText;
      }

      candidate = candidate.substring(0, bestIdx).trim();
      candidate = candidate.replace(/\.$/, "").replace(/\s+In$/i, "");
      if (candidate.length > 5) title = candidate;
    }
  }

  if (!title) {
    const parts = raw.split(/\.\s+/);
    if (parts.length >= 3) {
      const p1 = parts[1].trim();
      if (p1.length > 10 && !/^(In|Proc|Journal|Vol)/i.test(p1) && !/\d{4}/.test(p1)) title = p1;
    }
  }

  // Fallback for Venue if not found via title split?
  // Maybe look for "Journal of..." or "Transactions on..."
  if (!venue) {
    const venueMatch = raw.match(/(?:Journal|Transactions|Proceedings|Conference|Symposium|Workshop)\s+of\s+.*?(?=\.|,|\d{4})/i);
    if (venueMatch) venue = venueMatch[0].trim();
  }

  let authors: string | null = null;
  const authorsMatch = raw.match(/^([^(0-9"]+?)(?=[\s,]*(?:\(|\d{4}|"|“))/);
  if (authorsMatch) authors = authorsMatch[1].trim().replace(/[,.]$/, "");

  return { id, raw, title, authors, venue, year };
}

export function extractTitleForSearch(citation: Citation): string {
  if (citation.title) {
    let cleaned = citation.title.replace(/[^\w\s\-:,]/g, " ").replace(/\s+/g, " ").trim();
    if (cleaned.length > 150) cleaned = cleaned.substring(0, 150);
    return cleaned;
  }
  return citation.raw.substring(0, 100).replace(/[^\w\s]/g, " ");
}
