import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import {
  defaultFlow,
  defaultListFlowApiRequest,
  defaultListFlowApiResponse,
} from '@dtos/defaultFlowDto';
import { defaultGetUseCaseApiResponse } from '@dtos/defaultUseCaseDto';
import { ListFlowInputDto, ListFlowOutputDto } from '@dtos/flowDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { Flow } from '@entities/flow';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Anchor,
  Breadcrumbs,
  Button,
  Drawer,
  Fieldset,
  Grid,
  Group,
  Loader,
  Modal,
  Paper,
  Text,
} from '@mantine/core';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { flowService } from '@services/flowService';
import { useCaseService } from '@services/useCaseService';
import {
  IconAdjustmentsHorizontal,
  IconArrowRampRight,
  IconSettingsAutomation,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import ActivateFlowComponent from './ActivateFlowComponent';
import DeactivateFlowComponent from './DeactivateFlowComponent';
import DeleteFlowComponent from './DeleteFlowComponent';
import { FlowCardComponent } from './FlowCardComponent';
import { FlowNewCardComponent } from './FlowNewCardComponent';
import NewFlowComponent from './NewFlowComponent';
import UpdateFlowComponent from './UpdateFlowComponent';
import UpdateFlowPctBulkComponent from './UpdateFlowPctBulkComponent';
interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function FlowPage() {
  const { id } = useParams();

  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [newFlowPanelIsOpen, { open: newFlowOpenPanel, close: newFlowClosePanel }] =
    useDisclosure(false);
  const [
    updateFlowPanelIsOpen,
    { open: updateFlowOpenPanel, close: updateFlowClosePanel },
  ] = useDisclosure(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [
    updateFlowBulkPanelIsOpen,
    { open: updateFlowBulkOpenPanel, close: updateFlowBulkClosePanel },
  ] = useDisclosure(false);
  const [
    deleteFlowPanelIsOpen,
    { open: deleteFlowOpenPanel, close: deleteFlowClosePanel },
  ] = useDisclosure(false);
  const [
    deactivateFlowPanelIsOpen,
    { open: deactivateFlowOpenPanel, close: deactivateFlowClosePanel },
  ] = useDisclosure(false);
  const [
    activateFlowPanelIsOpen,
    { open: activateFlowOpenPanel, close: activateFlowClosePanel },
  ] = useDisclosure(false);
  const [apiGetUseCaseResponse, setApiGetUseCaseResponse] = useState<GetUseCaseOutputDto>(
    defaultGetUseCaseApiResponse
  );
  const [apiListFlowRequest, setApiListFlowRequest] = useState<ListFlowInputDto>(
    defaultListFlowApiRequest
  );
  const [apiListFlowResponse, setApiListFlowResponse] = useState<ListFlowOutputDto>(
    defaultListFlowApiResponse
  );
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<Flow>(defaultFlow);
  const [selectedFlowsBulk, setSelectedFlowsBulk] = useState<Flow[]>([]);
  const interval = useInterval(
    () => setApiListFlowRequest({ ...apiListFlowRequest }),
    4000
  );

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        const data = await useCaseService.getUseCase({ id: id! });
        const flowData = await flowService.listFlows({
          ...apiListFlowRequest,
          useCaseId: data.item.id,
        });
        setApiListFlowResponse(flowData);
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
  }, [id, auth, navigate, t, apiListFlowRequest]);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiGetUseCaseResponse)
      items.push({
        title: apiGetUseCaseResponse.item.title,
        href: `/use-cases/${apiGetUseCaseResponse.item.id}`,
      });
    items.push({ title: t('menuFlows'), href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiGetUseCaseResponse]);

  // Handlers
  const handleUpdateRequest = (id: string) => {
    const flow = apiListFlowResponse?.items.find((x) => x.id === id);
    if (!flow) return;
    setSelectedFlow(flow);
    updateFlowOpenPanel();
  };

  const handleUpdateBulkRequest = () => {
    const flows = apiListFlowResponse?.items.filter((x) => x.active);
    setSelectedFlowsBulk(flows);
    updateFlowBulkOpenPanel();
  };

  const handleDeleteRequest = (id: string) => {
    const flow = apiListFlowResponse?.items.find((x) => x.id === id);
    if (!flow) return;
    setSelectedFlow(flow);
    deleteFlowOpenPanel();
  };

  const handleDeactivateRequest = (id: string) => {
    const flow = apiListFlowResponse?.items.find((x) => x.id === id);
    if (!flow) return;
    setSelectedFlow(flow);
    deactivateFlowOpenPanel();
  };

  const handleActivateRequest = (id: string) => {
    const flow = apiListFlowResponse?.items.find((x) => x.id === id);
    if (!flow) return;
    setSelectedFlow(flow);
    activateFlowOpenPanel();
  };

  const onFlowCreated = useCallback(
    (_: Flow) => {
      newFlowClosePanel();
      setApiListFlowRequest((prev) => ({ ...prev }));
    },
    [setApiListFlowRequest, newFlowClosePanel]
  );

  const onFlowUpdated = useCallback(() => {
    updateFlowClosePanel();
    setApiListFlowRequest((prev) => ({ ...prev }));
  }, [setApiListFlowRequest, updateFlowClosePanel]);

  const onFlowsUpdated = useCallback(() => {
    updateFlowBulkClosePanel();
    setApiListFlowRequest((prev) => ({ ...prev }));
  }, [setApiListFlowRequest, updateFlowBulkClosePanel]);

  const onFlowDeleted = useCallback(
    (id: string) => {
      deleteFlowClosePanel();
      apiListFlowResponse.items = apiListFlowResponse.items.filter((x) => x.id !== id);
      apiListFlowResponse.totalCount--;
      setApiListFlowRequest((prev) => ({ ...prev }));
    },
    [apiListFlowResponse, setApiListFlowRequest, deleteFlowClosePanel]
  );

  const onFlowDeactivated = useCallback(() => {
    deactivateFlowClosePanel();
    setApiListFlowRequest((prev) => ({ ...prev }));
  }, [setApiListFlowRequest, deactivateFlowClosePanel]);

  const onFlowActivated = useCallback(() => {
    activateFlowClosePanel();
    setApiListFlowRequest((prev) => ({ ...prev }));
  }, [setApiListFlowRequest, activateFlowClosePanel]);

  // Content
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
                  <Breadcrumbs>{breadcrumbItemsRender()}</Breadcrumbs>
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
              </Paper>
            </Grid.Col>
            <Grid.Col span={12}>
              {apiListFlowResponse.items.filter((x) => x.active).length > 0 && (
                <Paper mb="lg">
                  <Group justify="space-between" align="baseline" gap={0} mb={0}>
                    <PaperTitle
                      mb={30}
                      icon={IconArrowRampRight}
                      title={t('flowActiveTitlePage')}
                    />
                    {auth.canWrite() && (
                      <Button
                        variant="light"
                        leftSection={<IconAdjustmentsHorizontal size={22} />}
                        color="orange"
                        onClick={handleUpdateBulkRequest}
                      >
                        {t('flowUpdatePctBulkBtn')}
                      </Button>
                    )}
                  </Group>
                  <Grid>
                    {apiListFlowResponse.items
                      .filter((x) => x.active)
                      .map((item) => (
                        <Grid.Col span={4} key={item.id}>
                          <FlowCardComponent
                            useCase={apiGetUseCaseResponse.item}
                            flow={item}
                            handleUpdateRequest={handleUpdateRequest}
                            handleDeleteRequest={handleDeleteRequest}
                            handleActivateRequest={handleActivateRequest}
                            handleDeactivateRequest={handleDeactivateRequest}
                          />
                        </Grid.Col>
                      ))}
                  </Grid>
                </Paper>
              )}

              {apiListFlowResponse.items.length > 0 && (
                <Paper mb="lg">
                  <Group justify="space-between" align="center" gap={0} mb={0}>
                    <PaperTitle
                      mb={30}
                      icon={IconArrowRampRight}
                      iconColor="red"
                      title={t('flowInactiveTitlePage')}
                    />
                  </Group>
                  <Grid>
                    {apiListFlowResponse.items
                      .filter((x) => !x.active)
                      .map((item) => (
                        <Grid.Col span={4} key={item.id}>
                          <FlowCardComponent
                            useCase={apiGetUseCaseResponse.item}
                            flow={item}
                            handleUpdateRequest={handleUpdateRequest}
                            handleDeleteRequest={handleDeleteRequest}
                            handleActivateRequest={handleActivateRequest}
                            handleDeactivateRequest={handleDeactivateRequest}
                          />
                        </Grid.Col>
                      ))}
                    {auth.canWrite() && (
                      <Grid.Col span={4} key={'new-flow-id'}>
                        <FlowNewCardComponent onClick={newFlowOpenPanel} />
                      </Grid.Col>
                    )}
                  </Grid>
                </Paper>
              )}
              {apiListFlowResponse.items.length === 0 && (
                <Paper>
                  <Fieldset>
                    {auth.canWrite() ? (
                      <EmptyState
                        imageName="new-flow"
                        title={t('flowCreateNewTitle')}
                        text={t('flowCreateNewText')}
                        suggestion={t('flowCreateNewSuggestion')}
                        btnText={t('flowCreateNewBtn')}
                        btnHandle={newFlowOpenPanel}
                      ></EmptyState>
                    ) : (
                      <EmptyState
                        imageName="new-flow"
                        title={t('flowCreateNewTitleDisabled')}
                        text={t('flowCreateNewTextDisabled')}
                      ></EmptyState>
                    )}
                  </Fieldset>
                </Paper>
              )}
            </Grid.Col>
          </>
        )}
        <Drawer
          opened={newFlowPanelIsOpen}
          padding={0}
          onClose={newFlowClosePanel}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <NewFlowComponent
            useCase={apiGetUseCaseResponse.item}
            onFlowCreated={onFlowCreated}
          />
        </Drawer>
        <Drawer
          opened={updateFlowPanelIsOpen}
          padding={0}
          onClose={updateFlowClosePanel}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <UpdateFlowComponent flow={selectedFlow} onFlowUpdated={onFlowUpdated} />
        </Drawer>
        <Drawer
          opened={updateFlowBulkPanelIsOpen}
          padding={0}
          onClose={updateFlowBulkClosePanel}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <UpdateFlowPctBulkComponent
            useCase={apiGetUseCaseResponse.item}
            flows={selectedFlowsBulk}
            onFlowsUpdated={onFlowsUpdated}
          />
        </Drawer>
        <Modal
          opened={deleteFlowPanelIsOpen}
          onClose={deleteFlowClosePanel}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <DeleteFlowComponent
            flow={selectedFlow}
            title={t('deleteFlowTitle')}
            text={t('deleteFlowDescription')}
            onCancel={deleteFlowClosePanel}
            onFlowDeleted={onFlowDeleted}
          ></DeleteFlowComponent>
        </Modal>
        <Modal
          opened={deactivateFlowPanelIsOpen}
          onClose={deactivateFlowClosePanel}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <DeactivateFlowComponent
            flow={selectedFlow}
            title={t('deactivateFlowTitle')}
            text={t('deactivateFlowDescription')}
            confirmTextRequired={selectedFlow!.currentServePct > 0}
            onCancel={deactivateFlowClosePanel}
            onFlowDeactivated={onFlowDeactivated}
          ></DeactivateFlowComponent>
        </Modal>
        <Modal
          opened={activateFlowPanelIsOpen}
          onClose={activateFlowClosePanel}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <ActivateFlowComponent
            flow={selectedFlow}
            title={t('activateFlowTitle')}
            text={t('activateFlowDescription')}
            onCancel={activateFlowClosePanel}
            onFlowActivated={onFlowActivated}
          ></ActivateFlowComponent>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
