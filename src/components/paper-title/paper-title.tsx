import { ActionIcon, Group, Text, TextInput, ThemeIcon } from "@mantine/core";
import { type Icon, IconSearch, IconX } from "@tabler/icons-react";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type PaperTitleProps = {
    icon: Icon;
    title: string;
    showSearch?: boolean;
    onSearchChange?: (value: string) => void;

};

export default function PaperTitle({ icon: Icon, title, showSearch, onSearchChange }: PaperTitleProps) {
    // Services
    const { t } = useTranslation();
    const [searchKeyValue, setSearchKeyValue] = useState<string>('');

    // Callbacks
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearchKeyValue(value);
        }, 300),
        []
    );

    // Effects
    useEffect(() => {
        if (onSearchChange) {
            onSearchChange(searchKeyValue);
        }
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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.currentTarget.value);
    };

    const handleClearBtn = () => {
        setSearchKeyValue('');
    };

    // Content
    return (
        <Group justify="space-between" align="center" mb={30}>
            <Group justify="space-between" align="flex-start">
                <ThemeIcon variant="filled" c={'white'} size={30}>
                    <Icon size={18} />
                </ThemeIcon>
                <Text size={'lg'}>{title}</Text>
            </Group>
            {showSearch && <TextInput
                radius="xl"
                onChange={handleSearchChange}
                leftSection={<IconSearch size={18} />}
                rightSection={searchKeyValue && <ActionIcon onClick={handleClearBtn} radius={'xl'}><IconX size={18} /></ActionIcon>}
                placeholder={t('searchPlaceholderField')}
                w={250}
                ta={'right'}
            />}
        </Group>
    );
}