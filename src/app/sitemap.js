export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Static routes
    const routes = [
        '',
        '/about',
        '/services',
        '/projects',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
