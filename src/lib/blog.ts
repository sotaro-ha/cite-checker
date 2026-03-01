import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Language } from "@/lib/i18n";

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    author: string;
    tags: string[];
    readingTime: number;
    relatedGuides: string[];
    content: string;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getBlogPost(slug: string, lang: Language): BlogPost | null {
    const filePath = path.join(BLOG_DIR, `${slug}.${lang}.md`);
    if (!fs.existsSync(filePath)) return null;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);

    const readingTime = lang === "ja"
        ? Math.ceil(content.length / 400)
        : Math.ceil(content.split(/\s+/).length / 200);

    return {
        slug,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        author: data.author ?? "Cite Checker Team",
        tags: data.tags ?? [],
        readingTime,
        relatedGuides: data.relatedGuides ?? [],
        content,
    };
}

export function getBlogSlugs(): string[] {
    if (!fs.existsSync(BLOG_DIR)) return [];
    const files = fs.readdirSync(BLOG_DIR);
    const slugs = new Set<string>();
    for (const file of files) {
        const match = file.match(/^(.+)\.(ja|en)\.md$/);
        if (match) slugs.add(match[1]);
    }
    return Array.from(slugs);
}

export function getBlogPosts(lang: Language): BlogPost[] {
    const slugs = getBlogSlugs();
    const posts: BlogPost[] = [];
    for (const slug of slugs) {
        const post = getBlogPost(slug, lang);
        if (post) posts.push(post);
    }
    // Sort by date descending
    posts.sort((a, b) => (b.date > a.date ? 1 : -1));
    return posts;
}
