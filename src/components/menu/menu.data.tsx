import { IconAdjustments, IconArrowFork, IconDoorExit, IconGauge } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const getMenuData = () => {
    // Services
    const { t } = useTranslation();

    return [
        { label: t('menuDashboard'), icon: IconGauge, link: '/dashboard' },
        {
            label: t('menuUseCases'),
            icon: IconArrowFork,
            link: '/use-cases'
        },
        {
            label: 'TDB', icon: IconAdjustments, items: [
                { label: 'Tbd 1', link: '/ss' },
                { label: 'Tbd 2', link: '/' },
                { label: 'Tbd 3', link: '/' },
            ],
        }
    ];
};

export const getFooterMenuData = () => {
    // Services
    const { t } = useTranslation();

    return [
        { label: t('menuLogout'), icon: IconDoorExit, link: '/logout' },
    ];
};