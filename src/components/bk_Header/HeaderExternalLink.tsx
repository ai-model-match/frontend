import { Icon } from '@components/Icon/Icon';
import { ActionIcon } from '@mantine/core';

export interface HeaderExternalLinkProps {
  link: string;
  icon: Icon;
}
export function HeaderExternalLink({ link, icon: Icon }: HeaderExternalLinkProps) {
  return (
    <ActionIcon component="a" target="_blank" href={link} size="md" variant="light">
      <Icon />
    </ActionIcon>
  );
}
