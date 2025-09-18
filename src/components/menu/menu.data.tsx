import { IconAdjustments, IconArrowFork, IconDoorExit, IconGauge } from '@tabler/icons-react';
import { TFunction } from 'i18next';

export const getMenuData = (t: TFunction) => {
    return [
        { label: t('menuDashboard'), icon: IconGauge, link: '/dashboard' },
        {
            label: t('menuUseCases'),
            icon: IconArrowFork,
            link: '/use-cases',
        },
        {
            label: 'TDB',
            icon: IconAdjustments,
            items: [{ label: 'Tbd 1', link: '/not-found' }],
        },
    ];
};

export const getFooterMenuData = (t: TFunction) => {
    return [{ label: t('menuLogout'), icon: IconDoorExit, link: '/logout' }];
};
