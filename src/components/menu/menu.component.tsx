import { Paper, ScrollArea } from '@mantine/core';
import { IconAdjustments, IconArrowFork, IconDoorExit, IconGauge } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItemComponent, { MenuItem } from './menu-item.component';
import classes from './menu.module.css';

export function MenuComponent() {
    // Data
    const { t, i18n } = useTranslation();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [footerMenuItems, setFooterMenuItems] = useState<MenuItem[]>([]);

    useEffect(() => {
        setMenuItems([
            { label: t('menuDashboard'), icon: IconGauge, link: '/dashboard' },
            {
                label: t('menuUseCases'),
                icon: IconArrowFork,
                link: '/use-cases',
            },
            {
                label: 'TDB',
                icon: IconAdjustments,
                subItems: [{ label: 'Tbd 1', link: '/not-found' }],
            },
        ]);
        setFooterMenuItems([{ label: t('menuLogout'), icon: IconDoorExit, link: '/logout' }]);
    }, [t, i18n.language]);

    // Content
    const menuComponents = menuItems.map((item) => (
        <MenuItemComponent {...item} key={item.label} />
    ));
    const footerMenuComponents = footerMenuItems.map((item) => (
        <MenuItemComponent {...item} key={item.label} />
    ));

    return (
        <Paper className={classes.menuBox} bg={''} p={'xs'}>
            <nav className={classes.navbar}>
                <ScrollArea className={classes.links}>
                    <div>{menuComponents}</div>
                </ScrollArea>
                <div className={classes.footer}>{footerMenuComponents}</div>
            </nav>
        </Paper>
    );
}
