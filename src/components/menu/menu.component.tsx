import { Paper, ScrollArea } from '@mantine/core';
import { LinksGroup } from './menu-item.component';
import { getFooterMenuData, getMenuData } from './menu.data';
import classes from './menu.module.css';

export function MenuComponent() {
    // Data
    const items = getMenuData().map((item) => <LinksGroup {...item} key={item.label} />);
    const footerItems = getFooterMenuData().map((item) => <LinksGroup {...item} key={item.label} />);

    // Content
    return (
        <Paper className={classes.menuBox} bg={''} p={'xs'}>
            <nav className={classes.navbar}>
                <ScrollArea className={classes.links}>
                    <div>{items}</div>
                </ScrollArea>
                <div className={classes.footer}>{footerItems}</div>
            </nav>
        </Paper >
    );
};
