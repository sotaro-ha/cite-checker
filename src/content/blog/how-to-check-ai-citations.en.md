---
title: "I Asked ChatGPT for 10 References. Three Were Completely Made Up."
description: "When I verified AI-generated citations against Crossref and Google Scholar, nearly a third didn't exist. Here's exactly how I check now, and what you should do before submitting."
date: "2025-03-01"
author: "Cite Checker Team"
tags: ["AI", "hallucination", "citation verification", "ChatGPT"]
readingTime: 8
relatedGuides: ["ai-hallucination", "citation-verification"]
---

## The experiment that changed how I handle AI references

I asked GPT-4 for ten references on reinforcement learning. The output looked perfect — clean APA formatting, real-sounding author names, plausible journal titles. I almost dropped them straight into my bibliography.

Then I checked. Three DOIs returned 404 errors. Two titles didn't exist anywhere on Google Scholar. One paper listed a real professor at MIT as an author, but the paper wasn't on his publication page. Out of ten references, three were pure fiction.

This wasn't a fluke. Walters and Wilder's 2023 study in Nature reported that roughly 28% of ChatGPT-generated references were fabricated. The AI doesn't search any database. It predicts what a citation *should look like* based on patterns, and sometimes those predictions are entirely made up.

The scary part? They look completely real at first glance.

## Why AI can't tell real papers from fake ones

Large language models have seen millions of academic citations during training. They know the format cold — "Smith et al. (2021). Title. *Journal Name*, 15(2), 123-145." They can generate that pattern all day.

What they can't do is look up whether a specific paper actually exists. There's no database connection, no search step. It's pattern completion, not fact retrieval. Asking ChatGPT for references is like asking someone with a photographic memory of citation formats but zero access to a library catalog.

## How I actually verify citations now

After getting burned, I developed a routine. Here it is, in the order I use it.

### Step 1: Paste the DOI into your browser (takes 30 seconds)

If the AI provided a DOI, go to `https://doi.org/10.xxxx/yyyy`. If it redirects to the paper, it's real. If you get a 404, it's fake.

Two caveats. First, the AI sometimes invents DOIs that have the right format but point nowhere. Second, not every paper has a DOI — older publications and books often don't.

### Step 2: Search the title on Google Scholar

Put the exact title in double quotes. No results? Try removing a few words and searching again. AI sometimes subtly modifies real titles — "A Survey of Deep Learning" becomes "A Comprehensive Survey of Deep Learning Methods." If you find something close, check that the authors and year match too.

### Step 3: Check the author's publication list

For citations that still feel suspicious, look up the first author on Google Scholar Profiles or ORCID. Most active researchers maintain these. If the paper isn't in their list, that's a strong signal it doesn't exist.

### Step 4: Search Crossref directly

Go to search.crossref.org and search by title. Crossref indexes over 150 million scholarly works. If a journal article isn't there, it's worth being skeptical.

## When manual checking isn't practical

Let's be honest. If your paper has 50+ references, checking each one by hand takes hours. I know because I've done it — it took me about two hours for a 60-reference paper.

Cite Checker helps here. Upload the PDF, and it automatically extracts your references and checks them against Crossref and OpenAlex. Everything happens in your browser, so unpublished work stays private.

But it's not perfect. Books, websites, and some conference proceedings aren't in these databases, so they'll show as "Not Found" even when they're real. And unusual PDF layouts can cause extraction errors. **Always manually double-check anything flagged as suspicious.**

## How to read the results

**High confidence (80%+):** Title, authors, and year match a database record. The citation almost certainly exists. For critical references, still click through to the original just to be safe.

**Low confidence (50-80%):** Something's off — maybe the year is wrong by one, or an author's initials differ. This usually means a transcription error rather than a fake citation. Check the original and fix the metadata.

**Not found:** This is the alert, but it doesn't automatically mean the citation is fake. Legitimate reasons for "not found" include:

- arXiv preprints (sometimes not in Crossref)
- Very new papers (indexing takes time)
- Books and technical reports
- Japanese-language papers (not in English databases)

The key is to investigate each "not found" individually rather than assuming the worst.

## Don't ask the AI to verify itself

I've seen people paste a citation back into ChatGPT and ask "Is this paper real?" The AI will confidently say yes. It has no way to know — it's not searching anything. You're asking the person who made up the answer to confirm their own answer. Use external sources.

## The workflow I've settled on

After months of trial and error, here's what actually works:

1. Use AI for organizing and summarizing papers you've already found — not for discovering new ones
2. If AI does suggest references, treat every single one as unverified
3. Run your PDF through Cite Checker for a batch check
4. Manually verify anything that comes back "Not Found" or low confidence
5. Before final submission, click every DOI link in your reference list

Is it extra work? Yes. But it takes maybe 30 minutes for a typical paper, and it's far better than having a reviewer discover a fabricated reference in your bibliography.
