import {
  BreadcrumbPath,
  BreadcrumbPathItem,
} from '@components/BreadcrumbPath/BreadcrumbPath';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import {
  defaultFlow,
  defaultListFlowApiRequest,
  defaultListFlowApiResponse,
} from '@dtos/defaultFlowDto';
import {
  defaultGetRolloutStrategyApiRequest,
  defaultGetRolloutStrategyApiResponse,
} from '@dtos/defaultRolloutStrategyDto';
import { defaultGetUseCaseApiResponse } from '@dtos/defaultUseCaseDto';
import { ListFlowOutputDto } from '@dtos/flowDto';
import {
  GetRolloutStrategyInputDto,
  GetRolloutStrategyOutputDto,
} from '@dtos/rolloutStrategyDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { Flow } from '@entities/flow';
import {
  RolloutStrategyConfiguration,
  RolloutStrategyState,
  RsAdaptive,
  RsEscape,
  RsWarmup,
} from '@entities/rolloutStrategy';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Button,
  ComboboxData,
  Divider,
  Grid,
  Group,
  JsonInput,
  Loader,
  Modal,
  Paper,
  Select,
} from '@mantine/core';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { flowService } from '@services/flowService';
import { rolloutStrategyService } from '@services/rolloutStrategyService';
import { useCaseService } from '@services/useCaseService';
import { IconArrowRampRight, IconSettingsAutomation } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import equal from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { AdaptiveComponent } from './AdaptiveComponent';
import { CompletedFlowSelectorComponent } from './CompletedFlowSelectorComponent';
import { EscapeComponent } from './EscapeComponent';
import { getNextStates } from './RolloutStrategyData';
import { WarmupComponent } from './WarmupComponent';
import { WinnerFlowComponent } from './WinnerFlowComponent';

