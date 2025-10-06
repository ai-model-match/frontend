import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { Flow } from '@entities/flow';
import { RolloutStrategyState, RsEscape } from '@entities/rolloutStrategy';
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  Fieldset,
  Group,
  Stack,
  Switch,
  Text,
  Tooltip,
} from '@mantine/core';
import { assets } from '@styles/assets';
import {
  IconArrowNarrowRightDashed,
  IconCornerDownRight,
  IconInfoCircle,
  IconLogout2,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FlowSelectorComponent } from './FlowSelectorComponent';
import { NumberSelectorComponent } from './NumberSelectorComponent';

export interface EscapeComponentProps {
  rsStatus: RolloutStrategyState;
  rsEscape: RsEscape | null;
  flows: Flow[];
  onChange: (rsEscape: RsEscape | null) => void;
  onError?: (hasError: boolean) => void;
}

export function EscapeComponent({
  rsStatus,
  rsEscape,
  flows,
  onChange,
  onError,
}: EscapeComponentProps) {
  // Services
  const { t } = useTranslation();
  const auth = useAuth();

  // Handlers
  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      const newEscape: RsEscape = { rules: [] };
      onChange(newEscape);
      checkEscapeError(newEscape);
    } else {
      onChange(null);
      checkEscapeError(null);
    }
  };

  const onNewFlowSelected = (flow: Flow) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    newEscape.rules.push({
      flowId: flow.id,
      minFeedback: 1,
      lowerScore: 1,
      rollback: [],
    });
    onChange(newEscape);
    checkEscapeError(newEscape);
  };

  const onSelectionChange = (flow: Flow, index: number) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    newEscape.rules[index].flowId = flow.id;
    onChange(newEscape);
  };

  const onDeleteFlow = (index: number) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    newEscape.rules.splice(index, 1);
    onChange(newEscape);
    checkEscapeError(newEscape);
  };

  const onChangeMinFeedback = (minFeedback: number, index: number) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    newEscape.rules[index].minFeedback = minFeedback;
    onChange(newEscape);
    checkEscapeError(newEscape);
  };

  const onChangeLowerScore = (lowerScore: number, index: number) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    if (!lowerScore) lowerScore = 1;
    newEscape.rules[index].lowerScore = lowerScore;
    onChange(newEscape);
    checkEscapeError(newEscape);
  };

  const onChangePercentageRollback = (
    percentage: number,
    index: number,
    flowId: string
  ) => {
    if (!rsEscape) return;
    const newEscape = { ...rsEscape };
    if (!newEscape.rules[index].rollback) newEscape.rules[index].rollback = [];
    const existingRollback = newEscape.rules[index].rollback.find(
      (rb) => rb.flowId === flowId
    );
    if (existingRollback) {
      existingRollback.finalServePct = percentage;
    } else {
      newEscape.rules[index].rollback.push({ flowId, finalServePct: percentage });
    }
    onChange(newEscape);
    checkEscapeError(newEscape);
  };

  const checkEscapeError = (escape: RsEscape | null) => {
    if (onError) {
      if (escape === null) {
        onError(false);
        return;
      }
      if (escape.rules.length === 0) {
        onError(true);
        return;
      }
      let hasError = false;
      escape.rules.forEach((rule) => {
        if (rule.rollback.reduce((acc, rb) => acc + rb.finalServePct, 0) !== 100) {
          hasError = true;
        }
      });
      onError(hasError);
    }
  };

  // Content
  const getAvailableFlows = (flowId?: string) => {
    if (!rsEscape) return [];
    const usedFlowIds = rsEscape.rules.map((rule) => rule.flowId);
    return flows.filter((flow) => !usedFlowIds.includes(flow.id) || flow.id === flowId);
  };

  const canEdit = () => {
    return rsStatus === RolloutStrategyState.INIT && auth.canWrite();
  };

  const getFinalServePct = (index: number, flowId: string) => {
    if (!rsEscape) return 0;
    const rule = rsEscape.rules[index];
    if (!rule.rollback) return 0;
    const rollback = rule.rollback.find((rb) => rb.flowId === flowId);
    return rollback ? rollback.finalServePct : 0;
  };

  const showError = () => {
    if (rsEscape) {
      if (rsEscape.rules.length === 0) {
        return true;
      }
      return rsEscape.rules.some((rule) => {
        if (rule.rollback.reduce((acc, rb) => acc + rb.finalServePct, 0) !== 100) {
          return true;
        }
      });
    }
    return false;
  };
  const Image = assets[`../assets/rs-escape.svg`];
  return (
    <>
      <Group justify="space-between" align="baseline" gap={0} mb={0}>
        <Group align="top" gap={0} mb={0}>
          <PaperTitle
            mb={15}
            icon={IconLogout2}
            title={t('rsEscapeTitle')}
            iconColor={rsEscape !== null ? 'red' : 'gray.5'}
          />
          <Tooltip
            maw={350}
            withArrow
            multiline
            position="top"
            label={t('rsEscapeDescription')}
          >
            <IconInfoCircle color="gray" size={24} />
          </Tooltip>
        </Group>
        <Switch
          checked={rsEscape !== null}
          onChange={(event) => onSwitchChange(event)}
          disabled={!canEdit()}
        />
      </Group>
      <Fieldset
        bd={showError() ? '1px solid red' : undefined}
        legend={showError() ? t('rsEscapeFlowError') : undefined}
        styles={{ legend: { color: showError() ? 'red' : undefined } }}
      >
        {rsEscape !== null && (
          <Box mt={10}>
            {rsEscape.rules.map((rule, index) => (
              <div key={index}>
                <Group justify="space-between">
                  <Stack gap={5}>
                    <Group align="baseline" gap={5}>
                      <Text>{t('rsEscapeFlowIf')}</Text>
                      <FlowSelectorComponent
                        flows={getAvailableFlows(rule.flowId)}
                        readonly={!canEdit()}
                        selectedFlowId={rule.flowId}
                        onSelectionChange={(flow) => onSelectionChange(flow, index)}
                      />
                      <Text>{t('rsEscapeFlowHasAtLeast')}</Text>
                    </Group>
                    <Group align="baseline" gap={5}>
                      <NumberSelectorComponent
                        suffix=""
                        readonly={!canEdit()}
                        minValue={1}
                        maxValue={999999}
                        color="orange"
                        floatingPoint={false}
                        selectedNumber={rule.minFeedback}
                        tooltip={t('rsEscapeFlowMinFeedbackTooltip')}
                        onChangeNumber={(value) => onChangeMinFeedback(value, index)}
                      />
                      <Text>{t('rsEscapeFlowWith')}</Text>
                      <NumberSelectorComponent
                        suffix=""
                        readonly={!canEdit()}
                        minValue={1}
                        maxValue={5}
                        color="orange"
                        floatingPoint={true}
                        selectedNumber={rule.lowerScore}
                        tooltip={t('rsEscapeFlowLowerScoreTooltip')}
                        onChangeNumber={(value) => {
                          onChangeLowerScore(value, index);
                        }}
                      />
                      <Text>{t('rsEscapeFlowThen')}</Text>
                    </Group>
                    {flows.map((flow) => (
                      <Group key={flow.id} gap={'xs'}>
                        <Box ml={'md'}>
                          <Center>
                            <IconCornerDownRight />
                          </Center>
                        </Box>
                        <FlowSelectorComponent
                          flows={flows}
                          readonly={true}
                          selectedFlowId={flow.id}
                          onSelectionChange={(_) => {}}
                        />
                        <Box>
                          <Center>
                            <IconArrowNarrowRightDashed />
                          </Center>
                        </Box>
                        <NumberSelectorComponent
                          suffix="%"
                          readonly={!canEdit() || !flow.active}
                          minValue={0}
                          maxValue={100}
                          tooltip={t('rsEscapeFlowTargetTraffic')}
                          onChangeNumber={(value) => {
                            onChangePercentageRollback(value, index, flow.id);
                          }}
                          selectedNumber={
                            flow.active ? getFinalServePct(index, flow.id) : 0
                          }
                          color={flow.active ? 'orange' : 'gray.5'}
                          floatingPoint={false}
                        />
                      </Group>
                    ))}
                  </Stack>
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
                <Divider my={20} />
              </div>
            ))}
            <Stack justify="center" gap={0}>
              {rsEscape.rules.length == 0 && (
                <Box mt={10}>
                  <Stack justify="center" pb={0} gap={'md'}>
                    <Image height={90} />
                    <Text ta={'center'}>{t('rsEscapeStart')}</Text>
                  </Stack>
                  <Divider my={20} />
                </Box>
              )}
              <FlowSelectorComponent
                readonly={!canEdit()}
                key={Math.random()}
                flows={getAvailableFlows()}
                creationMode={true}
                selectedFlowId={''}
                onSelectionChange={(flow) => onNewFlowSelected(flow)}
              />
            </Stack>
          </Box>
        )}
        {rsEscape === null && (
          <Stack align="center" p={20} gap={'md'}>
            <Image height={90} />
            <Text ta={'center'}>{t('rsEscapeDescription')}</Text>
          </Stack>
        )}
      </Fieldset>
    </>
  );
}
