import { Button, Center, Stack } from '@mantine/core';
import { IconCircleDashedPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface FlowNewCardComponentProps {
  onClick: () => void;
}
export function FlowNewCardComponent({ onClick }: FlowNewCardComponentProps) {
  // Services
  const { t } = useTranslation();

  // Content
  return (
    <Button
      bd={'1px dashed var(--mantine-color-gray-6)'}
      component="button"
      color="var(--aimm-segmented-control-bg)"
      c={'brand'}
      h={300}
      w={'100%'}
      style={{ cursor: 'pointer' }}
      onClick={onClick}
    >
      <Center h={'100%'}>
        <Stack align="center" justify="center">
          <IconCircleDashedPlus size={60} stroke={1} />
          {t('flowNewCardBtn')}
        </Stack>
      </Center>
    </Button>
  );
}
