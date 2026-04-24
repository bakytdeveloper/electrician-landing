// client/src/utils/seoHelpers.js
// import { getContactConfig } from './adminApi';

// Кешируем данные для производительности
let cachedConfig = null;
let configPromise = null;

const getConfig = async () => {
    if (cachedConfig) return cachedConfig;
    if (configPromise) return configPromise;

    configPromise = (async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/contacts/config`);
            const data = await response.json();
            cachedConfig = data;
            return data;
        } catch (error) {
            console.error('Error fetching config for SEO:', error);
            return null;
        }
    })();

    return configPromise;
};

// Получение переменных окружения с fallback (синхронно для статики)
const getEnv = (key, fallback = '') => {
    // Сначала пробуем из process.env
    if (process.env[key]) return process.env[key];
    return fallback;
};

// Асинхронное получение конфигурации (для динамических данных)
export const getDynamicConfig = getConfig;

// Генерация хлебных крошек с реальными данными
export const generateBreadcrumbs = async (items, config = null) => {
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const city = config?.addressCity || getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');

    const defaultItems = [
        {
            position: 1,
            name: 'Главная',
            item: siteUrl
        },
        {
            position: 2,
            name: `Электрик в ${city}`,
            item: `${siteUrl}/#services`
        },
        {
            position: 3,
            name: `Контакты электрика ${city}`,
            item: `${siteUrl}/#contact`
        }
    ];

    const breadcrumbs = items || defaultItems;

    return breadcrumbs.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        item: item.item
    }));
};

// Генерация Schema для организации с динамическими данными
export const generateOrganizationSchema = async () => {
    const config = await getConfig();
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const city = config?.addressCity || getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const phoneDisplay = config?.phoneDisplay || getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    const email = config?.email || getEnv('REACT_APP_EMAIL', 'info@electromaster.kz');
    const companyName = config?.companyName || getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер');
    const companyDesc = config?.companyDescription || getEnv('REACT_APP_COMPANY_DESCRIPTION', 'Профессиональные услуги электрика в Алматы');
    const street = config?.addressStreet || getEnv('REACT_APP_ADDRESS_STREET', 'ул. Абая, 123');
    const region = config?.addressRegion || getEnv('REACT_APP_ADDRESS_REGION', 'Алматинская область');
    const postalCode = config?.addressPostalCode || getEnv('REACT_APP_ADDRESS_POSTAL_CODE', '050000');
    const lat = parseFloat(getEnv('REACT_APP_GEO_LAT', '43.2220'));
    const lng = parseFloat(getEnv('REACT_APP_GEO_LNG', '76.8512'));
    const weekdayHours = config?.weekdayHours || getEnv('REACT_APP_WEEKDAY_HOURS', '08:00-20:00');
    const weekendHours = config?.weekendHours || getEnv('REACT_APP_WEEKEND_HOURS', '09:00-18:00');

    return {
        '@context': 'https://schema.org',
        '@type': 'ElectricalContractor',
        name: companyName,
        alternateName: config?.companyAlternateName || getEnv('REACT_APP_COMPANY_ALTERNATE_NAME', 'Услуги электрика в Алматы'),
        description: companyDesc,
        telephone: phoneDisplay,
        email: email,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        foundingDate: '2018',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            value: '5'
        },
        openingHours: [
            `Mo-Fr ${weekdayHours}`,
            `Sa-Su ${weekendHours}`
        ],
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: weekdayHours.split('-')[0]?.trim(),
                closes: weekdayHours.split('-')[1]?.trim()
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: weekendHours.split('-')[0]?.trim(),
                closes: weekendHours.split('-')[1]?.trim()
            }
        ],
        priceRange: '₸15000 - ₸150000',
        paymentAccepted: 'Наличные, Банковская карта, Kaspi.kz',
        areaServed: {
            '@type': 'City',
            name: city,
            containedInPlace: {
                '@type': 'State',
                name: region
            }
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: street,
            addressLocality: city,
            addressRegion: region,
            postalCode: postalCode,
            addressCountry: 'KZ'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: lat,
            longitude: lng
        },
        sameAs: [
            config?.instagramUsername ? `https://instagram.com/${config.instagramUsername}` : null,
            config?.telegramUsername ? `https://t.me/${config.telegramUsername}` : null,
            config?.phoneForWhatsapp ? `https://wa.me/${config.phoneForWhatsapp}` : null
        ].filter(Boolean),
        hasMap: config?.yandexMapUrl || getEnv('REACT_APP_MAP_DIRECT_URL', 'https://yandex.kz/maps/'),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: getEnv('REACT_APP_RATING_VALUE', '4.9'),
            reviewCount: getEnv('REACT_APP_REVIEW_COUNT', '47'),
            bestRating: '5',
            worstRating: '1'
        }
    };
};

// Генерация локальной схемы бизнеса
export const generateLocalBusinessSchema = async () => {
    const config = await getConfig();
    const city = config?.addressCity || getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const phoneDisplay = config?.phoneDisplay || getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    const lat = parseFloat(getEnv('REACT_APP_GEO_LAT', '43.2220'));
    const lng = parseFloat(getEnv('REACT_APP_GEO_LNG', '76.8512'));
    const companyName = config?.companyName || getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер');

    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: companyName,
        description: getEnv('REACT_APP_COMPANY_DESCRIPTION', 'Электромонтажные работы в Алматы и области. Выезд электрика на дом.'),
        address: {
            '@type': 'PostalAddress',
            addressLocality: city,
            addressCountry: 'KZ'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: lat,
            longitude: lng
        },
        priceRange: '₸₸',
        telephone: phoneDisplay,
        url: getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz')
    };
};

