/**
 * Shared Markdown parser for guide and blog pages.
 * Supports: headings, bold, code blocks, inline code, links, lists, tables, ordered lists.
 */
export function parseMarkdown(markdown: string): string {
    let html = markdown
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Code blocks
        .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        // Line breaks - paragraphs
        .replace(/\n\n/g, '</p><p>');

    // Tables: detect lines with | and convert
    html = html.replace(
        /(<p>)?\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)+)(<\/p>)?/g,
        (_match, _p1, headerRow, bodyRows) => {
            const headers = headerRow.split('|').map((h: string) => h.trim()).filter(Boolean);
            const headerHtml = '<tr>' + headers.map((h: string) => `<th>${h}</th>`).join('') + '</tr>';

            const rows = bodyRows.trim().split('\n').map((row: string) => {
                const cells = row.split('|').map((c: string) => c.trim()).filter(Boolean);
                return '<tr>' + cells.map((c: string) => `<td>${c}</td>`).join('') + '</tr>';
            }).join('');

            return `<table><thead>${headerHtml}</thead><tbody>${rows}</tbody></table>`;
        }
    );

    // Ordered lists
    html = html.replace(/^(\d+)\. (.*$)/gm, '<oli>$2</oli>');
    // Wrap ordered list items
    html = html.replace(/(<oli>[\s\S]*?<\/oli>)/g, '<ol>$1</ol>');
    html = html.replace(/<\/ol>\s*<ol>/g, '');
    html = html.replace(/<oli>/g, '<li>');
    html = html.replace(/<\/oli>/g, '</li>');

    // Unordered lists
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');

    // Wrap unordered lists (use [\s\S] for cross-line matching)
    html = html.replace(/(<li>[\s\S]*<\/li>)/g, '<ul>$1</ul>');
    // Clean up multiple ul tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Don't double-wrap ol items in ul
    html = html.replace(/<ul>(\s*<ol>)/g, '$1');
    html = html.replace(/<\/ol>(\s*<\/ul>)/g, '</ol>');

    // Wrap in paragraph tags
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p>\s*<h/g, '<h');
    html = html.replace(/<\/h([23])>\s*<\/p>/g, '</h$1>');
    html = html.replace(/<p>\s*<ul>/g, '<ul>');
    html = html.replace(/<\/ul>\s*<\/p>/g, '</ul>');
    html = html.replace(/<p>\s*<ol>/g, '<ol>');
    html = html.replace(/<\/ol>\s*<\/p>/g, '</ol>');
    html = html.replace(/<p>\s*<pre>/g, '<pre>');
    html = html.replace(/<\/pre>\s*<\/p>/g, '</pre>');
    html = html.replace(/<p>\s*<table>/g, '<table>');
    html = html.replace(/<\/table>\s*<\/p>/g, '</table>');

    // Horizontal rules
    html = html.replace(/<p>---<\/p>/g, '<hr>');

    return html;
}