export function RolloutStrategyPage() {
  const { id } = useParams();
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbPathItem[]>([]);
  // States for APIs
  const [apiGetUseCaseResponse, setApiGetUseCaseResponse] = useState<GetUseCaseOutputDto>(
    defaultGetUseCaseApiResponse
  );
  const [apiGetRolloutStrategyRequest, setApiGetRolloutStrategyRequest] =
    useState<GetRolloutStrategyInputDto>(defaultGetRolloutStrategyApiRequest);
  const [apiGetRolloutStrategyResponse, setApiGetRolloutStrategyResponse] =
    useState<GetRolloutStrategyOutputDto>(defaultGetRolloutStrategyApiResponse);
  const [apiGetInitialRolloutStrategyResponse, setApiGetInitialRolloutStrategyResponse] =
    useState<GetRolloutStrategyOutputDto>(defaultGetRolloutStrategyApiResponse);
  const [apiListFlowResponse, setApiListFlowResponse] = useState<ListFlowOutputDto>(
    defaultListFlowApiResponse
  );
  const [winnerFlow, setWinnerFlow] = useState<Flow>(defaultFlow);
  // States for rendering
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [formHasErrorWarmup, setFormHasErrorWarmup] = useState(false);
  const [formHasErrorEscape, setFormHasErrorEscape] = useState(false);
  const [winnerModalShownOne, setWinnerModalShownOnce] = useState(false);
  const [
    selectForceCompletedFlowPanelIsOpen,
    {
      open: selectForceCompletedFlowOpenPanel,
      close: selectForceCompletedFlowClosePanel,
    },
  ] = useDisclosure(false);
  const [
    winnerFlowPanelIsOpen,
    { open: winnerFlowOpenPanel, close: winnerFlowClosePanel },
  ] = useDisclosure(false);
  // Refresh page
  const interval = useInterval(
    () => setApiGetRolloutStrategyRequest({ ...apiGetRolloutStrategyRequest }),
    3000
  );

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const useCaseData = await useCaseService.getUseCase({ id: id! });
        const rolloutStrategyData = await rolloutStrategyService.getRolloutStrategy({
          ...apiGetRolloutStrategyRequest,
          useCaseId: useCaseData.item.id,
        });
        const listFlowData = await flowService.listFlows({
          ...defaultListFlowApiRequest,
          useCaseId: useCaseData.item.id,
        });
        setApiGetRolloutStrategyResponse({ ...rolloutStrategyData });
        setApiGetInitialRolloutStrategyResponse(structuredClone(rolloutStrategyData));

        setApiGetUseCaseResponse(useCaseData);
        setApiListFlowResponse(listFlowData);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          case 'use-case-not-found':
            navigate('/not-found', { replace: true });
            break;
          case 'rollout-strategy-not-found':
            navigate('/not-found', { replace: true });
            break;
          default:
            navigate('/internal-server-error', { replace: true });
            break;
        }
      } finally {
        setPageLoaded(true);
      }
    })();
  }, [id, apiGetRolloutStrategyRequest, navigate, t]);

  useEffect(() => {
    if (
      apiGetRolloutStrategyResponse.item.rolloutState === RolloutStrategyState.WARMUP ||
      apiGetRolloutStrategyResponse.item.rolloutState === RolloutStrategyState.ADAPTIVE
    ) {
      interval.start();
    } else {
      interval.stop();
    }
    // Check if Winner Flow Modal needs to be opened
    const winnerFlow = apiListFlowResponse.items.find(
      (f) => f.currentServePct === 100 && f.active
    );
    if (
      winnerFlow &&
      !winnerModalShownOne &&
      (apiGetRolloutStrategyResponse.item.rolloutState ===
        RolloutStrategyState.FORCED_COMPLETED ||
        apiGetRolloutStrategyResponse.item.rolloutState ===
          RolloutStrategyState.COMPLETED)
    ) {
      setWinnerFlow(winnerFlow);
      setWinnerModalShownOnce(true);
      winnerFlowOpenPanel();
    }
    if (
      apiGetRolloutStrategyResponse.item.rolloutState !==
        RolloutStrategyState.FORCED_COMPLETED &&
      apiGetRolloutStrategyResponse.item.rolloutState !== RolloutStrategyState.COMPLETED
    ) {
      setWinnerModalShownOnce(false);
    }
  }, [
    apiGetRolloutStrategyResponse,
    interval,
    winnerFlowOpenPanel,
    winnerModalShownOne,
    apiListFlowResponse,
  ]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiGetUseCaseResponse)
      items.push({
        title: apiGetUseCaseResponse.item.title,
        href: `/use-cases/${apiGetUseCaseResponse.item.id}`,
      });
    items.push({ title: t('menuRolloutStrategy'), href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiGetUseCaseResponse]);

  useEffect(() => {
    const isEqual = equal(
      apiGetInitialRolloutStrategyResponse,
      apiGetRolloutStrategyResponse
    );
    if (isEqual) {
      setSaveButtonEnabled(false);
    } else {
      setSaveButtonEnabled(true);
    }
  }, [apiGetInitialRolloutStrategyResponse, apiGetRolloutStrategyResponse]);

  // Handlers
  const handleReset = () => {
    setApiGetRolloutStrategyResponse(
      structuredClone(apiGetInitialRolloutStrategyResponse)
    );
    setFormHasErrorWarmup(false);
    setFormHasErrorEscape(false);
  };

  const handleSave = async () => {
    try {
      setApiLoading(true);
      if (rolloutStrategy.configuration.warmup?.goals.length === 0) {
        rolloutStrategy.configuration.warmup = null;
      }
      const updatedRs = await rolloutStrategyService.updateRolloutStrategy({
        useCaseId: apiGetUseCaseResponse.item.id,
        configuration: rolloutStrategy.configuration,
      });
      setApiGetInitialRolloutStrategyResponse(structuredClone(updatedRs));
      setApiGetRolloutStrategyResponse(updatedRs);
    } catch (err) {
      console.error(err);
      alert('Error: ' + getErrorMessage(err));
    } finally {
      setApiLoading(false);
    }
  };

  const onForcedCompletedFlowSelected = async (flowId: string) => {
    await updateState(RolloutStrategyState.FORCED_COMPLETED, flowId);
    setApiGetRolloutStrategyRequest({ ...apiGetRolloutStrategyRequest });
    selectForceCompletedFlowClosePanel();
  };

  const handleUpdateStatus = async (newState: RolloutStrategyState) => {
    if (newState === RolloutStrategyState.FORCED_COMPLETED) {
      selectForceCompletedFlowOpenPanel();
      return;
    }
    return updateState(newState);
  };

  const onWarmupConfigChange = (newWarmup: RsWarmup | null) => {
    const newRs = { ...apiGetRolloutStrategyResponse };
    newRs.item.configuration.warmup = newWarmup;
    setApiGetRolloutStrategyResponse(newRs);
  };

  const onEscapeConfigChange = (newEscape: RsEscape | null) => {
    const newRs = { ...apiGetRolloutStrategyResponse };
    newRs.item.configuration.escape = newEscape;
    setApiGetRolloutStrategyResponse(newRs);
  };

  const onAdaptiveConfigChange = (newAdaptive: RsAdaptive) => {
    const newRs = { ...apiGetRolloutStrategyResponse };
    newRs.item.configuration.adaptive = newAdaptive;
    setApiGetRolloutStrategyResponse(newRs);
  };

  const updateState = async (
    newState: RolloutStrategyState,
    completedFlowId?: string
  ) => {
    try {
      setApiLoading(true);
      const updatedRs = await rolloutStrategyService.updateRolloutStrategyState({
        useCaseId: apiGetUseCaseResponse.item.id,
        state: newState,
        completedFlowId,
      });
      setApiGetInitialRolloutStrategyResponse(structuredClone(updatedRs));
      setApiGetRolloutStrategyResponse(updatedRs);
      setApiGetRolloutStrategyRequest((prev) => ({ ...prev }));
    } catch (err) {
      console.error(err);
      alert('Error: ' + getErrorMessage(err));
    } finally {
      setApiLoading(false);
    }
  };

  // Content
  const getStatusBackgroundColor = (state: RolloutStrategyState) => {
    switch (state) {
      case RolloutStrategyState.INIT:
        return undefined;
      case RolloutStrategyState.WARMUP:
        return 'var(--mantine-color-orange-1)';
      case RolloutStrategyState.ADAPTIVE:
        return 'var(--mantine-color-orange-1)';
      case RolloutStrategyState.ESCAPED:
        return 'var(--mantine-color-red-1)';
      case RolloutStrategyState.COMPLETED:
        return 'var(--mantine-color-green-1)';
      case RolloutStrategyState.FORCED_COMPLETED:
        return 'var(--mantine-color-green-1)';
      case RolloutStrategyState.FORCED_ESCAPED:
        return 'var(--mantine-color-red-1)';
      case RolloutStrategyState.FORCED_STOP:
        return 'var(--mantine-color-red-1)';
      default:
        return undefined;
    }
  };

  const getAvailableStates = (
    currentState: RolloutStrategyState,
    config: RolloutStrategyConfiguration
  ): ComboboxData => {
    return [
      {
        value: currentState,
        label: getLabel(currentState),
        disabled: true,
      },
      ...getNextStates(currentState, config).map((nextState) => {
        return {
          value: nextState,
          label: getLabel(nextState),
        };
      }),
    ];
  };

  const stateLabels = useMemo(
    () => ({
      [RolloutStrategyState.INIT]: t('rsStateInit'),
      [RolloutStrategyState.WARMUP]: t('rsStateWarmup'),
      [RolloutStrategyState.ESCAPED]: t('rsStateEscaped'),
      [RolloutStrategyState.ADAPTIVE]: t('rsStateAdaptive'),
      [RolloutStrategyState.COMPLETED]: t('rsStateCompleted'),
      [RolloutStrategyState.FORCED_COMPLETED]: t('rsStateForcedCompleted'),
      [RolloutStrategyState.FORCED_ESCAPED]: t('rsStateForcedEscaped'),
      [RolloutStrategyState.FORCED_STOP]: t('rsStateForcedStopped'),
    }),
    [t]
  );

  const getLabel = (state: RolloutStrategyState): string => {
    return stateLabels[state as keyof typeof stateLabels] || state;
  };

  const rolloutStrategy = apiGetRolloutStrategyResponse.item;

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Paper>
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            </Paper>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <Paper>
                <Group justify="space-between" gap={10} mb={0}>
                  <BreadcrumbPath items={breadcrumbItems} />
                  <Button
                    variant="light"
                    leftSection={<IconArrowRampRight size={22} />}
                    onClick={() =>
                      navigate(`/use-cases/${apiGetUseCaseResponse.item.id}/flows`)
                    }
                  >
                    {t('useCaseFlowsAction')}
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper>
                <Group justify="space-between" align="top" gap={0} mb={0}>
                  <PaperTitle mb={0} icon={IconSettingsAutomation} title={t('rsTitle')} />

                  <Group justify="flex-end" gap={10} mb={0}>
                    {(saveButtonEnabled || formHasErrorWarmup || formHasErrorEscape) && (
                      <Button variant="outline" onClick={handleReset}>
                        {t('btnReset')}
                      </Button>
                    )}
                    {(saveButtonEnabled || formHasErrorWarmup || formHasErrorEscape) && (
                      <Button
                        color="orange"
                        loading={apiLoading}
                        disabled={
                          formHasErrorWarmup || formHasErrorEscape || !auth.canWrite()
                        }
                        loaderProps={{ type: 'dots' }}
                        onClick={handleSave}
                      >
                        {t('flowStepUpdateBtn')}
                      </Button>
                    )}
                    {!saveButtonEnabled && !formHasErrorWarmup && !formHasErrorEscape && (
                      <Select
                        disabled={!auth.canWrite()}
                        withCheckIcon={false}
                        onChange={(value) => {
                          if (value === null) return;
                          handleUpdateStatus(value as RolloutStrategyState);
                        }}
                        styles={{
                          input: {
                            backgroundColor: getStatusBackgroundColor(
                              rolloutStrategy.rolloutState
                            ),
                          },
                        }}
                        allowDeselect={false}
                        clearable={false}
                        data={getAvailableStates(
                          rolloutStrategy.rolloutState,
                          rolloutStrategy.configuration
                        )}
                        value={rolloutStrategy.rolloutState}
                      />
                    )}
                  </Group>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ lg: 12, xl: 6 }}>
              <Paper mih={'100%'}>
                <WarmupComponent
                  rsStatus={rolloutStrategy.rolloutState}
                  flows={apiListFlowResponse.items}
                  rsWarmup={rolloutStrategy.configuration.warmup}
                  onError={setFormHasErrorWarmup}
                  onChange={onWarmupConfigChange}
                />
                <Divider my="lg" />
                <AdaptiveComponent
                  rsStatus={rolloutStrategy.rolloutState}
                  rsAdaptive={rolloutStrategy.configuration.adaptive}
                  onChange={onAdaptiveConfigChange}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ lg: 12, xl: 6 }}>
              <Paper mih={'100%'}>
                <EscapeComponent
                  rsStatus={rolloutStrategy.rolloutState}
                  flows={apiListFlowResponse.items}
                  rsEscape={rolloutStrategy.configuration.escape}
                  onError={setFormHasErrorEscape}
                  onChange={onEscapeConfigChange}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={12} hidden={true}>
              <Paper mih={'100%'}>
                <JsonInput
                  minRows={30}
                  maxRows={30}
                  formatOnBlur
                  autosize
                  value={JSON.stringify(apiGetRolloutStrategyResponse, null, 2)}
                />
              </Paper>
            </Grid.Col>
          </>
        )}
        <Modal
          opened={selectForceCompletedFlowPanelIsOpen}
          onClose={selectForceCompletedFlowClosePanel}
        >
          <CompletedFlowSelectorComponent
            flows={apiListFlowResponse.items}
            onCancel={selectForceCompletedFlowClosePanel}
            onForcedCompletedFlowSelected={onForcedCompletedFlowSelected}
          />
        </Modal>

        <Modal opened={winnerFlowPanelIsOpen} onClose={winnerFlowClosePanel}>
          <WinnerFlowComponent onClose={winnerFlowClosePanel} winnerFlow={winnerFlow} />
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
