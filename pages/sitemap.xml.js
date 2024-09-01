export default function Sitemap() {
    return null;
}

export async function getServerSideProps({res}) {

    // GET THE URL
    const baseUrl = "https://easydietkw.com";

    // GET ALL PAGES URLS
    const allPagesUrls = [
        {
            url: `${baseUrl}/`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/user/License`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/user/menu`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/user/packages`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/auth/login`,
            changefreq: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/auth/register`,
            changefreq: 'daily',
            priority: 0.9,
        }
    ];

    // CREATE THE SITEMAP
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            ${allPagesUrls.map((page) => {
        return `
                    <url>
                        <loc>${page.url}</loc>
                        <changefreq>${page.changefreq}</changefreq>
                        <priority>${page.priority}</priority>
                    </url>
                `
    }).join("")}
        </urlset>
        `;

    // SET THE HEADERS
    res.setHeader("Content-Type", "text/xml");
    // WRITE THE SITEMAP
    res.write(sitemap);
    res.end();

    return {
        props: {},
    }
}
