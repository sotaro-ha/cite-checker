import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.citechecker.app'
    const lastModified = new Date()

    return [
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
    ]
}
