import React from 'react';
import { defineDashboardExtension } from '@vendure/dashboard';
import { GeoIpControlPage } from './geoip-control-page';

defineDashboardExtension({
    routes: [
        {
            path: '/geoip-status',
            navMenuItem: {
                sectionId: 'settings',
                id: 'geoip-status',
                title: 'GeoIP & Routing',
                order: 165,
            },
            component: () => <GeoIpControlPage />,
        },
    ],
});
