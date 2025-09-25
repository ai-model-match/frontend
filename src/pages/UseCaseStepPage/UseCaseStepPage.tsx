import { EmptyState } from '@components/EmptyState';
import { Layout } from '@components/Layout';
import { PaperTitle } from '@components/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import {
  ListUseCaseStepsInputDto,
  ListUseCaseStepsOutputDto,
  UseCaseStepOrderByOptions,
} from '@dtos/useCaseStepDto';
import { UseCase } from '@entities/useCase';
import { UseCaseStep } from '@entities/useCaseStep';
import { AuthGuard } from '@guards/AuthGuard';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
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
import { OrderDir } from '@services/api.type';
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
  IconRobot,
  IconArrowRampRight,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import DeleteUseCaseStepComponent from './DeleteUseCaseStepComponent';
import NewUseCaseStepComponent from './NewUseCaseStepComponent';
import UpdateUseCaseStepComponent from './UpdateUseCaseStepComponent';
import UseCaseStatusComponent from './UseCaseStatusComponent';
import { UseCaseStepGraphComponent } from './UseCaseStepGraphComponent';

interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function UseCaseStepPage() {
  // Params
  const { id } = useParams();
  const defaultApiRequest: ListUseCaseStepsInputDto = {
    useCaseId: '',
    page: 1,
    pageSize: 200,
    orderDir: OrderDir.ASC,
    orderBy: UseCaseStepOrderByOptions.Position,
  };
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiUseCaseResponse, setApiUseCaseResponse] = useState<GetUseCaseOutputDto>();
  const [apiStepRequest, setApiStepRequest] =
    useState<ListUseCaseStepsInputDto>(defaultApiRequest);
  const [apiStepResponse, setApiStepResponse] = useState<ListUseCaseStepsOutputDto>({
    items: [],
    totalCount: 0,
    hasNext: false,
  });
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(0);
  // New Use Case Step panel status
  const [
    newUseCaseStepOpen,
    { open: newUseCaseStepActionsOpen, close: newUseCaseStepActionsClose },
  ] = useDisclosure(false);
  // Update Use Case Step panel status
  const [
    updateUseCaseStepOpen,
    { open: updateUseCaseStepActionsOpen, close: updateUseCaseStepActionsClose },
  ] = useDisclosure(false);
  // Delete Use Case Step panel status
  const [
    deleteUseCaseStepOpen,
    { open: deleteUseCaseStepActionsOpen, close: deleteUseCaseStepActionsClose },
  ] = useDisclosure(false);
  // Indicates the selected Use Case Step for edit or delete
  const [selectedUseCaseStep, setSelectedUseCaseStep] = useState<UseCaseStep | null>();

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        const data = await useCaseService.getUseCase({ id: id! });
        const stepData = await useCaseStepService.listUseCaseSteps({
          ...apiStepRequest,
          useCaseId: data.item.id,
        });
        setApiStepResponse(stepData);
        setApiUseCaseResponse(data);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout');
            break;
          case 'use-case-not-found':
            navigate('/not-found');
            break;
          default:
            navigate('/internal-server-error');
            break;
        }
      } finally {
        setPageLoaded(true);
      }
    })();
  }, [id, auth, navigate, t, apiStepRequest]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiUseCaseResponse)
      items.push({ title: apiUseCaseResponse.item.title, href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiUseCaseResponse]);

  const onUseCaseStatusChange = (useCase: UseCase) => {
    setApiUseCaseResponse({
      item: useCase,
    });
  };

  const handleUpdateRequest = (id: string) => {
    const useCaseStep = apiStepResponse?.items.find((x) => x.id === id);
    setSelectedUseCaseStep(useCaseStep);
    updateUseCaseStepActionsOpen();
  };

  const handleDeleteRequest = (id: string) => {
    const useCaseStep = apiStepResponse?.items.find((x: UseCaseStep) => x.id === id);
    setSelectedUseCaseStep(useCaseStep);
    deleteUseCaseStepActionsOpen();
  };

  const onUseCaseStepCreated = useCallback(
    (createdUseCaseStep: UseCaseStep) => {
      newUseCaseStepActionsClose();
      setApiStepRequest({ ...apiStepRequest });
      apiStepResponse.items.push(createdUseCaseStep);
      apiStepResponse.totalCount++;
      setSelectedStepNumber(createdUseCaseStep.position - 1);
    },
    [setApiStepRequest, apiStepRequest, apiStepResponse, newUseCaseStepActionsClose]
  );

  const onUseCaseStepUpdated = useCallback(() => {
    updateUseCaseStepActionsClose();
    setApiStepRequest({ ...apiStepRequest });
  }, [apiStepRequest, setApiStepRequest, updateUseCaseStepActionsClose]);

  const onUseCaseStepDeleted = useCallback(
    (id: string) => {
      deleteUseCaseStepActionsClose();
      apiStepResponse.items = apiStepResponse.items.filter((x) => x.id !== id);
      apiStepResponse.totalCount--;
      setSelectedStepNumber((prev) =>
        Math.min(prev, Math.max(0, apiStepResponse.totalCount - 1))
      );
      setApiStepRequest({ ...apiStepRequest });
    },
    [
      apiStepRequest,
      apiStepResponse,
      setApiStepRequest,
      setSelectedStepNumber,
      deleteUseCaseStepActionsClose,
    ]
  );

  const onStepItemClick = (index: number) => {
    if (index >= apiStepResponse.items.length) {
      newUseCaseStepActionsOpen();
    } else {
      setSelectedStepNumber(index);
    }
  };

  const breadcrumbItemsRender = () =>
    breadcrumbItems.map((item) => {
      if (item.href == '#') {
        return <Text size="md">{item.title}</Text>;
      } else {
        return (
          <Anchor size="md" component={NavLink} to={item.href}>
            {item.title}
          </Anchor>
        );
      }
    });

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
        <Text size="md" mt={15}>
          {item.description}
        </Text>
        <Divider my={20} />
        <UseCaseStepGraphComponent />
      </>
    );
  };

  return (
    <AuthGuard>
      <Layout>
        {pageLoaded && apiUseCaseResponse && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Group justify="space-between" align="center" gap={0} mb={0}>
                <Breadcrumbs>{breadcrumbItemsRender()}</Breadcrumbs>
                <Group justify="flex-end" align="center" gap={10} mb={0}>
                  <Button
                    variant="light"
                    leftSection={<IconArrowRampRight size={22} />}
                    onClick={() =>
                      navigate('/use-cases/' + apiUseCaseResponse.item.id + '/flows')
                    }
                  >
                    {t('useCaseFlowsAction')}
                  </Button>
                  <Button
                    variant="light"
                    leftSection={<IconRobot size={22} />}
                    onClick={() =>
                      navigate(
                        '/use-cases/' + apiUseCaseResponse.item.id + '/rollout-strategy'
                      )
                    }
                  >
                    {t('useCaseRolloutStrategyAction')}
                  </Button>
                </Group>
              </Group>
            </Paper>
          </Grid.Col>
        )}
        {pageLoaded && apiUseCaseResponse && apiStepResponse && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Group justify="space-between" align="center" gap={0} mb={0}>
                <Group gap={2}>
                  <PaperTitle
                    mb={0}
                    icon={IconTargetArrow}
                    title={apiUseCaseResponse.item.title}
                  />
                  <Code>{apiUseCaseResponse.item.code}</Code>
                  <CopyButton value={apiUseCaseResponse.item.code} timeout={1000}>
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
                {apiStepResponse.items.length > 0 && (
                  <UseCaseStatusComponent
                    useCaseInput={apiUseCaseResponse.item}
                    onUseCaseStatusChange={onUseCaseStatusChange}
                  />
                )}
              </Group>
              <Text size="md" mt={15} mb={50} mr={200}>
                {apiUseCaseResponse.item.description}
              </Text>
              <Grid>
                {apiStepResponse.items.length > 0 && (
                  <>
                    <Grid.Col span={4}>
                      <Fieldset legend={'Steps'}>
                        <Stepper
                          size="lg"
                          active={selectedStepNumber}
                          orientation="vertical"
                          onStepClick={onStepItemClick}
                        >
                          {apiStepResponse.items.map((step, index) => (
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
                        {element(apiStepResponse.items[selectedStepNumber])}
                      </Fieldset>
                    </Grid.Col>
                  </>
                )}
                {apiStepResponse.items.length === 0 && auth.canWrite() && (
                  <Grid.Col span={12}>
                    <Fieldset mb={120}>
                      <EmptyState
                        imageName="new-use-case-step"
                        title={t('useCaseStepCreateNewTitle')}
                        text={t('useCaseStepCreateNewText')}
                        suggestion={t('useCaseStepCreateNewSuggestion')}
                        btnText={t('useCaseStepCreateNewBtn')}
                        btnHandle={newUseCaseStepActionsOpen}
                      ></EmptyState>
                    </Fieldset>
                  </Grid.Col>
                )}
                {apiStepResponse.items.length === 0 && !auth.canWrite() && (
                  <Grid.Col span={12}>
                    <Fieldset mb={120}>
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
        )}
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            </Paper>
          </Grid.Col>
        )}
        {apiUseCaseResponse && (
          <Drawer
            opened={newUseCaseStepOpen}
            padding={0}
            onClose={newUseCaseStepActionsClose}
            position="right"
            offset={10}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            withCloseButton={false}
            radius="md"
          >
            <NewUseCaseStepComponent
              useCaseId={apiUseCaseResponse.item.id}
              onUseCaseStepCreated={onUseCaseStepCreated}
            />
          </Drawer>
        )}
        {apiUseCaseResponse && (
          <Drawer
            opened={updateUseCaseStepOpen}
            padding={0}
            onClose={updateUseCaseStepActionsClose}
            position="right"
            offset={10}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            withCloseButton={false}
            radius="md"
          >
            <UpdateUseCaseStepComponent
              totalItemsCount={apiStepResponse.totalCount}
              useCase={apiUseCaseResponse.item}
              useCaseStep={selectedUseCaseStep!}
              onUseCaseStepUpdated={onUseCaseStepUpdated}
            />
          </Drawer>
        )}
        <Modal
          opened={deleteUseCaseStepOpen}
          onClose={deleteUseCaseStepActionsClose}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <DeleteUseCaseStepComponent
            useCaseStep={selectedUseCaseStep!}
            title={t('deleteUseCaseStepTitle')}
            text={t('deleteUsecaseStepDescription')}
            confirmTextRequired={apiUseCaseResponse?.item.active}
            onCancel={deleteUseCaseStepActionsClose}
            onUseCaseStepDeleted={onUseCaseStepDeleted}
          ></DeleteUseCaseStepComponent>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
