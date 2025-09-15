import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './menu-item.module.css';

interface LinksGroupProps {
    icon: React.FC<any>;
    label: string;
    link?: string;
    items?: { label: string; link: string; }[];
}

export function LinksGroup({ icon: Icon, label, link, items }: LinksGroupProps) {
    // Services
    const navigate = useNavigate();
    const location = useLocation();
    const [opened, setOpened] = useState(false);

    // Data
    const hasItems = Array.isArray(items);
    const isSelected = location.pathname === link;

    // Effects
    useEffect(() => {
        // Check if one sub-item has been selected, so open the section menu to show it
        if (hasItems && items?.some((item) => location.pathname === item.link)) {
            setOpened(true);
        }
    }, [location.pathname, hasItems, items]);

    // Content

    // Sub-items Menu
    const subLinks = (hasItems ? items : []).map((item) => (
        <Text<'a'>
            component="a"
            className={`${classes.link} ${location.pathname === item.link ? classes.activeLink : ''}`}
            href={item.link}
            key={item.label}
            onClick={() => navigate(item.link)}
        >
            {item.label}
        </Text>
    ));


    // Menu items
    return (
        <>
            <UnstyledButton onClick={link != null ? () => navigate(link) : () => setOpened((o) => !o)} className={`${classes.control} ${isSelected ? classes.active : ''}`}>
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon variant="filled" c={'white'} size={30}>
                            <Icon size={18} />
                        </ThemeIcon>
                        <Box ml="md">{label}</Box>
                    </Box>
                    {hasItems && (
                        <IconChevronRight
                            className={classes.chevron}
                            stroke={1.5}
                            size={16}
                            style={{ transform: opened ? 'rotate(-90deg)' : 'none' }}
                        />
                    )}
                </Group>
            </UnstyledButton >
            {hasItems ? <Collapse in={opened}> {subLinks}</Collapse > : null}
        </>
    );
}