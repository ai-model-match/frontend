import { useAuth } from '@context/AuthContext';
import { Flow } from '@entities/flow';
import { Badge, Box, Center, Select, Tooltip } from '@mantine/core';
import { IconArrowRampRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface FlowSelectorComponentProps {
  selectedFlowId?: string;
  flows: Flow[];
  readonly?: boolean;
  creationMode?: boolean;
  onSelectionChange: (flow: Flow) => void;
}
export function FlowSelectorComponent({
  selectedFlowId,
  flows,
  readonly = false,
  creationMode,
  onSelectionChange,
}: FlowSelectorComponentProps) {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [selectedFlow, setSelectedFlow] = useState<Flow>();
  const [inEditingMode, setInEditingMode] = useState(false);

  useEffect(() => {
    if (!selectedFlowId) return;
    const foundFlow = flows.find((flow) => flow.id === selectedFlowId);
    setSelectedFlow(foundFlow);
  }, [selectedFlowId, flows]);

  useEffect(() => {
    setInEditingMode(!!creationMode);
  }, [creationMode]);

  return (
    <Box miw={240} maw={240}>
      <Center>
        {!inEditingMode && (
          <>
            {selectedFlowId && (
              <>
                {selectedFlow && (
                  <Tooltip
                    withArrow
                    fz={'xs'}
                    label={selectedFlow.active ? t('rsFlowActive') : t('rsFlowInactive')}
                  >
                    <Badge
                      fullWidth
                      size="md"
                      color={selectedFlow.active ? 'brand' : 'gray.5'}
                      leftSection={<IconArrowRampRight size={10} />}
                      style={{
                        cursor: auth.canWrite() && !readonly ? 'pointer' : 'default',
                      }}
                      onClick={() => {
                        if (auth.canWrite() && !readonly) setInEditingMode(true);
                      }}
                    >
                      {selectedFlow.title}
                    </Badge>
                  </Tooltip>
                )}
                {!selectedFlow && (
                  <Badge
                    fullWidth
                    color="gray.5"
                    style={{ textDecoration: 'line-through' }}
                  >
                    {t('rwWarmupFlowNotExist')}
                  </Badge>
                )}
              </>
            )}
          </>
        )}
        {auth.canWrite() && !readonly && inEditingMode && (
          <Select
            size={'xs'}
            w={'100%'}
            dropdownOpened={!creationMode ? true : undefined}
            defaultValue={selectedFlowId}
            clearable={false}
            unselectable="on"
            withCheckIcon={false}
            placeholder={t('rwWarmupFlowSelect')}
            nothingFoundMessage={t('rwWarmupFlowSelectNothingFound')}
            data={flows.map((flow) => ({
              value: flow.id,
              label: flow.title,
              disabled: flow.id === selectedFlowId,
            }))}
            onDropdownClose={() => (!creationMode ? setInEditingMode(false) : undefined)}
            onChange={(value) => {
              const selectedFlow = flows.find((flow) => flow.id === value);
              if (selectedFlow) {
                setSelectedFlow(selectedFlow);
                onSelectionChange(selectedFlow);
                setInEditingMode(false);
              }
            }}
          />
        )}
      </Center>
    </Box>
  );
}
