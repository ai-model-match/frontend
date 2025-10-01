import { Flow } from '@entities/flow';
import { Button, Group, Select, Text, ThemeIcon } from '@mantine/core';
import { IconSelect } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface CompletedFlowSelectorComponentProps {
  flows: Flow[];
  onCancel: () => void;
  onForcedCompletedFlowSelected: (flowId: string) => void;
}
export function CompletedFlowSelectorComponent({
  flows,
  onCancel,
  onForcedCompletedFlowSelected,
}: CompletedFlowSelectorComponentProps) {
  const { t } = useTranslation();
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(null);
  return (
    <div>
      <Group>
        <ThemeIcon variant="filled" size={34}>
          <IconSelect />
        </ThemeIcon>
        <Text size={'xl'}>{'SELECT THE WINNER'}</Text>
      </Group>
      <Text mt={20}>
        {'Select the flow to indicate as the winner of this rollout strategy'}
      </Text>
      <Select
        mt={10}
        placeholder={'Select the winning Flow'}
        clearable={false}
        withCheckIcon={false}
        data={flows.map((flow) => ({
          value: flow.id,
          label: flow.title,
          disabled: !flow.active,
        }))}
        onChange={(value) => setSelectedFlowId(value)}
      />
      <Group mt="lg" justify="flex-end">
        <Button onClick={onCancel} variant="outline">
          {t('btnCancel')}
        </Button>
        <Button
          disabled={selectedFlowId === null}
          onClick={() => onForcedCompletedFlowSelected(selectedFlowId!)}
        >
          {t('btnConfirm')}
        </Button>
      </Group>
    </div>
  );
}