// Генерация Service Schema для услуг
export const generateServiceSchema = async (services) => {
    const config = await getConfig();
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const companyName = config?.companyName || getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер');

    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Услуги электрика в Алматы',
        description: 'Полный перечень электромонтажных услуг',
        numberOfItems: services?.length || 6,
        itemListElement: (services || [
            'Монтаж электропроводки',
            'Ремонт проводки',
            'Установка электрооборудования',
            'Замеры и проектирование',
            'Аварийный вызов',
            'Консультация электрика'
        ]).map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: service,
            url: `${siteUrl}/#services`,
            offeredBy: {
                '@type': 'Organization',
                name: companyName
            }
        }))
    };
};

// Генерация мета-тегов для разных страниц
export const getPageMetadata = (page, customData = {}) => {
    const configPromise = getConfig();
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const defaultCity = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');

    // Базовые мета-теги (будут обновлены после получения конфигурации)
    const baseMetadata = {
        home: {
            title: `Профессиональный электрик | Монтаж и ремонт электропроводки в ${defaultCity}`,
            description: `✅ Профессиональные услуги электрика в ${defaultCity}. Монтаж, ремонт, замена проводки. Выезд за 15 минут. Гарантия качества. ☎️ +7 (727) 123-45-67`,
            keywords: `электрик ${defaultCity}, услуги электрика, монтаж проводки, ремонт электрики, замена электропроводки, электромонтаж ${defaultCity}`
        },
        services: {
            title: `Услуги электрика в ${defaultCity} | Полный спектр электромонтажных работ`,
            description: `🔧 Профессиональные услуги электрика в ${defaultCity}: монтаж, ремонт, замена проводки, установка электрооборудования. Выезд мастера.`,
            keywords: `услуги электрика ${defaultCity}, электромонтаж, монтаж проводки, ремонт проводки, установка розеток, замена автоматов`
        },
        contact: {
            title: `Контакты электрика в ${defaultCity} | Телефон, адрес, карта проезда`,
            description: `📍 Контакты электрика в ${defaultCity}: телефон, адрес офиса, схема проезда на карте. Звоните ☎️ +7 (727) 123-45-67`,
            keywords: `контакты электрика ${defaultCity}, телефон электрика, адрес электрика ${defaultCity}, карта проезда`
        },
        portfolio: {
            title: `Работы электрика в ${defaultCity} | Фото выполненных проектов`,
            description: `📸 Фото выполненных работ электрика в ${defaultCity}. Примеры монтажа проводки, установки оборудования. Реальные проекты.`,
            keywords: `работы электрика ${defaultCity}, фото электромонтажа, портфолио электрика, примеры работ`
        },
        about: {
            title: `О нас | Профессиональный электрик в ${defaultCity}`,
            description: `ℹ️ Профессиональный электрик в ${defaultCity}. Опыт более 10 лет, гарантия качества, доступные цены. Подробнее о компании.`,
            keywords: `о нас электрик ${defaultCity}, опыт электрика, гарантия электромонтажа`
        }
    };

    const selected = baseMetadata[page] || baseMetadata.home;

    // Асинхронно обновляем мета-теги с реальными данными из конфигурации
    configPromise.then(config => {
        if (config) {
            const city = config.addressCity || defaultCity;
            const phone = config.phoneDisplay || '+7 (727) 123-45-67';

            // Обновляем мета-теги в DOM
            const metaDescription = document.querySelector('meta[name="description"]');
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            const ogTitle = document.querySelector('meta[property="og:title"]');
            const ogDescription = document.querySelector('meta[property="og:description"]');

            const updatedTitle = selected.title.replace(new RegExp(defaultCity, 'g'), city);
            const updatedDescription = selected.description.replace(new RegExp(defaultCity, 'g'), city).replace(/\+7 \(727\) 123-45-67/g, phone);
            const updatedKeywords = selected.keywords.replace(new RegExp(defaultCity, 'g'), city);

            document.title = updatedTitle;
            if (metaDescription) metaDescription.setAttribute('content', updatedDescription);
            if (metaKeywords) metaKeywords.setAttribute('content', updatedKeywords);
            if (ogTitle) ogTitle.setAttribute('content', updatedTitle);
            if (ogDescription) ogDescription.setAttribute('content', updatedDescription);
        }
    });

    return selected;
};

// Обновленная функция для получения хлебных крошек
export const getBreadcrumbsList = () => {
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');

    return [
        {
            position: 1,
            name: 'Главная',
            url: siteUrl
        },
        {
            position: 2,
            name: `Электрик в ${city}`,
            url: `${siteUrl}/#services`
        },
        {
            position: 3,
            name: `Контакты электрика ${city}`,
            url: `${siteUrl}/#contact`
        }
    ];
};

// SEO тексты для разных секций (для улучшения ранжирования)
export const getLocalizedContent = (section, config = null) => {
    const city = config?.addressCity || getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const companyName = config?.companyName || getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер');

    const content = {
        heroSubtitle: `Профессиональные услуги электрика в ${city}. Быстрый выезд, качественный ремонт и монтаж электропроводки.`,
        servicesDescription: `Широкий спектр электромонтажных услуг в ${city} по доступным ценам. Работаем с гарантией.`,
        aboutText: `Компания ${companyName} предоставляет профессиональные услуги электрика в ${city} более 10 лет. Наши мастера имеют высокую квалификацию и опыт работы с любыми типами электропроводки.`,
        contactText: `Свяжитесь с нами любым удобным способом. Мы находимся в ${city} и готовы выехать к вам в любое удобное время.`
    };

    return content[section] || '';
};