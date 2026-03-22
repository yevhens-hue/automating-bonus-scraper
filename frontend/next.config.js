const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['1win.com', '1xbet.com', 'parimatch.in', 'betway.in', 'melbet.in', '10cric.com', 'dafabet.com'],
    },
};

module.exports = withNextIntl(nextConfig);
