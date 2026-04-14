// client/src/utils/seoHelpers.js
// Утилиты для SEO-оптимизации

// Получение переменных окружения с fallback
const getEnv = (key, fallback = '') => process.env[key] || fallback;

export const generateBreadcrumbs = (items) => {
    return items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        item: item.url
    }));
};

export const generateOrganizationSchema = () => {
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    const phoneDisplay = getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    // const phoneRaw = getEnv('REACT_APP_PHONE_RAW', '+77271234567');
    const email = getEnv('REACT_APP_EMAIL', 'info@electromaster.kz');
    const companyName = getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы');
    const companyDesc = getEnv('REACT_APP_COMPANY_DESCRIPTION', 'Профессиональные услуги электрика в Алматы');
    const street = getEnv('REACT_APP_ADDRESS_STREET', 'ул. Абая, 123');
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const region = getEnv('REACT_APP_ADDRESS_REGION', 'Алматинская область');
    const postalCode = getEnv('REACT_APP_ADDRESS_POSTAL_CODE', '050000');
    const lat = parseFloat(getEnv('REACT_APP_GEO_LAT', '43.2220'));
    const lng = parseFloat(getEnv('REACT_APP_GEO_LNG', '76.8512'));
    const ratingValue = getEnv('REACT_APP_RATING_VALUE', '4.9');
    const reviewCount = getEnv('REACT_APP_REVIEW_COUNT', '47');

    return {
        '@context': 'https://schema.org',
        '@type': 'ElectricalContractor',
        name: companyName,
        alternateName: getEnv('REACT_APP_COMPANY_ALTERNATE_NAME', 'Услуги электрика в Алматы'),
        description: companyDesc,
        telephone: phoneDisplay,
        email: email,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        foundingDate: '2015',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            value: '5'
        },
        openingHours: [
            `Mo-Fr ${getEnv('REACT_APP_WEEKDAY_HOURS', '08:00-20:00')}`,
            `Sa-Su ${getEnv('REACT_APP_WEEKEND_HOURS', '09:00-18:00')}`
        ],
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: getEnv('REACT_APP_WEEKDAY_HOURS', '08:00-20:00').split('-')[0],
                closes: getEnv('REACT_APP_WEEKDAY_HOURS', '08:00-20:00').split('-')[1]
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: getEnv('REACT_APP_WEEKEND_HOURS', '09:00-18:00').split('-')[0],
                closes: getEnv('REACT_APP_WEEKEND_HOURS', '09:00-18:00').split('-')[1]
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
            `https://instagram.com/${getEnv('REACT_APP_INSTAGRAM_USERNAME', 'electromaster_almaty')}`,
            `https://t.me/${getEnv('REACT_APP_TELEGRAM_USERNAME', 'electromaster_almaty')}`,
            `https://wa.me/${getEnv('REACT_APP_PHONE_FOR_WHATSAPP', '77071234567')}`
        ],
        hasMap: getEnv('REACT_APP_MAP_DIRECT_URL', 'https://goo.gl/maps/placeholder'),
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: ratingValue,
            reviewCount: reviewCount
        }
    };
};

export const generateLocalBusinessSchema = () => {
    const city = getEnv('REACT_APP_ADDRESS_CITY', 'Алматы');
    const phoneDisplay = getEnv('REACT_APP_PHONE_DISPLAY', '+7 (727) 123-45-67');
    const lat = parseFloat(getEnv('REACT_APP_GEO_LAT', '43.2220'));
    const lng = parseFloat(getEnv('REACT_APP_GEO_LNG', '76.8512'));

    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: getEnv('REACT_APP_COMPANY_NAME', 'ЭлектроМастер Алматы'),
        description: getEnv('REACT_APP_COMPANY_DESCRIPTION', 'Электромонтажные работы в Алматы и области. Выезд электрика на дом круглосуточно.'),
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
        telephone: phoneDisplay
    };
};

// Хлебные крошки
export const getBreadcrumbsList = () => {
    const siteUrl = getEnv('REACT_APP_SITE_URL', 'https://electromaster.kz');
    return [
        {
            position: 1,
            name: 'Главная',
            url: siteUrl
        },
        {
            position: 2,
            name: `Услуги электрика в ${getEnv('REACT_APP_ADDRESS_CITY', 'Алматы')}`,
            url: `${siteUrl}#services`
        },
        {
            position: 3,
            name: `Контакты электрика ${getEnv('REACT_APP_ADDRESS_CITY', 'Алматы')}`,
            url: `${siteUrl}#contact`
        }
    ];
};