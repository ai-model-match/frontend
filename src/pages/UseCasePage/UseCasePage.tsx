import { EmptyState } from '@components/EmptyState';
import { Layout } from '@components/Layout';
import { PaperTitle } from '@components/PaperTitle';
import { useAuth } from '@context/AuthContext';
import {
  ListUseCaseInputDto,
  ListUseCaseOutputDto,
  UseCaseOrderByOptions,
} from '@dtos/useCaseDto';
import { UseCase } from '@entities/useCase';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Box,
  Drawer,
  Fieldset,
  Grid,
  Group,
  Loader,
  Modal,
  Pagination,
  Paper,
  Table,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { OrderDir } from '@services/api.type';
import { useCaseService } from '@services/useCaseService';
import { IconTargetArrow, IconPlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import equal from 'fast-deep-equal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ColumnUseCaseComponent from './ColumnUseCaseComponent';
import DeleteUseCaseComponent from './DeleteUseCaseComponent';
import NewUseCaseComponent from './NewUseCaseComponent';
import RowUseCaseComponent from './RowUseCaseComponent';
import UpdateUseCaseComponent from './UpdateUseCaseComponent';

export default function UseCasePage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const [defaultApiRequest] = useState<ListUseCaseInputDto>({
    page: 1,
    pageSize: 5,
    orderDir: OrderDir.DESC,
    orderBy: UseCaseOrderByOptions.UpdatedAt,
  });

  // New Use Case panel status
  const [newUseCaseOpen, { open: newUseCaseActionsOpen, close: newUseCaseActionsClose }] =
    useDisclosure(false);
  // Update Use Case panel status
  const [
    updateUseCaseOpen,
    { open: updateUseCaseActionsOpen, close: updateUseCaseActionsClose },
  ] = useDisclosure(false);
  // Delete Use Case panel status
  const [
    deleteUseCaseOpen,
    { open: deleteUseCaseActionsOpen, close: deleteUseCaseActionsClose },
  ] = useDisclosure(false);
  // Indicates if the first load happended
  const [pageLoaded, setPageLoaded] = useState(false);
  // Indicates if the API is loading, the current request and current response
  const [apiLoading, setApiLoading] = useState(false);
  const [apiRequest, setApiRequest] = useState<ListUseCaseInputDto>(defaultApiRequest);
  const [apiResponse, setApiResponse] = useState<ListUseCaseOutputDto>({
    items: [],
    totalCount: 0,
    hasNext: false,
  });
  // Indicates the selected use Case for edit or delete
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>();
  // Indicates the search key value (could be different compared to API Request due to constrains on length)
  const [searchKeyValue, setSearchKeyValue] = useState<string>();

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        setApiLoading(true);
        const data = await useCaseService.listUseCases(apiRequest);
        setApiResponse(data);
        setApiLoading(false);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout');
            break;
          default:
            navigate('/internal-server-error');
            break;
        }
      } finally {
        setApiLoading(false);
        setPageLoaded(true);
      }
    })();
  }, [auth.loaded, navigate, apiRequest]);

  const handleGoToFlowsRequest = (id: string) => {
    navigate(`/use-cases/${id}/flows`, { replace: true });
  };

  const handleUpdateRequest = (id: string) => {
    const useCase = apiResponse?.items.find((x) => x.id === id);
    setSelectedUseCase(useCase);
    updateUseCaseActionsOpen();
  };

  const handleDeleteRequest = (id: string) => {
    const useCase = apiResponse?.items.find((x) => x.id === id);
    setSelectedUseCase(useCase);
    deleteUseCaseActionsOpen();
  };

  const onUseCaseCreated = useCallback(
    (useCase: UseCase) => {
      newUseCaseActionsClose();
      navigate(`/use-cases/${useCase.id}`, { replace: true });
    },
    [navigate, newUseCaseActionsClose]
  );

  const onUseCaseUpdated = useCallback(() => {
    updateUseCaseActionsClose();
    setApiRequest({ ...apiRequest });
  }, [apiRequest, setApiRequest, updateUseCaseActionsClose]);

  const onUseCaseDeleted = useCallback(() => {
    deleteUseCaseActionsClose();
    // Check if we need to go back of 1 page or reset all filters after the deletion
    const totalItems = apiResponse.items.length - 1;
    const maxPage = Math.ceil(totalItems / apiRequest.pageSize);
    const newPage = Math.min(apiRequest.page, maxPage);
    if (newPage < 1) {
      setApiRequest(defaultApiRequest);
      setSearchKeyValue('');
    } else {
      setApiRequest({ ...apiRequest, page: newPage });
    }
  }, [apiRequest, apiResponse.items, defaultApiRequest, deleteUseCaseActionsClose]);

  const onPageSelected = (selected: number) => {
    setApiRequest({
      ...apiRequest,
      page: selected,
    });
  };

  const onFilterReset = () => {
    setApiRequest(defaultApiRequest);
    setSearchKeyValue('');
  };

  const onSearchTextChanged = (value: string | undefined) => {
    const newValue = value !== undefined && value.length >= 3 ? value : undefined;
    setSearchKeyValue(value);
    const orderBy = newValue
      ? UseCaseOrderByOptions.Relevance
      : UseCaseOrderByOptions.UpdatedAt;
    setApiRequest((prev) => {
      if (prev.searchKey != newValue) {
        return {
          ...defaultApiRequest,
          orderBy: orderBy,
          searchKey: newValue,
        };
      } else {
        return prev;
      }
    });
  };

  const onSortingChanged = useCallback(
    (field: string, dir: string) => {
      setApiRequest({
        ...apiRequest,
        orderDir: dir as OrderDir,
        orderBy: field as UseCaseOrderByOptions,
      });
    },
    [setApiRequest, apiRequest]
  );

  const isFilterApplied = (): boolean => {
    return equal(apiRequest, defaultApiRequest);
  };

  const hasNoFilteredResults = (): boolean => {
    return !!(
      !apiLoading &&
      apiResponse &&
      apiResponse.items.length == 0 &&
      (apiResponse.totalCount != 0 || !isFilterApplied())
    );
  };

  const hasNoResults = (): boolean => {
    return !!(
      !apiLoading &&
      apiResponse &&
      apiResponse.totalCount == 0 &&
      isFilterApplied()
    );
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        <Grid.Col span={12}>
          <Paper p="lg">
            {!pageLoaded && (
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            )}
            {pageLoaded && (
              <Box>
                <PaperTitle
                  mb={30}
                  icon={IconTargetArrow}
                  title={t('useCaseTitlePage')}
                  searchValue={searchKeyValue}
                  showSearch={!hasNoResults()}
                  onSearchChange={onSearchTextChanged}
                  btnIcon={auth.canWrite() && !hasNoResults() ? IconPlus : undefined}
                  onBtnClick={auth.canWrite() ? newUseCaseActionsOpen : undefined}
                />
                {!hasNoResults() && (
                  <Box mb={'xl'}>
                    <Fieldset>
                      <Table>
                        <ColumnUseCaseComponent
                          sortBy={apiRequest.orderBy}
                          onSortingChanged={onSortingChanged}
                        />
                        {!hasNoFilteredResults() && (
                          <Table.Tbody>
                            {apiResponse.items.map((useCase) => (
                              <RowUseCaseComponent
                                key={useCase.id}
                                useCase={useCase}
                                handleGoToFlowsRequest={handleGoToFlowsRequest}
                                handleUpdateRequest={handleUpdateRequest}
                                handleDeleteRequest={handleDeleteRequest}
                              />
                            ))}
                          </Table.Tbody>
                        )}
                      </Table>
                      {hasNoFilteredResults() && (
                        <EmptyState
                          imageName="no-results"
                          title={t('useCaseNoResultsTitle')}
                          btnText={t('useCaseNoResultsBtn')}
                          btnHandle={onFilterReset}
                        ></EmptyState>
                      )}
                    </Fieldset>
                    <Group justify="center" align="center">
                      {apiResponse && apiResponse.totalCount > 0 && (
                        <Pagination
                          mt={40}
                          total={Math.ceil(apiResponse.totalCount / apiRequest.pageSize)}
                          value={apiRequest.page}
                          size={'md'}
                          onChange={onPageSelected}
                        />
                      )}
                    </Group>
                  </Box>
                )}
                {hasNoResults() && (
                  <Fieldset>
                    {auth.canWrite() ? (
                      <EmptyState
                        imageName="new-use-case"
                        title={t('useCaseCreateNewTitle')}
                        text={t('useCaseCreateNewText')}
                        suggestion={t('useCaseCreateNewSuggestion')}
                        btnText={t('useCaseCreateNewBtn')}
                        btnHandle={newUseCaseActionsOpen}
                      ></EmptyState>
                    ) : (
                      <EmptyState
                        imageName="new-use-case"
                        title={t('useCaseCreateNewTitleDisabled')}
                        text={t('useCaseCreateNewTextDisabled')}
                      ></EmptyState>
                    )}
                  </Fieldset>
                )}
              </Box>
            )}
          </Paper>
        </Grid.Col>
        <Drawer
          opened={newUseCaseOpen}
          padding={0}
          onClose={newUseCaseActionsClose}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <NewUseCaseComponent onUseCaseCreated={onUseCaseCreated} />
        </Drawer>
        <Drawer
          opened={updateUseCaseOpen}
          padding={0}
          onClose={updateUseCaseActionsClose}
          position="right"
          offset={10}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          withCloseButton={false}
          radius="md"
        >
          <UpdateUseCaseComponent
            useCase={selectedUseCase!}
            onUseCaseUpdated={onUseCaseUpdated}
          />
        </Drawer>
        <Modal
          opened={deleteUseCaseOpen}
          onClose={deleteUseCaseActionsClose}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <DeleteUseCaseComponent
            useCase={selectedUseCase!}
            title={t('deleteUseCaseTitle')}
            text={t('deleteUseCaseDescription')}
            confirmTextRequired
            onCancel={deleteUseCaseActionsClose}
            onUseCaseDeleted={onUseCaseDeleted}
          ></DeleteUseCaseComponent>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
