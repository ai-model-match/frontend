import { Box, Button, Menu, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './language-selector.module.css';

const availableLanguages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
];

type LanguageSelectorProps = {
    absolute?: boolean;
};

export default function LanguageSelector({ absolute }: LanguageSelectorProps) {
    // Services
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(availableLanguages[0]);

    // Effects
    useEffect(() => {
        if (!i18n.isInitialized) return;
        const selectedLanguage =
            availableLanguages.find((l) => l.code === i18n.language) ?? availableLanguages[0];
        setLanguage(selectedLanguage);
    }, [i18n.isInitialized, i18n.language]);

    // Handlers
    const handleSelect = (code: string) => {
        setLanguage(availableLanguages.find((l) => l.code === code) ?? availableLanguages[0]);
        i18n.changeLanguage(code);
    };

    // Content

    // Create menu items for each available language
    const availableLanguagesMenuItems = availableLanguages.map((lang) => (
        <Menu.Item
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            leftSection={<Text size="lg">{lang.flag}</Text>}
        >
            {lang.label}
        </Menu.Item>
    ));

    // Render the language selector with its available languages
    return (
        <Box className={absolute ? classes.boxAbsolute : ''}>
            <Menu shadow="lg" position="bottom-end" width={130} offset={5}>
                <Menu.Target>
                    <Button variant="default">
                        <Text size="xl">{language.flag}</Text>
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>{availableLanguagesMenuItems}</Menu.Dropdown>
            </Menu>
        </Box>
    );
}
