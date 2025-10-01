import {
  BreadcrumbPath,
  BreadcrumbPathItem,
} from '@components/BreadcrumbPath/BreadcrumbPath';
import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { defaultGetUseCaseApiResponse } from '@dtos/defaultUseCaseDto';
import {
  defaultListUseCaseStepApiRequest,
  defaultListUseCaseStepApiResponse,
  defaultUseCaseStep,
} from '@dtos/defaultUseCaseStepDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { ListUseCaseStepInputDto, ListUseCaseStepOutputDto } from '@dtos/useCaseStepDto';
import { UseCase } from '@entities/useCase';
import { UseCaseStep } from '@entities/useCaseStep';
import { AuthGuard } from '@guards/AuthGuard';
import {
  ActionIcon,
  Button,
  Code,
  CopyButton,
  Divider,
  Drawer,
  Fieldset,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  Stepper,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCaseService } from '@services/useCaseService';
import { useCaseStepService } from '@services/useCaseStepService';
import {
  IconTargetArrow,
  IconCheck,
  IconCopy,
  IconPencil,
  IconPlus,
  IconRoute,
  IconTrash,
  IconArrowRampRight,
  IconSettingsAutomation,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteUseCaseStepComponent from './DeleteUseCaseStepComponent';
import NewUseCaseStepComponent from './NewUseCaseStepComponent';
import UpdateUseCaseStepComponent from './UpdateUseCaseStepComponent';
import UseCaseStatusComponent from './UseCaseStatusComponent';
import { UseCaseStepGraphComponent } from './UseCaseStepGraphComponent';

export default function UseCaseStepPage() {
  // Params
  const { id } = useParams();
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiGetUseCaseResponse, setApiGetUseCaseResponse] = useState<GetUseCaseOutputDto>(
    defaultGetUseCaseApiResponse
  );
  const [apiUseCaseStepRequest, setApiUseCaseStepRequest] =
    useState<ListUseCaseStepInputDto>(defaultListUseCaseStepApiRequest);
  const [apiUseCaseStepResponse, setApiUseCaseStepResponse] =
    useState<ListUseCaseStepOutputDto>(defaultListUseCaseStepApiResponse);
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbPathItem[]>([]);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(0);
  const [
    newUseCaseStepPanelIsOpen,
    { open: newUseCaseStepOpenPanel, close: newUseCaseStepClosePanel },
  ] = useDisclosure(false);
  const [
    updateUseCaseStepPanelIsOpen,
    { open: updateUseCaseStepOpenPanel, close: updateUseCaseStepClosePanel },
  ] = useDisclosure(false);
  const [
    deleteUseCaseStepPanelIsOpen,
    { open: deleteUseCaseStepOpenPanel, close: deleteUseCaseStepClosePanel },
  ] = useDisclosure(false);
  const [selectedUseCaseStep, setSelectedUseCaseStep] =
    useState<UseCaseStep>(defaultUseCaseStep);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const data = await useCaseService.getUseCase({ id: id! });
        const stepData = await useCaseStepService.listUseCaseSteps({
          ...apiUseCaseStepRequest,
          useCaseId: data.item.id,
        });
        setApiUseCaseStepResponse(stepData);
        setApiGetUseCaseResponse(data);
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
  }, [id, navigate, t, apiUseCaseStepRequest]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiGetUseCaseResponse)
      items.push({ title: apiGetUseCaseResponse.item.title, href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiGetUseCaseResponse]);

  const onUseCaseStatusChange = (useCase: UseCase) => {
    setApiGetUseCaseResponse({
      item: useCase,
    });
  };

  const handleUpdateRequest = (id: string) => {
    const useCaseStep = apiUseCaseStepResponse?.items.find((x) => x.id === id);
    if (!useCaseStep) return;
    setSelectedUseCaseStep(useCaseStep);
    updateUseCaseStepOpenPanel();
  };

  const handleDeleteRequest = (id: string) => {
    const useCaseStep = apiUseCaseStepResponse?.items.find(
      (x: UseCaseStep) => x.id === id
    );
    if (!useCaseStep) return;
    setSelectedUseCaseStep(useCaseStep);
    deleteUseCaseStepOpenPanel();
  };

  const onUseCaseStepCreated = useCallback(
    (createdUseCaseStep: UseCaseStep) => {
      newUseCaseStepClosePanel();
      setApiUseCaseStepRequest({ ...apiUseCaseStepRequest });
      apiUseCaseStepResponse.items.push(createdUseCaseStep);
      apiUseCaseStepResponse.totalCount++;
      setSelectedStepNumber(createdUseCaseStep.position - 1);
    },
    [
      setApiUseCaseStepRequest,
      apiUseCaseStepRequest,
      apiUseCaseStepResponse,
      newUseCaseStepClosePanel,
    ]
  );

  const onUseCaseStepUpdated = useCallback(() => {
    updateUseCaseStepClosePanel();
    setApiUseCaseStepRequest({ ...apiUseCaseStepRequest });
  }, [apiUseCaseStepRequest, setApiUseCaseStepRequest, updateUseCaseStepClosePanel]);

  const onUseCaseStepDeleted = useCallback(
    (id: string) => {
      deleteUseCaseStepClosePanel();
      apiUseCaseStepResponse.items = apiUseCaseStepResponse.items.filter(
        (x) => x.id !== id
      );
      apiUseCaseStepResponse.totalCount--;
      setSelectedStepNumber((prev) =>
        Math.min(prev, Math.max(0, apiUseCaseStepResponse.totalCount - 1))
      );
      setApiUseCaseStepRequest({ ...apiUseCaseStepRequest });
    },
    [
      apiUseCaseStepRequest,
      apiUseCaseStepResponse,
      setApiUseCaseStepRequest,
      setSelectedStepNumber,
      deleteUseCaseStepClosePanel,
    ]
  );

  const onStepItemClick = (index: number) => {
    if (index >= apiUseCaseStepResponse.items.length) {
      newUseCaseStepOpenPanel();
    } else {
      setSelectedStepNumber(index);
    }
  };

  // Content
  const element = (item: UseCaseStep) => {
    return (
      <>
        <Group justify="space-between">
          <Group gap={2} wrap="nowrap">
            <PaperTitle mb={0} icon={IconRoute} title={item.title} />
            <Code>{item.code}</Code>
            <CopyButton value={item.code} timeout={1000}>
              {({ copied, copy }) => (
                <ActionIcon
                  color={copied ? 'var(--mantine-color-teal-7)' : 'gray'}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? <IconCheck size={22} /> : <IconCopy size={22} />}
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
          <Group gap={0} wrap="nowrap">
            {auth.canWrite() && (
              <Tooltip withArrow label={t('useCaseStepUpdateAction')}>
                <ActionIcon variant="subtle" onClick={() => handleUpdateRequest(item.id)}>
                  <IconPencil size={22} />
                </ActionIcon>
              </Tooltip>
            )}
            {auth.canWrite() && (
              <Tooltip withArrow label={t('useCaseStepDeleteAction')}>
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => handleDeleteRequest(item.id)}
                >
                  <IconTrash size={22} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
        <Text mt={15}>{item.description}</Text>
        <Divider my={20} />
        <UseCaseStepGraphComponent />
      </>
    );
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
                  <BreadcrumbPath items={breadcrumbItems} />
                  <Group justify="flex-end" align="center" gap={10} mb={0}>
                    <Button
                      variant="light"
                      leftSection={<IconArrowRampRight size={22} />}
                      onClick={() =>
                        navigate('/use-cases/' + apiGetUseCaseResponse.item.id + '/flows')
                      }
                    >
                      {t('useCaseFlowsAction')}
                    </Button>
                    <Button
                      variant="light"
                      leftSection={<IconSettingsAutomation size={22} />}
                      onClick={() =>
                        navigate(
                          `/use-cases/${apiGetUseCaseResponse.item.id}/rollout-strategy`
                        )
                      }
                    >
                      {t('useCaseRolloutStrategyAction')}
                    </Button>
                  </Group>
                </Group>
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              <Paper>
                <Group justify="space-between" align="center" gap={0} mb={0}>
                  <Group gap={2}>
                    <PaperTitle
                      mb={0}
                      icon={IconTargetArrow}
                      title={apiGetUseCaseResponse.item.title}
                    />
                    <Code>{apiGetUseCaseResponse.item.code}</Code>
                    <CopyButton value={apiGetUseCaseResponse.item.code} timeout={1000}>
                      {({ copied, copy }) => (
                        <ActionIcon
                          color={copied ? 'var(--mantine-color-teal-7)' : 'gray'}
                          variant="subtle"
                          onClick={copy}
                        >
                          {copied ? <IconCheck size={22} /> : <IconCopy size={22} />}
                        </ActionIcon>
                      )}
                    </CopyButton>
                  </Group>
                  {apiUseCaseStepResponse.items.length > 0 && (
                    <UseCaseStatusComponent
                      useCaseInput={apiGetUseCaseResponse.item}
                      onUseCaseStatusChange={onUseCaseStatusChange}
                    />
                  )}
                </Group>
                <Text mt={15} mb={50} mr={200}>
                  {apiGetUseCaseResponse.item.description}
                </Text>
                <Grid>
                  {apiUseCaseStepResponse.items.length > 0 && (
                    <>
                      <Grid.Col span={4}>
                        <Fieldset legend={'Steps'}>
                          <Stepper
                            active={selectedStepNumber}
                            orientation="vertical"
                            onStepClick={onStepItemClick}
                          >
                            {apiUseCaseStepResponse.items.map((step, index) => (
                              <Stepper.Step
                                completedIcon={index + 1}
                                allowStepSelect={true}
                                label={step.title}
                                description={step.code}
                              ></Stepper.Step>
                            ))}
                            {auth.canWrite() && (
                              <Stepper.Step
                                styles={{
                                  stepLabel: {
                                    color: 'var(--mantine-color-brand-7)',
                                    borderColor: 'var(--mantine-color-brand-7)',
                                  },
                                  stepIcon: {
                                    backgroundColor: 'var(--mantine-color-brand-7)',
                                    color: 'white',
                                  },
                                }}
                                completedIcon={<IconPlus />}
                                icon={<IconPlus />}
                                label={t('newUseCaseStepCreateBtn')}
                                description={t('newUseCaseStepCreateDescription')}
                              ></Stepper.Step>
                            )}
                          </Stepper>
                        </Fieldset>
                      </Grid.Col>
                      <Grid.Col span={8}>
                        <Fieldset
                          legend={`${t('useCaseStepNumber')}${selectedStepNumber + 1}`}
                        >
                          {element(apiUseCaseStepResponse.items[selectedStepNumber])}
                        </Fieldset>
                      </Grid.Col>
                    </>
                  )}
                  {apiUseCaseStepResponse.items.length === 0 && auth.canWrite() && (
                    <Grid.Col span={12}>
                      <Fieldset mb={60}>
                        <EmptyState
                          imageName="new-use-case-step"
                          title={t('useCaseStepCreateNewTitle')}
                          text={t('useCaseStepCreateNewText')}
                          suggestion={t('useCaseStepCreateNewSuggestion')}
                          btnText={t('useCaseStepCreateNewBtn')}
                          btnHandle={newUseCaseStepOpenPanel}
                        ></EmptyState>
                      </Fieldset>
                    </Grid.Col>
                  )}
                  {apiUseCaseStepResponse.items.length === 0 && !auth.canWrite() && (
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
        <Drawer opened={newUseCaseStepPanelIsOpen} onClose={newUseCaseStepClosePanel}>
          <NewUseCaseStepComponent
            useCase={apiGetUseCaseResponse.item}
            onUseCaseStepCreated={onUseCaseStepCreated}
          />
        </Drawer>
        <Drawer
          opened={updateUseCaseStepPanelIsOpen}
          onClose={updateUseCaseStepClosePanel}
        >
          <UpdateUseCaseStepComponent
            totalItemsCount={apiUseCaseStepResponse.totalCount}
            useCase={apiGetUseCaseResponse.item}
            useCaseStep={selectedUseCaseStep}
            onUseCaseStepUpdated={onUseCaseStepUpdated}
          />
        </Drawer>
        <Modal
          opened={deleteUseCaseStepPanelIsOpen}
          onClose={deleteUseCaseStepClosePanel}
        >
          <DeleteUseCaseStepComponent
            useCaseStep={selectedUseCaseStep}
            title={t('deleteUseCaseStepTitle')}
            text={t('deleteUsecaseStepDescription')}
            confirmTextRequired={apiGetUseCaseResponse?.item.active}
            onCancel={deleteUseCaseStepClosePanel}
            onUseCaseStepDeleted={onUseCaseStepDeleted}
          ></DeleteUseCaseStepComponent>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
