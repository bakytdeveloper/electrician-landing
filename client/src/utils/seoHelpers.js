// client/src/utils/seoHelpers.js
// Утилиты для SEO-оптимизации
export const generateBreadcrumbs = (items) => {
    return items.map(item => ({
        '@type': 'ListItem',
        position: item.position,
        name: item.name,
        item: item.url
    }));
};

export const generateOrganizationSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'ElectricalContractor', // Более точный тип для электрика
        name: 'ЭлектроМастер Алматы',
        alternateName: 'Услуги электрика в Алматы',
        description: 'Профессиональные услуги электрика в Алматы: монтаж, ремонт электропроводки, установка электрооборудования, замеры, консультации. Выезд по всему городу.',
        telephone: '+7 (702) 123-45-67',
        email: 'info@electromaster.kz',
        url: 'https://electromaster.kz',
        logo: 'https://electromaster.kz/logo.png',
        foundingDate: '2015',
        numberOfEmployees: {
            '@type': 'QuantitativeValue',
            value: '5'
        },
        openingHours: [
            'Mo-Fr 08:00-20:00',
            'Sa-Su 09:00-18:00'
        ],
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '20:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Saturday', 'Sunday'],
                opens: '09:00',
                closes: '18:00'
            }
        ],
        priceRange: '₸15000 - ₸150000',
        paymentAccepted: 'Наличные, Банковская карта, Kaspi.kz',
        areaServed: {
            '@type': 'City',
            name: 'Алматы',
            containedInPlace: {
                '@type': 'State',
                name: 'Алматинская область'
            }
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'ул. Абая, 123',
            addressLocality: 'Алматы',
            addressRegion: 'Алматинская область',
            postalCode: '050000',
            addressCountry: 'KZ'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.2220,
            longitude: 76.8512
        },
        sameAs: [
            'https://instagram.com/electromaster_almaty',
            'https://t.me/electromaster_almaty',
            'https://wa.me/77071234567'
        ],
        hasMap: 'https://goo.gl/maps/ваша-метка-на-карте',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '47'
        }
    };
};

// Локальная схема для города Алматы
export const generateLocalBusinessSchema = () => {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'ЭлектроМастер Алматы',
        description: 'Электромонтажные работы в Алматы и области. Выезд электрика на дом круглосуточно.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Алматы',
            addressCountry: 'KZ'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 43.2220,
            longitude: 76.8512
        },
        priceRange: '₸₸',
        telephone: '+7 (702) 123-45-67'
    };
};

// Хлебные крошки для лендинга (хотя у тебя одна страница, но для полноты)
export const getBreadcrumbsList = () => {
    return [
        {
            position: 1,
            name: 'Главная',
            url: 'https://electromaster.kz/'
        },
        {
            position: 2,
            name: 'Услуги электрика в Алматы',
            url: 'https://electromaster.kz/#services'
        },
        {
            position: 3,
            name: 'Контакты электрика Алматы',
            url: 'https://electromaster.kz/#contact'
        }
    ];
};