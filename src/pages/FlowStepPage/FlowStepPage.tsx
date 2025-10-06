import {
  BreadcrumbPath,
  BreadcrumbPathItem,
} from '@components/BreadcrumbPath/BreadcrumbPath';
import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { defaultGetFlowApiResponse } from '@dtos/defaultFlowDto';
import {
  defaultListFlowStepApiRequest,
  defaultListFlowStepApiResponse,
} from '@dtos/defaultFlowStepDto';
import { defaultGetUseCaseApiResponse } from '@dtos/defaultUseCaseDto';
import { defaultListUseCaseStepApiResponse } from '@dtos/defaultUseCaseStepDto';
import { GetFlowOutputDto } from '@dtos/flowDto';
import { ListFlowStepInputDto, ListFlowStepOutputDto } from '@dtos/flowStepDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import {
  ListUseCaseStepOutputDto,
  UseCaseStepOrderByOptions,
} from '@dtos/useCaseStepDto';
import { FlowStep } from '@entities/flowStep';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Alert,
  Button,
  Fieldset,
  Grid,
  Group,
  Loader,
  Paper,
  Stepper,
} from '@mantine/core';
import { OrderDir } from '@services/api.type';
import { flowService } from '@services/flowService';
import { flowStepService } from '@services/flowStepService';
import { useCaseService } from '@services/useCaseService';
import { useCaseStepService } from '@services/useCaseStepService';
import {
  IconAlertCircle,
  IconArrowRampRight,
  IconSettingsCode,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { FlowStepConfigComponent } from './FlowStepConfigComponent';

export default function FlowStepPage() {
  // Params
  const { id, flowId } = useParams();

  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);

  // API Requests and Responses
  const [apiListFlowStepRequest] = useState<ListFlowStepInputDto>(
    defaultListFlowStepApiRequest
  );
  const [apiListFlowStepResponse, setApiListFlowStepResponse] =
    useState<ListFlowStepOutputDto>(defaultListFlowStepApiResponse);

  const [apiGetUseCaseResponse, setApiGetUseCaseResponse] = useState<GetUseCaseOutputDto>(
    defaultGetUseCaseApiResponse
  );
  const [apiListUseCaseStepResponse, setApiListUseCaseStepsResponse] =
    useState<ListUseCaseStepOutputDto>(defaultListUseCaseStepApiResponse);
  const [apiGetFlowResponse, setApiGetFlowResponse] = useState<GetFlowOutputDto>(
    defaultGetFlowApiResponse
  );
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbPathItem[]>([]);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(0);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        // Get Use Case
        const useCaseData = await useCaseService.getUseCase({
          id: id!,
        });
        setApiGetUseCaseResponse(useCaseData);
        // Get Flow
        const flowData = await flowService.getFlow({
          id: flowId!,
        });
        setApiGetFlowResponse(flowData);
        // Get Use Case Steps
        const useCaseStepData = await useCaseStepService.listUseCaseSteps({
          useCaseId: id!,
          page: 1,
          pageSize: 200,
          orderBy: UseCaseStepOrderByOptions.Position,
          orderDir: OrderDir.ASC,
        });
        setApiListUseCaseStepsResponse(useCaseStepData);
        // Get Flow Steps
        const flowStepData = await flowStepService.listFlowSteps({
          ...apiListFlowStepRequest,
          flowId: flowId!,
        });
        setApiListFlowStepResponse(flowStepData);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          case 'use-case-not-found':
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
  }, [flowId, id, navigate, t, apiListFlowStepRequest]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiGetUseCaseResponse) {
      items.push(
        {
          title: apiGetUseCaseResponse.item.title,
          href: '/use-cases/' + apiGetUseCaseResponse.item.id,
        },
        {
          title: t('menuFlows'),
          href: '/use-cases/' + apiGetUseCaseResponse.item.id + '/flows',
        }
      );
      if (apiGetFlowResponse) {
        items.push({ title: apiGetFlowResponse.item.title, href: '#' });
      }
    }
    setBreadcrumbItems(items);
  }, [t, apiGetUseCaseResponse, apiGetFlowResponse]);

  const getFlowStepByUseCaseStep = (selectedStepNumber: number): FlowStep => {
    const useCaseStep = apiListUseCaseStepResponse.items[selectedStepNumber];
    return apiListFlowStepResponse.items.find((x) => x.useCaseStepId === useCaseStep.id)!;
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
                <Group justify="space-between" gap={0} mb={0}>
                  <BreadcrumbPath items={breadcrumbItems} />
                  <Button
                    variant="light"
                    leftSection={<IconArrowRampRight size={22} />}
                    onClick={() =>
                      navigate('/use-cases/' + apiGetUseCaseResponse.item.id + '/flows')
                    }
                  >
                    {t('useCaseFlowsBackAction')}
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper>
                <Group justify="space-between" gap={0}>
                  <PaperTitle
                    mb={0}
                    icon={IconSettingsCode}
                    title={apiGetFlowResponse.item.title}
                  />
                </Group>
                {auth.canWrite() && apiGetFlowResponse.item.active && (
                  <Alert color="orange" icon={<IconAlertCircle />} mt={'sm'}>
                    {t('flowActiveAlertMessage')}
                  </Alert>
                )}
                <Grid mt={30}>
                  {apiListUseCaseStepResponse.items.length > 0 && (
                    <>
                      <Grid.Col span={4}>
                        <Fieldset legend={'Steps'}>
                          <Stepper
                            active={selectedStepNumber}
                            orientation="vertical"
                            onStepClick={(step) => setSelectedStepNumber(step)}
                          >
                            {apiListUseCaseStepResponse.items.map((step, index) => (
                              <Stepper.Step
                                completedIcon={index + 1}
                                allowStepSelect={true}
                                label={step.title}
                                description={step.code}
                              ></Stepper.Step>
                            ))}
                          </Stepper>
                        </Fieldset>
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <Fieldset
                          legend={`${t('useCaseStepNumber')}${selectedStepNumber + 1}`}
                        >
                          <FlowStepConfigComponent
                            useCaseStep={
                              apiListUseCaseStepResponse.items[selectedStepNumber]
                            }
                            flowStep={getFlowStepByUseCaseStep(selectedStepNumber)}
                          />
                        </Fieldset>
                      </Grid.Col>
                    </>
                  )}
                  {apiListUseCaseStepResponse.items.length === 0 && (
                    <Grid.Col span={12}>
                      <Fieldset mb={60}>
                        <EmptyState
                          imageName="new-use-case-step"
                          title={t('useCaseStepCreateNewTitleDisabled')}
                          text={t('useCaseStepCreateNewTextDisabled')}
                        ></EmptyState>
                      </Fieldset>
                    </Grid.Col>
                  )}
                </Grid>
              </Paper>
            </Grid.Col>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
