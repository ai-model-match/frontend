import { EmptyState } from '@components/EmptyState';
import { LineChart } from '@mantine/charts';
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
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
import { IconArrowFork, IconCheck, IconCopy, IconPencil, IconPlus, IconRoute, IconTrash } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import DeleteUseCaseStepComponent from './components/delete-use-case-step.component';
import NewUseCaseStepComponent from './components/new-use-case-step.component';
import UpdateUseCaseStepComponent from './components/update-use-case-step.component';
import UseCaseStatusComponent from './components/use-case-status.component';
import {
  callGetUseCaseApi,
  callListUseCaseStepsApi,
  getUseCaseOutputDto,
  listUseCaseStepsInputDto,
  listUseCaseStepsOutputDto,
  useCaseDto,
  useCaseStepDto,
} from './use-case-step.api';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { getErrorMessage } from '../../core/err/err';

interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function UseCaseStepPage() {
  // Params
  const { id } = useParams();
  const defaultApiRequest: listUseCaseStepsInputDto = {
    useCaseId: '',
    page: 1,
    pageSize: 200,
    orderDir: 'asc',
    orderBy: 'position',
    searchKey: null,
  };
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiUseCaseResponse, setApiUseCaseResponse] = useState<getUseCaseOutputDto>();
  const [apiStepRequest, setApiStepRequest] = useState<listUseCaseStepsInputDto>(defaultApiRequest);
  const [apiStepResponse, setApiStepResponse] = useState<listUseCaseStepsOutputDto>({
    items: [],
    totalCount: 0,
    hasNext: false,
  });
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [selectedStepNumber, setSelectedStepNumber] = useState<number>(0);
  // New Use Case Step panel status
  const [newUseCaseStepOpen, { open: newUseCaseStepActionsOpen, close: newUseCaseStepActionsClose }] =
    useDisclosure(false);
  // Update Use Case Step panel status
  const [updateUseCaseStepOpen, { open: updateUseCaseStepActionsOpen, close: updateUseCaseStepActionsClose }] =
    useDisclosure(false);
  // Delete Use Case Step panel status
  const [deleteUseCaseStepOpen, { open: deleteUseCaseStepActionsOpen, close: deleteUseCaseStepActionsClose }] =
    useDisclosure(false);
  // Indicates the selected Use Case Step for edit or delete
  const [selectedUseCaseStep, setSelectedUseCaseStep] = useState<useCaseStepDto | null>();

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        const data = await callGetUseCaseApi({ id: id! });
        const stepData = await callListUseCaseStepsApi({
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
    if (apiUseCaseResponse) items.push({ title: apiUseCaseResponse.item.title, href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiUseCaseResponse]);

  const onUseCaseStatusChange = (useCase: useCaseDto) => {
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
    const useCaseStep = apiStepResponse?.items.find((x) => x.id === id);
    setSelectedUseCaseStep(useCaseStep);
    deleteUseCaseStepActionsOpen();
  };

  const onUseCaseStepCreated = useCallback(
    (createdUseCaseStep: useCaseStepDto) => {
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
      setSelectedStepNumber((prev) => Math.min(prev, Math.max(0, apiStepResponse.totalCount - 1)));
      setApiStepRequest({ ...apiStepRequest });
    },
    [apiStepRequest, apiStepResponse, setApiStepRequest, setSelectedStepNumber, deleteUseCaseStepActionsClose]
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
        return <Text size="sm">{item.title}</Text>;
      } else {
        return (
          <Anchor size="sm" component={NavLink} to={item.href}>
            {item.title}
          </Anchor>
        );
      }
    });

  const element = (item: useCaseStepDto) => {
    return (
      <>
        <Group justify="space-between">
          <Group gap={2} wrap="nowrap">
            <PaperTitle mb={0} icon={IconRoute} title={item.title} />
            <Code>{item.code}</Code>
            <CopyButton value={item.code} timeout={1000}>
              {({ copied, copy }) => (
                <ActionIcon color={copied ? 'var(--mantine-color-teal-7)' : 'gray'} variant="subtle" onClick={copy}>
                  {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </ActionIcon>
              )}
            </CopyButton>
          </Group>
          <Group gap={0} wrap="nowrap">
            {auth.canWrite() && (
              <Tooltip withArrow style={{ fontSize: '12px' }} label={t('useCaseStepUpdateAction')}>
                <ActionIcon variant="subtle" onClick={() => handleUpdateRequest(item.id)}>
                  <IconPencil size={18} />
                </ActionIcon>
              </Tooltip>
            )}
            {auth.canWrite() && (
              <Tooltip withArrow style={{ fontSize: '12px' }} label={t('useCaseStepDeleteAction')}>
                <ActionIcon color="red" variant="subtle" onClick={() => handleDeleteRequest(item.id)}>
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
        <Text size="sm" mt={15}>
          {item.description}
        </Text>
        <Divider my={20} />
        <LineChart
          h={300}
          w={500}
          withLegend
          data={[
            {
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              Requests: 2890,
              UseCaseRequests: 3503,
            },
            {
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              Requests: 2103,
              UseCaseRequests: 4301,
            },
            {
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              Requests: 4532,
              UseCaseRequests: 6291,
            },
            {
              date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }),
              Requests: 2991,
              UseCaseRequests: 5399,
            },
          ]}
          dataKey="date"
          series={[
            { name: 'Requests', label: 'Step Req.', color: 'brand.6' },
            {
              name: 'UseCaseRequests',
              label: 'Use Case Req.',
              color: 'red.6',
              strokeDasharray: '5 5',
            },
          ]}
          curveType="bump"
          tickLine="xy"
          gridAxis="y"
        />
      </>
    );
  };

  return (
    <AuthGuard>
      <LayoutComponent>
        {pageLoaded && apiUseCaseResponse && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Breadcrumbs>{breadcrumbItemsRender()}</Breadcrumbs>
            </Paper>
          </Grid.Col>
        )}
        {pageLoaded && apiUseCaseResponse && apiStepResponse && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Group justify="space-between" align="center" gap={0} mb={30}>
                <Group gap={2}>
                  <PaperTitle mb={0} icon={IconArrowFork} title={apiUseCaseResponse.item.title} />
                  <Code>{apiUseCaseResponse.item.code}</Code>
                  <CopyButton value={apiUseCaseResponse.item.code} timeout={1000}>
                    {({ copied, copy }) => (
                      <ActionIcon
                        color={copied ? 'var(--mantine-color-teal-7)' : 'gray'}
                        variant="subtle"
                        onClick={copy}
                      >
                        {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                      </ActionIcon>
                    )}
                  </CopyButton>
                </Group>
                {apiStepResponse.items.length > 0 && (
                  <UseCaseStatusComponent uc={apiUseCaseResponse.item} onUseCaseStatusChange={onUseCaseStatusChange} />
                )}
              </Group>
              <Grid>
                {apiStepResponse.items.length > 0 && (
                  <>
                    <Grid.Col span={4}>
                      <Fieldset legend={'Steps'}>
                        <Stepper active={selectedStepNumber} orientation="vertical" onStepClick={onStepItemClick}>
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
                      <Fieldset legend={`${t('useCaseStepNumber')}${selectedStepNumber + 1}`}>
                        {element(apiStepResponse.items[selectedStepNumber])}
                      </Fieldset>
                    </Grid.Col>
                  </>
                )}
                {apiStepResponse.items.length === 0 && auth.canWrite() && (
                  <Grid.Col span={12}>
                    <Fieldset mb={120}>
                      <EmptyState
                        image="new-use-case-step"
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
                        image="new-use-case-step"
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
      </LayoutComponent>
    </AuthGuard>
  );
}
