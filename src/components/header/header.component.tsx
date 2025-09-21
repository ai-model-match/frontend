import { ActionIcon, Box, Group, Image, Title } from '@mantine/core';
import { IconBrandGithub, IconBrandOpenSource } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '../language/language-selector.component';
import classes from './header.module.css';

export default function Header() {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Content
  return (
    <Box miw={950}>
      <header className={classes.root}>
        <Group justify="space-between" h="100%" gap={10}>
          <Group gap={0} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Image src="/icon.svg" alt="Logo Icon" className={classes.logo} />
          </Group>
          <Group gap={0} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Title ta="left" order={4} mb={0}>
              {t('appName')}
            </Title>
          </Group>
          <Group h="100%" flex={1} gap={0}></Group>
          <Group gap={10}>
            <ActionIcon
              component="a"
              target="_blank"
              href="https://github.com/ai-model-match"
              size="md"
              variant="light"
            >
              <IconBrandGithub size={24} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              component="a"
              target="_blank"
              href="https://en.wikipedia.org/wiki/Open_source"
              size="md"
              variant="light"
            >
              <IconBrandOpenSource size={24} stroke={1.5} />
            </ActionIcon>
            <LanguageSelector />
          </Group>
        </Group>
      </header>
    </Box>
  );
}
