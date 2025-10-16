import { Flow } from '@entities/flow';
import { Button, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconLaurelWreath1 } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface WinnerFlowComponentProps {
  onClose: () => void;
  winnerFlow: Flow;
}
export function WinnerFlowComponent({ onClose, winnerFlow }: WinnerFlowComponentProps) {
  const { t } = useTranslation();
  return (
    <div>
      <Stack justify="center" align="center" gap={0}>
        <ThemeIcon variant="filled" size={120} radius={150}>
          <IconLaurelWreath1 color="gold" size={100} />
        </ThemeIcon>
        <Text mt={20} ta={'center'} fw={700} fz={24}>
          {winnerFlow.title}
        </Text>
        <Text mt={10} ta={'center'} size="sm">
          {t('rsWinnerFlowMessage')}
        </Text>
      </Stack>
      <Group justify="flex-end" mt={'xl'}>
        <Button onClick={onClose}>{t('btnClose')}</Button>
      </Group>
    </div>
  );
}
