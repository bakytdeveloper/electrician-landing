// client/src/components/SEO/SEO.js
import React from 'react';
import { Helmet } from 'react-helmet-async';

const getEnv = (key, fallback = '') => process.env[key] || fallback;

const SEO = ({
                 title,
                 description,
                 keywords,
                 ogImage = "/og-image.jpg"
             }) => {
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const defaultTitle = getEnv('REACT_APP_DEFAULT_TITLE', 'Профессиональный электрик | Монтаж и обслуживание электротехники в Алматы');
    const defaultDescription = getEnv('REACT_APP_DEFAULT_DESCRIPTION', '✅ Профессиональные услуги электрика в Алматы: монтаж, обслуживание, ремонт электропроводки. ⚡ Выезд мастера на дом.');
    const defaultKeywords = getEnv('REACT_APP_DEFAULT_KEYWORDS', 'электрик алматы, монтаж электропроводки, ремонт проводки, электромонтаж');
    // const phoneRaw = getEnv('REACT_APP_PHONE_RAW', '+77271234567');
    const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');

    const finalTitle = title || defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalKeywords = keywords || defaultKeywords;

    return (
        <Helmet>
            <html lang="ru" />
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content={companyName} />
            <meta name="geo.placename" content={city} />
            <meta name="geo.region" content="KZ" />

            {/* Яндекс.Вебмастер и Google Search Console */}
            <meta name="yandex-verification" content="ваш-код-верификации" />
            <meta name="google-site-verification" content="ваш-код-верификации" />

            {/* Open Graph */}
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="ru_KZ" />
            <meta property="og:site_name" content={companyName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={siteUrl} />

            {/* Альтернативные языки (если нужны) */}
            {/* <link rel="alternate" hrefLang="kk" href={`${siteUrl}/kk`} /> */}

            {/* Контакты для поисковых систем */}
            <meta name="format-detection" content="telephone=no" />

            {/* JSON-LD схемы будут добавлены в компоненте SchemaMarkup */}
        </Helmet>
    );
};

export default SEO;