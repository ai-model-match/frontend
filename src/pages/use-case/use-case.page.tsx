import { Box, Drawer, Fieldset, Grid, Group, Loader, Modal, Pagination, Paper, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowFork, IconPlus } from '@tabler/icons-react';

import equal from 'fast-deep-equal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/empty-state/empty-state';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { getErrorMessage } from '../../core/err/err';
import ColumnUseCaseComponent from './components/column-use-case.component';
import DeleteUseCaseComponent from './components/delete-use-case.component';
import NewUseCaseComponent from './components/new-use-case.component';
import RowUseCaseComponent from './components/row-use-case.component';
import UpdateUseCaseComponent from './components/update-use-case.component';
import {
  callListUseCaseApi,
  listUseCaseInputDto,
  listUseCaseOutputDto,
  orderByOptions,
  useCaseDto,
} from './use-case.api';

export default function UseCasePage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const [defaultApiRequest] = useState<listUseCaseInputDto>({
    page: 1,
    pageSize: 5,
    orderDir: 'desc',
    orderBy: 'updated_at',
  });

  // New Use Case panel status
  const [newUseCaseOpen, { open: newUseCaseActionsOpen, close: newUseCaseActionsClose }] = useDisclosure(false);
  // Update Use Case panel status
  const [updateUseCaseOpen, { open: updateUseCaseActionsOpen, close: updateUseCaseActionsClose }] =
    useDisclosure(false);
  // Delete Use Case panel status
  const [deleteUseCaseOpen, { open: deleteUseCaseActionsOpen, close: deleteUseCaseActionsClose }] =
    useDisclosure(false);
  // Indicates if the first load happended
  const [pageLoaded, setPageLoaded] = useState(false);
  // Indicates if the API is loading, the current request and current response
  const [apiloading, setApiLoading] = useState(false);
  const [apiRequest, setApiRequest] = useState<listUseCaseInputDto>(defaultApiRequest);
  const [apiResponse, setApiResponse] = useState<listUseCaseOutputDto>({
    items: [],
    totalCount: 0,
    hasNext: false,
  });
  // Indicates the selected use Case for edit or delete
  const [selectedUseCase, setSelectedUseCase] = useState<useCaseDto | null>();
  // Indicates the search key value (could be different compared to API Request due to constrains on length)
  const [searchKeyValue, setSearchKeyValue] = useState<string>();

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        setApiLoading(true);
        const data = await callListUseCaseApi(apiRequest);
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
    (useCase: useCaseDto) => {
      newUseCaseActionsClose();
      navigate(`/use-cases/${useCase.id}/steps`, { replace: true });
    },
    [navigate, newUseCaseActionsClose],
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
    const orderBy = newValue ? 'relevance' : 'updated_at';
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
        orderDir: dir as 'asc' | 'desc',
        orderBy: field as orderByOptions,
      });
    },
    [setApiRequest, apiRequest],
  );

  const isFilterApplied = (): boolean => {
    return equal(apiRequest, defaultApiRequest);
  };

  const hasNoFilteredResults = (): boolean => {
    return !!(
      !apiloading &&
      apiResponse &&
      apiResponse.items.length == 0 &&
      (apiResponse.totalCount != 0 || !isFilterApplied())
    );
  };

  const hasNoResults = (): boolean => {
    return !!(!apiloading && apiResponse && apiResponse.totalCount == 0 && isFilterApplied());
  };

  // Content
  return (
    <AuthGuard>
      <LayoutComponent>
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
                  icon={IconArrowFork}
                  title={t('useCaseTitlePage')}
                  searchValue={searchKeyValue}
                  showSearch={!hasNoResults()}
                  onSearchChange={onSearchTextChanged}
                  btnIcon={auth.canWrite() ? IconPlus : undefined}
                  onBtnClick={auth.canWrite() ? newUseCaseActionsOpen : undefined}
                />
                {!hasNoResults() && (
                  <Box mb={'xl'}>
                    <Fieldset>
                      <Table>
                        <ColumnUseCaseComponent sortBy={apiRequest.orderBy} onSortingChanged={onSortingChanged} />
                        {!hasNoFilteredResults() && (
                          <Table.Tbody>
                            {apiResponse.items.map((useCase) => (
                              <RowUseCaseComponent
                                key={useCase.id}
                                useCase={useCase}
                                handleUpdateRequest={handleUpdateRequest}
                                handleDeleteRequest={handleDeleteRequest}
                              />
                            ))}
                          </Table.Tbody>
                        )}
                      </Table>
                      {hasNoFilteredResults() && (
                        <EmptyState
                          image="no-results"
                          title={t('useCaseNoResultsTitle')}
                          btnText={t('useCaseNoResultsBtn')}
                          btnHandle={onFilterReset}
                        ></EmptyState>
                      )}
                    </Fieldset>
                    <Group justify="center" align="center">
                      {apiResponse && apiResponse.totalCount > 0 && (
                        <Pagination
                          mt={50}
                          total={Math.ceil(apiResponse.totalCount / apiRequest.pageSize)}
                          value={apiRequest.page}
                          size={'sm'}
                          radius={'sm'}
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
                        image="new-use-case"
                        title={t('useCaseCreateNewTitle')}
                        text={t('useCaseCreateNewText')}
                        suggestion={t('useCaseCreateNewSuggestion')}
                        btnText={t('useCaseCreateNewBtn')}
                        btnHandle={newUseCaseActionsOpen}
                      ></EmptyState>
                    ) : (
                      <EmptyState
                        image="new-use-case"
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
          <UpdateUseCaseComponent useCase={selectedUseCase!} onUseCaseUpdated={onUseCaseUpdated} />
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
            text={t('deleteUsecaseDescription')}
            confirmTextRequired
            onCancel={deleteUseCaseActionsClose}
            onUseCaseDeleted={onUseCaseDeleted}
          ></DeleteUseCaseComponent>
        </Modal>
      </LayoutComponent>
    </AuthGuard>
  );
}
