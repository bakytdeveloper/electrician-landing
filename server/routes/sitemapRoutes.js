const express = require('express');
const router = express.Router();
const ContactConfig = require('../models/ContactConfig');

router.get('/sitemap.xml', async (req, res) => {
    try {
        const config = await ContactConfig.findOne();
        const siteUrl = process.env.REACT_APP_SITE_URL || 'https://electromaster.kz';
        const city = config?.addressCity || process.env.REACT_APP_ADDRESS_CITY || 'Алматы';
        const currentDate = new Date().toISOString().split('T')[0];

        const urls = [
            { loc: '/', priority: '1.0', changefreq: 'weekly' },
            { loc: '/#services', priority: '0.9', changefreq: 'monthly' },
            { loc: '/#portfolio', priority: '0.8', changefreq: 'monthly' },
            { loc: '/#about', priority: '0.8', changefreq: 'monthly' },
            { loc: '/#contact', priority: '0.9', changefreq: 'monthly' }
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls.map(url => `    <url>
                    <loc>${siteUrl}${url.loc}</loc>
                    <lastmod>${currentDate}</lastmod>
                    <changefreq>${url.changefreq}</changefreq>
                    <priority>${url.priority}</priority>
                </url>`).join('\n')}
            </urlset>`;

        res.header('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.status(500).send('Error generating sitemap');
    }
});

module.exports = router;