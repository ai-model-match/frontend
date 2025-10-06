import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { Flow } from '@entities/flow';
import { RolloutStrategyState, RsWarmup } from '@entities/rolloutStrategy';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Fieldset,
  Group,
  NumberInput,
  SegmentedControl,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import { assets } from '@styles/assets';
import {
  IconArrowNarrowRightDashed,
  IconHexagonNumber1Filled,
  IconInfoCircle,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FlowSelectorComponent } from './FlowSelectorComponent';
import { NumberSelectorComponent } from './NumberSelectorComponent';

export interface WarmupComponentProps {
  rsStatus: RolloutStrategyState;
  rsWarmup: RsWarmup | null;
  flows: Flow[];
  onChange: (newWarmup: RsWarmup | null) => void;
  onError?: (hasError: boolean) => void;
}

export function WarmupComponent({
  rsStatus,
  rsWarmup,
  flows,
  onChange,
  onError,
}: WarmupComponentProps) {
  // Services
  const { t } = useTranslation();
  const auth = useAuth();

  // Handlers
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      const newWarmup: RsWarmup = { goals: [], intervalMins: 60, intervalSessReqs: null };
      onChange(newWarmup);
      checkWarmupError(newWarmup);
    } else {
      onChange(null);
      checkWarmupError(null);
    }
  };
  const onSelectionChange = (flow: Flow, index: number) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    newWarmup.goals[index].flowId = flow.id;
    onChange(newWarmup);
  };

  const onChangePercentage = (percentage: number, index: number) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    newWarmup.goals[index].finalServePct = percentage;
    onChange(newWarmup);
    checkWarmupError(newWarmup);
  };

  const onDeleteFlow = (index: number) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    newWarmup.goals.splice(index, 1);
    onChange(newWarmup);
    checkWarmupError(newWarmup);
  };

  const onNewFlowSelected = (flow: Flow) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    newWarmup.goals.push({ flowId: flow.id, finalServePct: 0 });
    onChange(newWarmup);
    checkWarmupError(newWarmup);
  };

  const onWarmupTypeChange = (value: string) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    if (value === 'time-based') {
      newWarmup.intervalMins = 60;
      newWarmup.intervalSessReqs = null;
    } else {
      newWarmup.intervalMins = null;
      newWarmup.intervalSessReqs = 100;
    }
    onChange(newWarmup);
  };

  const checkWarmupError = (warmup: RsWarmup | null) => {
    if (onError) {
      if (warmup === null) {
        onError(false);
        return;
      }
      onError(warmup.goals.reduce((acc, goal) => acc + goal.finalServePct, 0) !== 100);
    }
  };

  const onWarmupIntervalChange = (value: number) => {
    if (!rsWarmup) return;
    const newWarmup = { ...rsWarmup };
    if (newWarmup.intervalMins !== null) {
      newWarmup.intervalMins = value;
    } else {
      newWarmup.intervalSessReqs = value;
    }
    onChange(newWarmup);
  };

  // Content
  const getAvailableFlows = (flowId?: string) => {
    if (!rsWarmup) return [];
    const usedFlowIds = rsWarmup.goals.map((goal) => goal.flowId);
    return flows.filter((flow) => !usedFlowIds.includes(flow.id) || flow.id === flowId);
  };
  const getAssociatedFlow = (flowId: string) => {
    return flows.find((flow) => flow.id === flowId);
  };
  const getAssociatedFlowPct = (flowId: string) => {
    return flows.find((flow) => flow.id === flowId)?.currentServePct || 0;
  };
  const isAssociatedFlowActive = (flowId: string) => {
    const flow = getAssociatedFlow(flowId);
    return flow ? flow.active : false;
  };
  const getActiveFlowTotalPct = () => {
    if (!rsWarmup) return 0;
    return rsWarmup.goals
      .filter((goal) => isAssociatedFlowActive(goal.flowId))
      .reduce((acc, goal) => acc + goal.finalServePct, 0);
  };
  const canEdit = () => {
    return rsStatus === RolloutStrategyState.INIT && auth.canWrite();
  };
  const showError = () => {
    return rsWarmup && getActiveFlowTotalPct() !== 100;
  };
  const Image = assets[`../assets/rs-warmup.svg`];
  return (
    <>
      <Group justify="space-between" align="baseline" gap={0} mb={0}>
        <Group align="top" gap={0} mb={0}>
          <PaperTitle
            mb={15}
            icon={IconHexagonNumber1Filled}
            title={t('rsWarmupTitle')}
            iconColor={rsWarmup !== null ? 'brand' : 'gray.5'}
          />
          <Tooltip
            maw={350}
            withArrow
            multiline
            position="top"
            label={t('rsWarmupDescription')}
          >
            <IconInfoCircle color="gray" size={24} />
          </Tooltip>
        </Group>
        <Switch
          checked={rsWarmup !== null}
          onChange={(event) => onSwitchChange(event)}
          disabled={!canEdit()}
        />
      </Group>
      <Fieldset
        bd={showError() ? '1px solid red' : undefined}
        legend={showError() ? t('rsWarmupFlowError') : undefined}
        styles={{ legend: { color: showError() ? 'red' : undefined } }}
      >
        {rsWarmup !== null && (
          <>
            <Text size="xs" mb={5}>
              {t('rsWarmupBasedOn')}
            </Text>
            <Group justify="space-between">
              <SegmentedControl
                miw={240}
                readOnly={!canEdit()}
                value={rsWarmup.intervalMins ? 'time-based' : 'traffic-based'}
                data={[
                  { value: 'time-based', label: t('rsWarmupTime') },
                  { value: 'traffic-based', label: t('rsWarmupTraffic') },
                ]}
                onChange={(value) => onWarmupTypeChange(value)}
              />
              <NumberInput
                readOnly={!canEdit()}
                value={
                  rsWarmup.intervalMins !== null
                    ? (rsWarmup.intervalMins ?? 0)
                    : (rsWarmup.intervalSessReqs ?? 0)
                }
                min={1}
                max={999999}
                allowDecimal={false}
                suffix={
                  rsWarmup.intervalMins !== null
                    ? ' ' + t('rsWarmupTimeMin', { count: rsWarmup.intervalMins ?? 0 })
                    : ' ' +
                      t('rsWarmupTrafficRequest', {
                        count: rsWarmup.intervalSessReqs ?? 0,
                      })
                }
                onChange={(value) => onWarmupIntervalChange(parseInt(value.toString()))}
              />
            </Group>
            <Divider my={20} />
            {rsWarmup.goals.map((goal, index) => (
              <Group justify="space-between" key={index}>
                <FlowSelectorComponent
                  flows={getAvailableFlows(goal.flowId)}
                  readonly={!canEdit()}
                  selectedFlowId={goal.flowId}
                  onSelectionChange={(flow) => onSelectionChange(flow, index)}
                />
                <Group justify="flex-end" key={index} gap={5}>
                  <NumberSelectorComponent
                    suffix="%"
                    minValue={0}
                    maxValue={100}
                    readonly
                    tooltip={t('rsWarmupFlowCurrentTraffic')}
                    selectedNumber={getAssociatedFlowPct(goal.flowId)}
                    color={!isAssociatedFlowActive(goal.flowId) ? 'gray.5' : undefined}
                  />
                  <Box>
                    <Center>
                      <IconArrowNarrowRightDashed />
                    </Center>
                  </Box>
                  <NumberSelectorComponent
                    suffix="%"
                    minValue={0}
                    maxValue={100}
                    tooltip={t('rsWarmupFlowTargetTraffic')}
                    color={isAssociatedFlowActive(goal.flowId) ? 'orange' : 'gray.5'}
                    readonly={!isAssociatedFlowActive(goal.flowId) || !canEdit()}
                    onChangeNumber={(value) => onChangePercentage(value, index)}
                    selectedNumber={
                      isAssociatedFlowActive(goal.flowId) ? goal.finalServePct : 0
                    }
                  />
                  {canEdit() && (
                    <Tooltip withArrow label={t('useCaseDeleteAction')}>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => onDeleteFlow(index)}
                      >
                        <IconTrash size={22} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>
              </Group>
            ))}
            {rsWarmup.goals.length == 0 && (
              <Stack align="center" p={20} pb={0} gap={'md'}>
                <Image height={90} />
                <Text ta={'center'}>{t('rsWarmupStart')}</Text>
              </Stack>
            )}
            <Divider my={20} />
            <FlowSelectorComponent
              readonly={!canEdit()}
              key={Math.random()}
              flows={getAvailableFlows()}
              creationMode={true}
              selectedFlowId={''}
              onSelectionChange={(flow) => onNewFlowSelected(flow)}
            />
          </>
        )}
        {rsWarmup === null && (
          <Stack align="center" p={20} gap={'md'}>
            <Image height={90} />
            <Text ta={'center'}>{t('rsWarmupDescription')}</Text>
          </Stack>
        )}
      </Fieldset>
    </>
  );
}
