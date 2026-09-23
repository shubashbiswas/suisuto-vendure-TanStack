import React from 'react';
import { defineDashboardExtension } from '@vendure/dashboard';
import { CampaignControlPage } from './campaign-control-page';

defineDashboardExtension({
    routes: [
        {
            path: '/campaigns',
            navMenuItem: {
                sectionId: 'marketing',
                id: 'campaigns',
                title: 'Campaigns',
                order: 150,
            },
            component: () => <CampaignControlPage />,
        },
    ],
});
