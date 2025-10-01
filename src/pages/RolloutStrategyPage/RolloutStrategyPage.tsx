import {
  BreadcrumbPath,
  BreadcrumbPathItem,
} from '@components/BreadcrumbPath/BreadcrumbPath';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import {
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
import { RolloutStrategyState } from '@entities/rolloutStrategy';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Button,
  Divider,
  Fieldset,
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
import {
  IconArrowRampRight,
  IconArrowsShuffle,
  IconLogout2,
  IconSettingsAutomation,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import equal from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CompletedFlowSelectorComponent } from './CompletedFlowSelectorComponent';
import { WarmupComponent } from './WarmupComponent';

export function RolloutStrategyPage() {
  const { id } = useParams();
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  // States for rendering
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [formHasError, setFormHasError] = useState(false);
  const [
    selectForceCompletedFlowPanelIsOpen,
    {
      open: selectForceCompletedFlowOpenPanel,
      close: selectForceCompletedFlowClosePanel,
    },
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
  }, [apiGetRolloutStrategyResponse, interval]);

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
    setFormHasError(false);
  };

  const handleSave = async () => {
    try {
      setApiLoading(true);
      if (apiGetRolloutStrategyResponse.item.configuration.warmup?.goals.length === 0) {
        apiGetRolloutStrategyResponse.item.configuration.warmup = null;
      }
      const updatedRs = await rolloutStrategyService.updateRolloutStrategy({
        useCaseId: apiGetUseCaseResponse.item.id,
        configuration: apiGetRolloutStrategyResponse.item.configuration,
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
    } catch (err) {
      console.error(err);
      alert('Error: ' + getErrorMessage(err));
    } finally {
      setApiLoading(false);
    }
  };

  // Content
  const getLabel = (state: RolloutStrategyState) => {
    switch (state) {
      case RolloutStrategyState.INIT:
        return 'Initialize';
      case RolloutStrategyState.WARMUP:
        return 'Warmup Phase';
      case RolloutStrategyState.ADAPTIVE:
        return 'Adaptive Phase';
      case RolloutStrategyState.COMPLETED:
        return 'Completed';
      case RolloutStrategyState.FORCED_COMPLETED:
        return 'Force Completed';
      case RolloutStrategyState.FORCED_ESCAPED:
        return 'Force Escaped';
      case RolloutStrategyState.FORCED_STOP:
        return 'Force Stopped';
      default:
        return state;
    }
  };

  const getNextStates = (nextState: RolloutStrategyState): RolloutStrategyState[] => {
    switch (nextState) {
      case RolloutStrategyState.INIT:
        return [RolloutStrategyState.WARMUP];
      case RolloutStrategyState.WARMUP:
        return [
          RolloutStrategyState.FORCED_COMPLETED,
          RolloutStrategyState.FORCED_ESCAPED,
          RolloutStrategyState.FORCED_STOP,
        ];
      case RolloutStrategyState.ADAPTIVE:
        return [
          RolloutStrategyState.FORCED_COMPLETED,
          RolloutStrategyState.FORCED_ESCAPED,
          RolloutStrategyState.FORCED_STOP,
        ];
      case RolloutStrategyState.COMPLETED:
        return [RolloutStrategyState.INIT];
      case RolloutStrategyState.FORCED_COMPLETED:
        return [RolloutStrategyState.INIT];
      case RolloutStrategyState.FORCED_ESCAPED:
        return [RolloutStrategyState.INIT];
      case RolloutStrategyState.FORCED_STOP:
        return [RolloutStrategyState.INIT];
      default:
        return [];
    }
  };
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
                <Group justify="space-between" align="center" gap={10} mb={0}>
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

                  <Group justify="flex-end" align="center" gap={10} mb={0}>
                    {(saveButtonEnabled || formHasError) && (
                      <Button variant="outline" onClick={handleReset}>
                        {t('btnReset')}
                      </Button>
                    )}
                    {(saveButtonEnabled || formHasError) && (
                      <Button
                        color="orange"
                        loading={apiLoading}
                        disabled={formHasError}
                        loaderProps={{ type: 'dots' }}
                        onClick={handleSave}
                      >
                        {t('flowStepUpdateBtn')}
                      </Button>
                    )}
                    {!saveButtonEnabled && !formHasError && (
                      <Select
                        withCheckIcon={false}
                        onChange={(value) => {
                          if (value === null) return;
                          handleUpdateStatus(value as RolloutStrategyState);
                        }}
                        styles={{
                          input: {
                            backgroundColor:
                              apiGetRolloutStrategyResponse.item.rolloutState ===
                                RolloutStrategyState.WARMUP ||
                              apiGetRolloutStrategyResponse.item.rolloutState ===
                                RolloutStrategyState.ADAPTIVE
                                ? 'var(--mantine-color-orange-1)'
                                : apiGetRolloutStrategyResponse.item.rolloutState !==
                                    RolloutStrategyState.INIT
                                  ? 'var(--mantine-color-brand-1)'
                                  : undefined,
                          },
                        }}
                        allowDeselect={false}
                        clearable={false}
                        data={[
                          {
                            value: apiGetRolloutStrategyResponse.item.rolloutState,
                            label: getLabel(
                              apiGetRolloutStrategyResponse.item.rolloutState
                            ),
                            disabled: true,
                          },
                          ...getNextStates(
                            apiGetRolloutStrategyResponse.item.rolloutState
                          ).map((nextState) => {
                            return {
                              value: nextState,
                              label: getLabel(nextState),
                            };
                          }),
                        ]}
                        value={apiGetRolloutStrategyResponse.item.rolloutState}
                      />
                    )}
                  </Group>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ lg: 12, xl: 6 }}>
              <Paper mih={'100%'}>
                {/* Adaptive Phase */}
                <WarmupComponent
                  rsStatus={apiGetRolloutStrategyResponse.item.rolloutState}
                  flows={apiListFlowResponse.items}
                  rsWarmup={apiGetRolloutStrategyResponse.item.configuration.warmup}
                  onError={(hasError) => {
                    setFormHasError(hasError);
                  }}
                  onChange={(newWarmup) => {
                    const newRs = { ...apiGetRolloutStrategyResponse };
                    newRs.item.configuration.warmup = newWarmup;
                    setApiGetRolloutStrategyResponse(newRs);
                  }}
                />
                <Divider my="lg" />
                <Group justify="space-between" align="top" gap={0} mb={0}>
                  <PaperTitle mb={15} icon={IconArrowsShuffle} title="Adaptive Phase" />
                </Group>
                <Fieldset>a</Fieldset>
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ lg: 12, xl: 6 }}>
              <Paper mih={'100%'}>
                <Group justify="space-between" align="top" gap={0} mb={0}>
                  <PaperTitle
                    mb={15}
                    iconColor="red"
                    icon={IconLogout2}
                    title="Escape Phase"
                  />
                </Group>
                <Fieldset>a</Fieldset>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
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
      </Layout>
    </AuthGuard>
  );
}
