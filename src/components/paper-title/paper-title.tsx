import { ActionIcon, Button, Group, Text, TextInput, ThemeIcon } from "@mantine/core";
import { type Icon, IconSearch, IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type PaperTitleProps = {
    icon: Icon;
    title: string;
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;
    btnIcon?: Icon;
    btnClick?: () => void;

};

export default function PaperTitle({ icon: Icon, title, showSearch, onSearchChange, btnIcon: BtnIcon, btnClick }: PaperTitleProps) {
    // Services
    const { t } = useTranslation();
    const [searchKeyValue, setSearchKeyValue] = useState<string>('');

    // Callbacks
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            if (onSearchChange) {
                onSearchChange(value);
            }
        }, 300),
        []
    );

    // Effects
    useEffect(() => {
        debouncedSearch(searchKeyValue);
    }, [searchKeyValue]);

    useEffect(() => {
        if (!showSearch) {
            setSearchKeyValue('');
        }
    }, [showSearch]);

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    // Handlers
    const handleClearBtn = () => {
        setSearchKeyValue('');
    };

    // Content
    return (
        <Group justify="space-between" align="center" mb={30}>
            <Group justify="left" align="flex-start">
                <ThemeIcon variant="filled" c={'white'} size={30}>
                    <Icon size={18} />
                </ThemeIcon>
                <Text size={'lg'}>{title}</Text>
            </Group>
            <Group justify="right" align="flex-end">
                {showSearch && <TextInput
                    id='searchField'
                    radius="xl"
                    value={searchKeyValue}
                    onChange={(event) => setSearchKeyValue(event.currentTarget.value)}
                    leftSection={<IconSearch size={18} />}
                    rightSection={searchKeyValue && <ActionIcon onClick={handleClearBtn} radius={'xl'}><IconX size={18} /></ActionIcon>}
                    placeholder={t('searchPlaceholderField')}
                    w={250}
                    ta={'right'}
                />}
                {BtnIcon && btnClick &&
                    <Button size="xs" p={5} mb={3} onClick={btnClick} >
                        <BtnIcon />
                    </Button>
                }
            </Group>
        </Group>
    );
}