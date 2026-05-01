// client/src/components/SEO/SEO.js
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const getEnv = (key, fallback = '') => process.env[key] || fallback;

const SEO = ({
                 title,
                 description,
                 keywords,
                 page = 'home',
                 ogImage = "/og-image.jpg",
                 noIndex = false
             }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`);
                const data = await response.json();
                setConfig(data);
            } catch (err) {
                console.error('Error fetching config for SEO:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const defaultCity = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер');

    // Динамические мета-теги в зависимости от страницы
    const getPageMetadata = () => {
        const city = config?.addressCity || defaultCity;
        const phone = config?.phoneDisplay || '+7 (727) 123-45-67';

        const metadata = {
            home: {
                title: `Профессиональный электрик | Монтаж и ремонт электропроводки в ${city}`,
                description: `✅ Профессиональные услуги электрика в ${city}: монтаж, ремонт электропроводки, установка электрооборудования. ⚡ Выезд мастера за 15 минут. Гарантия качества. ☎️ ${phone}`,
                keywords: `электрик ${city}, услуги электрика, монтаж проводки, ремонт электрики, замена электропроводки, электромонтаж ${city}, вызвать электрика на дом ${city}`
            },
            services: {
                title: `Услуги электрика в ${city} | Полный спектр электромонтажных работ`,
                description: `🔧 Профессиональные услуги электрика в ${city}: монтаж, ремонт, замена проводки, установка электрооборудования, автоматов, счетчиков. Выезд мастера. ☎️ ${phone}`,
                keywords: `услуги электрика ${city}, электромонтаж, монтаж проводки, ремонт проводки, установка розеток, замена автоматов, электрик на дом`
            },
            contact: {
                title: `Контакты электрика в ${city} | Телефон, адрес, карта проезда`,
                description: `📍 Контакты электрика в ${city}: телефон ${phone}, адрес офиса, схема проезда на карте. Работаем ежедневно. Звоните!`,
                keywords: `контакты электрика ${city}, телефон электрика, адрес электрика ${city}, карта проезда, как добраться`
            },
            portfolio: {
                title: `Работы электрика в ${city} | Фото выполненных проектов`,
                description: `📸 Фото выполненных работ электрика в ${city}. Примеры монтажа проводки, установки оборудования, замены электрики. Реальные проекты.`,
                keywords: `работы электрика ${city}, фото электромонтажа, портфолио электрика, примеры работ, электромонтаж фото`
            },
            about: {
                title: `О компании | Профессиональный электрик в ${city}`,
                description: `ℹ️ Профессиональный электрик в ${city}. Опыт более 10 лет, гарантия качества, доступные цены. Лицензии и сертификаты.`,
                keywords: `о нас электрик ${city}, опыт электрика, гарантия электромонтажа, сертификаты электрика`
            }
        };

        return metadata[page] || metadata.home;
    };

    const pageMetadata = getPageMetadata();
    const finalTitle = title || pageMetadata.title;
    const finalDescription = description || pageMetadata.description;
    const finalKeywords = keywords || pageMetadata.keywords;

    // Формируем канонический URL
    const canonicalUrl = `${siteUrl}${window.location.pathname}`;

    return (
        <Helmet>
            <html lang="ru" />
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            {noIndex ? (
                <meta name="robots" content="noindex, nofollow" />
            ) : (
                <meta name="robots" content="index, follow" />
            )}
            <meta name="author" content={companyName} />
            <meta name="geo.placename" content={config?.addressCity || defaultCity} />
            <meta name="geo.region" content="KZ" />

            <meta name="yandex-verification" content="ваш-код-верификации" />
            <meta name="google-site-verification" content="ваш-код-верификации" />

            {/* Open Graph */}
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="ru_KZ" />
            <meta property="og:site_name" content={companyName} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* hreflang для Казахстана */}
            <link rel="alternate" hrefLang="ru-kz" href={siteUrl} />
            <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        </Helmet>
    );
};

export default SEO;