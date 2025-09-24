import { LanguageSelector } from '@components/LanguageSelector';
import { Box, Group } from '@mantine/core';
import { IconBrandGithub, IconBrandOpenSource } from '@tabler/icons-react';
import classes from './Header.module.css';
import { HeaderExternalLink } from './HeaderExternalLink';
import { HaderLogo } from './HeaderLogo';

export function Header() {
  return (
    <Box miw={1200}>
      <header className={classes.root}>
        <Group justify="space-between" h="100%" gap={10}>
          <HaderLogo />
          <Group h="100%" flex={1} gap={0} />
          <Group gap={10}>
            <HeaderExternalLink
              link="https://github.com/ai-model-match"
              icon={IconBrandGithub}
            />
            <HeaderExternalLink
              link="https://en.wikipedia.org/wiki/Open_source"
              icon={IconBrandOpenSource}
            />
            <LanguageSelector />
          </Group>
        </Group>
      </header>
    </Box>
  );
}
