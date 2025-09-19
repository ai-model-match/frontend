import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { ComponentType, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './menu-item.module.css';

export interface ComponentTypeIcon {
    size?: number;
}

export interface MenuSubItem {
    label: string;
    link: string;
}

export interface MenuItem {
    icon: ComponentType<ComponentTypeIcon>;
    label: string;
    link?: string;
    subItems?: MenuSubItem[];
}

export interface MenuItemProps {
    icon: ComponentType<ComponentTypeIcon>;
    label: string;
    link?: string;
    subItems?: MenuSubItem[];
}

export default function MenuItemComponent({ icon: Icon, label, link, subItems }: MenuItemProps) {
    // Services
    const navigate = useNavigate();
    const location = useLocation();
    const [opened, setOpened] = useState(false);
    const [selected, setSelected] = useState(false);

    // Effects

    // Update if this item is selected, only if the link of the item or the pathname changes
    useEffect(() => {
        setSelected(link !== undefined && location.pathname.startsWith(link));
    }, [link, location.pathname]);

    // Check if this item has subItems and if one of them has been selected, open the section menu to show it
    useEffect(() => {
        if (subItems === undefined) return;
        const subItemSelected = subItems.some((item) => location.pathname.startsWith(item.link));
        if (subItemSelected) {
            setOpened(true);
        }
    }, [location.pathname, subItems]);

    // Content

    // Create Sub-items Menu for rendering if they exist
    const subMenuItems = (subItems !== undefined ? subItems : []).map((item) => (
        <Text<'a'>
            component="a"
            className={`${classes.link} ${location.pathname.startsWith(item.link) ? classes.activeLink : ''}`}
            href={item.link}
            key={item.label}
            onClick={() => navigate(item.link)}
        >
            {item.label}
        </Text>
    ));

    // Handle the click on the item:
    // If the item has a link, navigate to it
    // Otherwise use it for opening the menu in case it has
    const onClickHandler = () => {
        if (link !== undefined) return navigate(link);
        if (subItems !== undefined) return setOpened((status) => !status);
    };

    // Render item Menu and subItems if available
    return (
        <>
            <UnstyledButton
                // If the item has a link, on click navigate to it, otherwise use it for opening
                onClick={onClickHandler}
                className={`${classes.control} ${selected ? classes.active : ''}`}
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="filled" c={'white'} size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {subItems !== undefined && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            size={16}
                            style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {subItems !== undefined ? <Collapse in={opened}>{subMenuItems}</Collapse> : null}
        </>
    );
}
