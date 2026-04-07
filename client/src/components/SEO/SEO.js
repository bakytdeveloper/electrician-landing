import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
                 title = "Профессиональный электрик | Монтаж и обслуживание электротехники",
                 description = "Профессиональные услуги электрика: монтаж, обслуживание, ремонт бытовой техники и электропроводки. Вызов электрика на дом.",
                 keywords = "электрик, монтаж электропроводки, ремонт, электромонтаж, вызов электрика",
                 ogImage = "/og-image.jpg"
             }) => {
    const siteUrl = process.env.REACT_APP_SITE_URL || "https://ваш-сайт.ru";

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />

            {/* Open Graph для соцсетей */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:type" content="website" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={siteUrl} />
        </Helmet>
    );
};

export default SEO;