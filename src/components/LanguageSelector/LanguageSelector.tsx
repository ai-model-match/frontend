import { Box, Button, Menu, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailableLanguages } from './LanguageSelector.data';
import classes from './LanguageSelector.module.css';
import { LanguageSelectorItem } from './LanguageSelectorItem';

export interface LanguageSelectorProps {
  absolutePosition?: boolean;
}

export function LanguageSelector({ absolutePosition }: LanguageSelectorProps) {
  // Services
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(AvailableLanguages[0]);

  // Effects
  useEffect(() => {
    if (!i18n.isInitialized) return;
    const selectedLanguage = findSelectedLanguage(i18n.language);
    setLanguage(selectedLanguage);
  }, [i18n.isInitialized, i18n.language]);

  // Utils
  const findSelectedLanguage = (code: string) => {
    return AvailableLanguages.find((l) => l.code === code) ?? AvailableLanguages[0];
  };

  // Handlers
  const onSelectedLanguage = (code: string) => {
    setLanguage(AvailableLanguages.find((l) => l.code === code) ?? AvailableLanguages[0]);
    i18n.changeLanguage(code);
  };

  // Content
  return (
    <Box className={absolutePosition ? classes.boxAbsolute : ''}>
      <Menu shadow="lg" position="bottom-end" width={130} offset={5}>
        <Menu.Target>
          <Button variant="default">
            <Text size="xl">{language.flag}</Text>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {AvailableLanguages.map((lang) => (
            <LanguageSelectorItem
              key={lang.code}
              language={lang}
              onSelectedLanguage={onSelectedLanguage}
            />
          ))}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
