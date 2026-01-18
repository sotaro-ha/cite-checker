import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: ['Googlebot', 'Googlebot-Image', 'Googlebot-Video', 'Bingbot'],
                allow: '/',
            },
            {
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'CCBot',
                    'CommonCrawl',
                    'anthropic-ai',
                    'Claude-Web',
                    'Bytespider',
                    'FacebookBot',
                    'PerplexityBot',
                    'Omgilibot',
                    'Diffbot',
                ],
                disallow: '/',
            },
            {
                userAgent: '*',
                allow: '/',
            },
        ],
        sitemap: 'https://www.citechecker.app/sitemap.xml',
    };
}
