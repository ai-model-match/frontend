import { Menu, Text } from '@mantine/core';
import { Language } from './LanguageSelector.type';

export interface LanguageSelectorItemProps {
  language: Language;
  onSelectedLanguage: (code: string) => void;
}

export function LanguageSelectorItem({
  language,
  onSelectedLanguage,
}: LanguageSelectorItemProps) {
  return (
    <Menu.Item
      key={language.code}
      onClick={() => onSelectedLanguage(language.code)}
      leftSection={<Text size="lg">{language.flag}</Text>}
    >
      {language.label}
    </Menu.Item>
  );
}
