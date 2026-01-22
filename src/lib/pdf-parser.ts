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

    // Detect 2-column layout (Improved detection)
    let leftItems: TextItem[] = [];
    let rightItems: TextItem[] = [];

    // Split items by midpoint
    for (const item of items) {
      if (item.x < midX) leftItems.push(item);
      else rightItems.push(item);
    }

    // Improved 2-column detection:
    // Simply check if both sides have a meaningful number of items
    // Academic papers typically have at least 10 text items per column per page
    const isTwoColumn = leftItems.length >= 10 && rightItems.length >= 10;

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
  // Also match REFERENCES in the middle of a line (common in 2-column PDFs)
  const refHeaderMidLinePattern = /\s{2,}(?:REFERENCES|References)\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (refHeaderPattern.test(line) || /^\s*\d+\.?\s*References\s*$/i.test(line)) {
      startLineIndex = i;
      console.log(`📚 References header found at line ${i}: "${line}"`);
      break;
    }
    // Check for REFERENCES at end of line (merged from 2-column layout)
    if (refHeaderMidLinePattern.test(line)) {
      startLineIndex = i;
      console.log(`📚 References header found mid-line at ${i}: "${line.substring(line.length - 50)}"`);
      break;
    }
  }

  // Fallback: Find a sequence of numbered references (not just a single [1])
  if (startLineIndex === -1) {
    console.log("⚠️ References header not found, searching for numbered sequence");
    // Look for a cluster of [n] patterns that appear consecutively (within ~10 lines)
    // This helps distinguish actual reference sections from inline citations
    for (let i = 0; i < lines.length - 5; i++) {
      if (/^\s*\[\s*1\s*\]/.test(lines[i])) {
        // Check if there are more sequential references nearby
        let sequentialCount = 1;
        let lastRefNum = 1;
        for (let j = i + 1; j < Math.min(i + 30, lines.length); j++) {
          const match = lines[j].match(/^\s*\[\s*(\d+)\s*\]/);
          if (match) {
            const refNum = parseInt(match[1]);
            // Must be sequential or close (allow gaps for multi-line refs)
            if (refNum === lastRefNum + 1 || refNum === lastRefNum) {
              sequentialCount++;
              lastRefNum = refNum;
            }
          }
        }
        // Only accept if we found at least 3 sequential references
        if (sequentialCount >= 3) {
          startLineIndex = i;
          console.log(`📚 Found reference sequence starting at line ${i}`);
          break;
        }
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

  // Pattern to detect end of references section (Appendix, Acknowledgments after refs, etc.)
  const endOfRefsPattern = /^\s*(?:A(?:PPENDIX)?|B|C|D)(?:\s+|\.\s*)[A-Z][A-Z\s]+|^\s*(?:APPENDIX|Appendix|付録)/;

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

    // Check if we've hit the end of references (e.g., Appendix section)
    if (endOfRefsPattern.test(trimmed)) {
      console.log(`📍 End of references detected: "${trimmed.substring(0, 50)}"`);
      // Commit current citation before breaking
      if (currentRefNum && currentRawLines.length > 0) {
        const raw = currentRawLines.join(" ").trim();
        if (raw.length > 10) {
          rawCitations.push({ refNum: currentRefNum, raw });
        }
      }
      currentRefNum = null; // Clear to prevent double-commit after loop
      break;
    }

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

  // 4.5 Filter out body text that was mistakenly captured as citations
  // Real citations are typically under 700 characters (some have page headers merged)
  const MAX_CITATION_LENGTH = 700;
  const filteredCitations = rawCitations.filter(c => {
    if (c.raw.length > MAX_CITATION_LENGTH) {
      console.log(`Filtered out long text (${c.raw.length} chars): "${c.raw.substring(0, 50)}..."`);
      return false;
    }
    return true;
  });

  // If we filtered out many entries at the start, we likely captured body text
  // Re-number the citations
  const finalCitations = filteredCitations.map((item, index) => ({
    ...item,
    refNum: String(index + 1)
  }));

  // 5. Determine Final Style Name
  let detectedStyle = "Unknown";
  if (useBracket) detectedStyle = "IEEE / Numbered [n]";
  else if (useDot) detectedStyle = "Numbered (n.)";
  else if (isUnnumbered) detectedStyle = "APA / Chicago (Author-Year)";

  console.log(`📊 Extracted ${finalCitations.length} citations (filtered from ${rawCitations.length}). Style: ${detectedStyle}`);

  return finalCitations.map((item, index) => {
    // Pass detected style to parser
    const c = parseCitation(String(index + 1), item.raw, detectedStyle);
    c.style = detectedStyle;
    return c;
  });
}

function parseCitation(id: string, raw: string, style?: string): Citation {
  const yearMatch = raw.match(/\b(19\d{2}|20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : null;

  let title: string | null = null;
  let venue: string | null = null;
  let authors: string | null = null;

  // 0. Quoted Title Strategy (Highest Integrity)
  const quotedTitle = raw.match(/["“「『]([^"”」』]+)["”」』]/);
  if (quotedTitle) {
    title = quotedTitle[1].trim();
    // If we found a quoted title, authors are likely before it
    const titleIndex = raw.indexOf(quotedTitle[0]);
    if (titleIndex > 0) {
      authors = raw.substring(0, titleIndex).trim().replace(/[.,:]+$/, "");
    }
  }

  // 1. Style-Based Strategy: IEEE / Numbered
  // Typical Format: [1] Authors. Title. Venue, Year.
  if (!title && (!style || style.includes("Numbered") || style.includes("IEEE"))) {
    // Split by " . " or ". " but ignore initials like "A. "
    // Lookbehind (?<!\b[A-Z]) ensures we don't split at "P. Smith"
    // Lookbehind (?<!\bet al) ensures we don't split at "et al."
    const parts = raw.split(/(?<!\b(?:[A-Z]|et al|Inc|Ltd))\.\s+/);

    if (parts.length >= 2) {
      // Part 0 is likely Authors
      const p0 = parts[0].trim();
      // Part 1 is likely Title
      const p1 = parts[1].trim();

      // Validation: Authors shouldn't be too long or look like a title
      // Validation: Title shouldn't start with "In", "Vol", "doi:", "http"
      const isValidTitle = (t: string) => {
        return t.length > 5 &&
          !/^(In|Proc|Journal|Vol|doi|http|arXiv)/i.test(t) &&
          !/^\d{4}/.test(t); // Not just a year
      };

      if (isValidTitle(p1)) {
        authors = p0;
        title = p1;

        // Try to set Venue from remaining parts
        if (parts.length > 2) {
          // If part 2 starts with "In ", that's a strong venue signal
          let v = parts.slice(2).join(". ").trim();
          // cleanup doi
          v = v.split(/doi:/i)[0].trim();
          if (v.length > 2) venue = v;
        }
      }
    }
  }

  // 2. Fallback / Universal Strategy (Original Logic improved)
  if (!title && year) {
    const yearRegex = new RegExp(`\\b${year}\\b[).]?\\s*`);
    const splitParts = raw.split(yearRegex);
    if (splitParts.length > 1) {
      let candidate = splitParts[1];
      // Updated blockers list
      const blockers = [/\.\s+In\b/i, /\.\s+Proceedings/i, /\.\s+Proc\./i, /\.\s+Journal/i, /\.\s+Trans\./i, /\.\s+IEEE/i, /\.\s+ACM/i, /\.\s+Springer/i, /\.\s+Vol\./i, /\.\s+http/i, /doi:/i];
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

      if (matchedBlocker !== -1) {
        let venueText = candidate.substring(bestIdx).trim();
        venueText = venueText.replace(/^\.\s+(In\s+)?/i, "").trim();
        venueText = venueText.replace(/[.,]$/, "");
        if (venueText.length > 2) venue = venueText;
      }

      candidate = candidate.substring(0, bestIdx).trim();
      candidate = candidate.replace(/\.$/, "").replace(/\s+In$/i, "");
      if (candidate.length > 5 && !/doi:/i.test(candidate)) {
        // Validate that candidate is not just pages or metadata
        if (!/^[\d\(\[]/.test(candidate)) {
          title = candidate;
        }
      }
    }
  }

  // 3. Fallback generic split
  if (!title) {
    const parts = raw.split(/(?<!\b(?:[A-Z]|et al|Inc|Ltd))\.\s+/);
    if (parts.length >= 2) {
      const p1 = parts[1].trim();
      if (p1.length > 5 && !/^(In|Proc|Journal|Vol|doi|http)/i.test(p1) && !/^\d{4}/.test(p1)) {
        title = p1;
        // If we found title this way, assume prev part is author if not set
        if (!authors) authors = parts[0].trim();
      }
    }
  }
  // Try to take everything before the Title
  if (title) {
    const titleIdx = raw.indexOf(title);
    if (titleIdx > 3) {
      const candidate = raw.substring(0, titleIdx).trim().replace(/[.,]+$/, "");
      if (candidate.length < 200) authors = candidate;
    }
  }

  // Original regex fallback
  if (!authors) {
    const authorsMatch = raw.match(/^([^(0-9"]+?)(?=[\s,]*(?:\(|\d{4}|"|“))/);
    if (authorsMatch) authors = authorsMatch[1].trim().replace(/[,.]$/, "");
  }

  // Comma Strategy
  if (!title && !authors && raw.includes(",")) {
    const parts = raw.split(", ");
    if (parts.length > 2) {
      let splitIndex = -1;
      const isName = (str: string) => {
        const trimmed = str.trim();
        if (trimmed.length > 20) return false;
        if (/\b(and|et al|Inc)\b/.test(trimmed)) return true;
        return /[A-Z]\./.test(trimmed) || /^[A-Z][a-z]+$/.test(trimmed);
      };

      for (let i = 0; i < parts.length - 1; i++) {
        const current = parts[i];
        const next = parts[i + 1];
        if (isName(current) && !isName(next)) {
          if (next.length > 10 && !/^\d{4}/.test(next) && !/^(Vol|No|pp)/i.test(next)) {
            splitIndex = i + 1;
            break;
          }
        }
      }

      if (splitIndex !== -1) {
        authors = parts.slice(0, splitIndex).join(", ").trim();
        const remaining = parts.slice(splitIndex).join(", ");
        const yearMatch2 = remaining.match(/\s+\(?\b(19|20)\d{2}\b/);
        if (yearMatch2 && yearMatch2.index) {
          title = remaining.substring(0, yearMatch2.index).trim().replace(/[.,]$/, "");
          venue = remaining.substring(yearMatch2.index).trim();
        } else {
          title = parts[splitIndex].trim();
          if (parts.length > splitIndex + 1) {
            venue = parts.slice(splitIndex + 1).join(", ").trim();
          }
        }
      }
    }
  }

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
