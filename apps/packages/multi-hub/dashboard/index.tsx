import React from 'react';
import { defineDashboardExtension } from '@vendure/dashboard';
import { HubControlPage } from './hub-control-page';

defineDashboardExtension({
    routes: [
        {
            path: '/multi-hub',
            navMenuItem: {
                sectionId: 'settings',
                id: 'multi-hub',
                title: 'Fulfillment Hubs',
                order: 170,
            },
            component: () => <HubControlPage />,
        },
    ],
});
