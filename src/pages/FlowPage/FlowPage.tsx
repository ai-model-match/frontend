import { EmptyState } from '@components/EmptyState';
import { Layout } from '@components/Layout';
import { PaperTitle } from '@components/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { FlowOrderByOptions, ListFlowInputDto, ListFlowOutputDto } from '@dtos/flowDto';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { Flow } from '@entities/flow';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Anchor,
  Breadcrumbs,
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
import { OrderDir } from '@services/api.type';
import { flowService } from '@services/flowService';
import { useCaseService } from '@services/useCaseService';
import { IconArrowRampRight } from '@tabler/icons-react';
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
interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function FlowPage() {
  const { id } = useParams();
  const defaultApiRequest: ListFlowInputDto = {
    useCaseId: '',
    page: 1,
    pageSize: 200,
    orderDir: OrderDir.DESC,
    orderBy: FlowOrderByOptions.CurrentPct,
  };

  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // New Flow panel status
  const [newFlowOpen, { open: newFlowActionsOpen, close: newFlowActionsClose }] =
    useDisclosure(false);
  // Update Flow panel status
  const [updateFlowOpen, { open: updateFlowActionsOpen, close: updateFlowActionsClose }] =
    useDisclosure(false);
  // Delete Flow panel status
  const [deleteFlowOpen, { open: deleteFlowActionsOpen, close: deleteFlowActionsClose }] =
    useDisclosure(false);
  // Deactivate Flow panel status
  const [
    deactivateFlowOpen,
    { open: deactivateFlowActionsOpen, close: deactivateFlowActionsClose },
  ] = useDisclosure(false);
  // Activate Flow panel status
  const [
    activateFlowOpen,
    { open: activateFlowActionsOpen, close: activateFlowActionsClose },
  ] = useDisclosure(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiUseCaseResponse, setApiUseCaseResponse] = useState<GetUseCaseOutputDto>();
  const [apiFlowRequest, setApiFlowRequest] =
    useState<ListFlowInputDto>(defaultApiRequest);
  useState<ListFlowInputDto>(defaultApiRequest);
  const [apiFlowResponse, setApiFlowResponse] = useState<ListFlowOutputDto>({
    items: [],
    totalCount: 0,
    hasNext: false,
  });
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);
  // Indicates the selected flow for edit or delete
  const [selectedFlow, setSelectedFlow] = useState<Flow>();
  const interval = useInterval(() => setApiFlowRequest({ ...apiFlowRequest }), 4000);

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        const data = await useCaseService.getUseCase({ id: id! });
        const flowData = await flowService.listFlows({
          ...apiFlowRequest,
          useCaseId: data.item.id,
        });
        setApiFlowResponse(flowData);
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
  }, [id, auth, navigate, t, apiFlowRequest]);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [interval]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiUseCaseResponse)
      items.push({
        title: apiUseCaseResponse.item.title,
        href: `/use-cases/${apiUseCaseResponse.item.id}`,
      });
    items.push({ title: t('menuFlows'), href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiUseCaseResponse]);

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

  const handleUpdateRequest = (id: string) => {
    const flow = apiFlowResponse?.items.find((x) => x.id === id);
    setSelectedFlow(flow);
    updateFlowActionsOpen();
  };

  const handleDeleteRequest = (id: string) => {
    const flow = apiFlowResponse?.items.find((x) => x.id === id);
    setSelectedFlow(flow);
    deleteFlowActionsOpen();
  };

  const handleDeactivateRequest = (id: string) => {
    const flow = apiFlowResponse?.items.find((x) => x.id === id);
    setSelectedFlow(flow);
    deactivateFlowActionsOpen();
  };

  const handleActivateRequest = (id: string) => {
    const flow = apiFlowResponse?.items.find((x) => x.id === id);
    setSelectedFlow(flow);
    activateFlowActionsOpen();
  };

  const onFlowCreated = useCallback(
    (_: Flow) => {
      newFlowActionsClose();
      setApiFlowRequest((prev) => ({ ...prev }));
    },
    [setApiFlowRequest, newFlowActionsClose]
  );

  const onFlowUpdated = useCallback(() => {
    updateFlowActionsClose();
    setApiFlowRequest((prev) => ({ ...prev }));
  }, [setApiFlowRequest, updateFlowActionsClose]);

  const onFlowDeleted = useCallback(
    (id: string) => {
      deleteFlowActionsClose();
      apiFlowResponse.items = apiFlowResponse.items.filter((x) => x.id !== id);
      apiFlowResponse.totalCount--;
      setApiFlowRequest((prev) => ({ ...prev }));
    },
    [apiFlowResponse, setApiFlowRequest, deleteFlowActionsClose]
  );

  const onFlowDeactivated = useCallback(() => {
    deactivateFlowActionsClose();
    setApiFlowRequest((prev) => ({ ...prev }));
  }, [setApiFlowRequest, deactivateFlowActionsClose]);

  const onFlowActivated = useCallback(() => {
    activateFlowActionsClose();
    setApiFlowRequest((prev) => ({ ...prev }));
  }, [setApiFlowRequest, activateFlowActionsClose]);

  return (
    <AuthGuard>
      <Layout>
        {pageLoaded && apiUseCaseResponse && (
          <Grid.Col span={12}>
            <Paper p="lg">
              <Breadcrumbs>{breadcrumbItemsRender()}</Breadcrumbs>
            </Paper>
          </Grid.Col>
        )}
        <Grid.Col span={12}>
          {!pageLoaded && (
            <Paper p="lg">
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            </Paper>
          )}
          {pageLoaded &&
            apiUseCaseResponse &&
            apiFlowResponse &&
            apiFlowResponse.items.filter((x) => x.active).length > 0 && (
              <Paper p="lg" mb="lg">
                <Group justify="space-between" align="center" gap={0} mb={0}>
                  <PaperTitle
                    mb={30}
                    icon={IconArrowRampRight}
                    title={t('flowActiveTitlePage')}
                  />
                </Group>
                <Grid>
                  {apiFlowResponse.items
                    .filter((x) => x.active)
                    .map((item) => (
                      <Grid.Col span={4} key={item.id}>
                        <FlowCardComponent
                          useCase={apiUseCaseResponse.item}
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

          {pageLoaded &&
            apiUseCaseResponse &&
            apiFlowResponse &&
            apiFlowResponse.items.length > 0 && (
              <Paper p="lg" mb="lg">
                <Group justify="space-between" align="center" gap={0} mb={0}>
                  <PaperTitle
                    mb={30}
                    icon={IconArrowRampRight}
                    iconColor="red"
                    title={t('flowInactiveTitlePage')}
                  />
                </Group>
                <Grid>
                  {apiFlowResponse.items
                    .filter((x) => !x.active)
                    .map((item) => (
                      <Grid.Col span={4} key={item.id}>
                        <FlowCardComponent
                          useCase={apiUseCaseResponse.item}
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
                      <FlowNewCardComponent onClick={newFlowActionsOpen} />
                    </Grid.Col>
                  )}
                </Grid>
              </Paper>
            )}
          {pageLoaded &&
            apiUseCaseResponse &&
            apiFlowResponse &&
            apiFlowResponse.items.length === 0 && (
              <Paper p="lg">
                <Fieldset>
                  {auth.canWrite() ? (
                    <EmptyState
                      imageName="new-flow"
                      title={t('flowCreateNewTitle')}
                      text={t('flowCreateNewText')}
                      suggestion={t('flowCreateNewSuggestion')}
                      btnText={t('flowCreateNewBtn')}
                      btnHandle={newFlowActionsOpen}
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
        {apiUseCaseResponse && (
          <Drawer
            opened={newFlowOpen}
            padding={0}
            onClose={newFlowActionsClose}
            position="right"
            offset={10}
            overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            withCloseButton={false}
            radius="md"
          >
            <NewFlowComponent
              useCaseId={apiUseCaseResponse.item.id}
              onFlowCreated={onFlowCreated}
            />
          </Drawer>
        )}
        <Drawer
          opened={updateFlowOpen}
          padding={0}
          onClose={updateFlowActionsClose}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <UpdateFlowComponent flow={selectedFlow!} onFlowUpdated={onFlowUpdated} />
        </Drawer>
        {selectedFlow && (
          <>
            <Modal
              opened={deleteFlowOpen}
              onClose={deleteFlowActionsClose}
              withCloseButton={false}
              overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            >
              <DeleteFlowComponent
                flow={selectedFlow!}
                title={t('deleteFlowTitle')}
                text={t('deleteFlowDescription')}
                onCancel={deleteFlowActionsClose}
                onFlowDeleted={onFlowDeleted}
              ></DeleteFlowComponent>
            </Modal>
            <Modal
              opened={deactivateFlowOpen}
              onClose={deactivateFlowActionsClose}
              withCloseButton={false}
              overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            >
              <DeactivateFlowComponent
                flow={selectedFlow!}
                title={t('deactivateFlowTitle')}
                text={t('deactivateFlowDescription')}
                confirmTextRequired={selectedFlow!.currentServePct > 0}
                onCancel={deactivateFlowActionsClose}
                onFlowDeactivated={onFlowDeactivated}
              ></DeactivateFlowComponent>
            </Modal>
            <Modal
              opened={activateFlowOpen}
              onClose={activateFlowActionsClose}
              withCloseButton={false}
              overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
            >
              <ActivateFlowComponent
                flow={selectedFlow!}
                title={t('activateFlowTitle')}
                text={t('activateFlowDescription')}
                onCancel={activateFlowActionsClose}
                onFlowActivated={onFlowActivated}
              ></ActivateFlowComponent>
            </Modal>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
