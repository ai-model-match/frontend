import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { GetFlowOutputDto } from '@dtos/flowDto';
import { ListFlowStepInputDto, ListFlowStepOutputDto } from '@dtos/flowStepDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import {
  ListUseCaseStepsOutputDto,
  UseCaseStepOrderByOptions,
} from '@dtos/useCaseStepDto';
import { FlowStep } from '@entities/flowStep';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Alert,
  Anchor,
  Breadcrumbs,
  Button,
  Fieldset,
  Grid,
  Group,
  Loader,
  Paper,
  Stepper,
  Text,
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
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { FlowStepConfigComponent } from './FlowStepConfigComponent';
import {
  defaultFlowApiResponse,
  defaultFlowStepApiRequest,
  defaultFlowStepApiResponse,
  defaultUseCaseApiResponse,
  defaultUseCaseStepApiResponse,
} from './FlowStepData';

interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function FlowStepPage() {
  // Params
  const { id, flowId } = useParams();

  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);

  // API Requests and Responses
  const [apiFlowStepRequest] = useState<ListFlowStepInputDto>(defaultFlowStepApiRequest);
  const [apiUseCaseResponse, setApiUseCaseResponse] = useState<GetUseCaseOutputDto>(
    defaultUseCaseApiResponse
  );
  const [apiFlowResponse, setApiFlowResponse] =
    useState<GetFlowOutputDto>(defaultFlowApiResponse);
  const [apiFlowStepResponse, setApiFlowStepResponse] = useState<ListFlowStepOutputDto>(
    defaultFlowStepApiResponse
  );
  const [apiUseCaseStepResponse, setApiUseCaseStepsResponse] =
    useState<ListUseCaseStepsOutputDto>(defaultUseCaseStepApiResponse);

  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(0);

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        // Get Use Case
        const useCaseData = await useCaseService.getUseCase({
          id: id!,
        });
        setApiUseCaseResponse(useCaseData);
        // Get Flow
        const flowData = await flowService.getFlow({
          id: flowId!,
        });
        setApiFlowResponse(flowData);
        // Get Use Case Steps
        const useCaseStepData = await useCaseStepService.listUseCaseSteps({
          useCaseId: id!,
          page: 1,
          pageSize: 200,
          orderBy: UseCaseStepOrderByOptions.Position,
          orderDir: OrderDir.ASC,
        });
        setApiUseCaseStepsResponse(useCaseStepData);
        // Get Flow Steps
        const flowStepData = await flowStepService.listFlowSteps({
          ...apiFlowStepRequest,
          flowId: flowId!,
        });
        setApiFlowStepResponse(flowStepData);
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
  }, [flowId, id, auth, navigate, t, apiFlowStepRequest]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiUseCaseResponse) {
      items.push(
        {
          title: apiUseCaseResponse.item.title,
          href: '/use-cases/' + apiUseCaseResponse.item.id,
        },
        {
          title: t('menuFlows'),
          href: '/use-cases/' + apiUseCaseResponse.item.id + '/flows',
        }
      );
      if (apiFlowResponse) {
        items.push({ title: apiFlowResponse.item.title, href: '#' });
      }
    }
    setBreadcrumbItems(items);
  }, [t, apiUseCaseResponse, apiFlowResponse]);

  const breadcrumbItemsRender = () =>
    breadcrumbItems.map((item) => {
      if (item.href == '#') {
        return <Text>{item.title}</Text>;
      } else {
        return (
          <Anchor component={NavLink} to={item.href}>
            {item.title}
          </Anchor>
        );
      }
    });

  const getFlowStepByUseCaseStep = (selectedStepNumber: number): FlowStep => {
    const useCaseStep = apiUseCaseStepResponse.items[selectedStepNumber];
    return apiFlowStepResponse.items.find((x) => x.useCaseStepId === useCaseStep.id)!;
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
                <Group justify="space-between" align="center" gap={0} mb={0}>
                  <Breadcrumbs>{breadcrumbItemsRender()}</Breadcrumbs>
                  <Button
                    variant="light"
                    leftSection={<IconArrowRampRight size={22} />}
                    onClick={() =>
                      navigate('/use-cases/' + apiUseCaseResponse.item.id + '/flows')
                    }
                  >
                    {t('useCaseFlowsBackAction')}
                  </Button>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper>
                <Group justify="space-between" align="center" gap={0}>
                  <PaperTitle
                    mb={0}
                    icon={IconSettingsCode}
                    title={apiFlowResponse.item.title}
                  />
                </Group>
                {auth.canWrite() && apiFlowResponse.item.active && (
                  <Alert color="orange" icon={<IconAlertCircle />} mt={'sm'}>
                    {t('flowActiveAlertMessage')}
                  </Alert>
                )}
                <Grid mt={30}>
                  {apiUseCaseStepResponse.items.length > 0 && (
                    <>
                      <Grid.Col span={4}>
                        <Fieldset legend={'Steps'}>
                          <Stepper
                            active={selectedStepNumber}
                            orientation="vertical"
                            onStepClick={(step) => setSelectedStepNumber(step)}
                          >
                            {apiUseCaseStepResponse.items.map((step, index) => (
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
                            useCaseStep={apiUseCaseStepResponse.items[selectedStepNumber]}
                            flowStep={getFlowStepByUseCaseStep(selectedStepNumber)}
                          />
                        </Fieldset>
                      </Grid.Col>
                    </>
                  )}
                  {apiUseCaseStepResponse.items.length === 0 && (
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
