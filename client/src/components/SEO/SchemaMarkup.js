// client/src/components/SEO/SchemaMarkup.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateOrganizationSchema, generateLocalBusinessSchema, getBreadcrumbsList, generateBreadcrumbs } from '../../utils/seoHelpers';

const SchemaMarkup = () => {
    const organizationSchema = generateOrganizationSchema();
    const localBusinessSchema = generateLocalBusinessSchema();
    const breadcrumbItems = getBreadcrumbsList();

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: generateBreadcrumbs(breadcrumbItems)
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(organizationSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(localBusinessSchema)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbSchema)}
            </script>
        </Helmet>
    );
};

export default SchemaMarkup;