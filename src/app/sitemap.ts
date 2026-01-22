import { MetadataRoute } from 'next'
import { guideList } from '@/lib/guides'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.citechecker.app'
    // Use fixed date to avoid unnecessary cache invalidation
    const lastModified = new Date('2025-01-22')

    const staticPages: MetadataRoute.Sitemap = [
        // Root redirect
        {
            url: baseUrl,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },
        // English pages
        {
            url: `${baseUrl}/en`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
            alternates: {
                languages: {
                    en: `${baseUrl}/en`,
                    ja: `${baseUrl}/ja`,
                },
            },
        },
        {
            url: `${baseUrl}/en/disclaimer`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/disclaimer`,
                    ja: `${baseUrl}/ja/disclaimer`,
                },
            },
        },
        {
            url: `${baseUrl}/en/guides`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/guides`,
                    ja: `${baseUrl}/ja/guides`,
                },
            },
        },
        // Japanese pages
        {
            url: `${baseUrl}/ja`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
            alternates: {
                languages: {
                    en: `${baseUrl}/en`,
                    ja: `${baseUrl}/ja`,
                },
            },
        },
        {
            url: `${baseUrl}/ja/disclaimer`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.3,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/disclaimer`,
                    ja: `${baseUrl}/ja/disclaimer`,
                },
            },
        },
        {
            url: `${baseUrl}/ja/guides`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/guides`,
                    ja: `${baseUrl}/ja/guides`,
                },
            },
        },
    ]

    // Add guide pages
    const guidePages: MetadataRoute.Sitemap = guideList.flatMap(slug => [
        {
            url: `${baseUrl}/en/guides/${slug}`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/guides/${slug}`,
                    ja: `${baseUrl}/ja/guides/${slug}`,
                },
            },
        },
        {
            url: `${baseUrl}/ja/guides/${slug}`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: {
                    en: `${baseUrl}/en/guides/${slug}`,
                    ja: `${baseUrl}/ja/guides/${slug}`,
                },
            },
        },
    ])

    return [...staticPages, ...guidePages]
}
