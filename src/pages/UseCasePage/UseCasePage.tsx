import { EmptyState } from '@components/EmptyState/EmptyState';
import { Layout } from '@components/Layout/Layout';
import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import {
  defaultListUseCaseApiRequest,
  defaultListUseCaseApiResponse,
  defaultUseCase,
} from '@dtos/defaultUseCaseDto';
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
import { IconPlus, IconTemplate } from '@tabler/icons-react';
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

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [
    newUseCasePanelIsOpen,
    { open: newUseCaseOpenPanel, close: newUseCaseClosePanel },
  ] = useDisclosure(false);
  const [
    updateUseCasePanelIsOpen,
    { open: updateUseCaseOpenPanel, close: updateUseCaseClosePanel },
  ] = useDisclosure(false);
  const [
    deleteUseCasePanelIsOpen,
    { open: deleteUseCaseOpenPanel, close: deleteUseCaseClosePanel },
  ] = useDisclosure(false);

  const [listUseCaseApiRequest, setListUseCaseApiRequest] = useState<ListUseCaseInputDto>(
    defaultListUseCaseApiRequest
  );
  const [listUseCaseApiResponse, setListUseCaseApiResponse] =
    useState<ListUseCaseOutputDto>(defaultListUseCaseApiResponse);

  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>(defaultUseCase);
  const [searchKeyValue, setSearchKeyValue] = useState<string>();

  // Effects
  useEffect(() => {
    (async () => {
      try {
        setApiLoading(true);
        const data = await useCaseService.listUseCases(listUseCaseApiRequest);
        setListUseCaseApiResponse(data);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          default:
            navigate('/internal-server-error', { replace: true });
            break;
        }
      } finally {
        setApiLoading(false);
        setPageLoaded(true);
      }
    })();
  }, [navigate, listUseCaseApiRequest]);

  // Handlers
  const handleGoToFlowsRequest = (id: string) => {
    navigate(`/use-cases/${id}/flows`);
  };

  const handleGoToRolloutRequest = (id: string) => {
    navigate(`/use-cases/${id}/rollout-strategy`);
  };

  const handleUpdateRequest = (id: string) => {
    const useCase = listUseCaseApiResponse?.items.find((x) => x.id === id);
    if (!useCase) return;
    setSelectedUseCase(useCase);
    updateUseCaseOpenPanel();
  };

  const handleDeleteRequest = (id: string) => {
    const useCase = listUseCaseApiResponse?.items.find((x) => x.id === id);
    if (!useCase) return;
    setSelectedUseCase(useCase);
    deleteUseCaseOpenPanel();
  };

  const onUseCaseCreated = useCallback(
    (useCase: UseCase) => {
      newUseCaseClosePanel();
      navigate(`/use-cases/${useCase.id}`);
    },
    [navigate, newUseCaseClosePanel]
  );

  const onUseCaseUpdated = useCallback(() => {
    updateUseCaseClosePanel();
    setListUseCaseApiRequest({ ...listUseCaseApiRequest });
  }, [listUseCaseApiRequest, setListUseCaseApiRequest, updateUseCaseClosePanel]);

  const onUseCaseDeleted = useCallback(() => {
    deleteUseCaseClosePanel();
    // Check if we need to go back of 1 page or reset all filters after the deletion
    const totalItems = listUseCaseApiResponse.items.length - 1;
    const maxPage = Math.ceil(totalItems / listUseCaseApiRequest.pageSize);
    const newPage = Math.min(listUseCaseApiRequest.page, maxPage);
    if (newPage < 1) {
      setListUseCaseApiRequest({ ...defaultListUseCaseApiRequest });
      setSearchKeyValue(undefined);
    } else {
      setListUseCaseApiRequest({ ...listUseCaseApiRequest, page: newPage });
    }
  }, [listUseCaseApiRequest, listUseCaseApiResponse.items, deleteUseCaseClosePanel]);

  const onPageSelected = (selected: number) => {
    setListUseCaseApiRequest({
      ...listUseCaseApiRequest,
      page: selected,
    });
  };

  const onFilterReset = () => {
    setListUseCaseApiRequest(defaultListUseCaseApiRequest);
    setSearchKeyValue(undefined);
  };

  const onSearchTextChanged = (value?: string) => {
    const newValue = !!value && value.length >= 3 ? value : undefined;
    setSearchKeyValue(value);
    const orderBy = newValue
      ? UseCaseOrderByOptions.Relevance
      : UseCaseOrderByOptions.UpdatedAt;
    setListUseCaseApiRequest((prev) => {
      if (prev.searchKey != newValue) {
        return {
          ...defaultListUseCaseApiRequest,
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
      setListUseCaseApiRequest({
        ...listUseCaseApiRequest,
        orderDir: dir as OrderDir,
        orderBy: field as UseCaseOrderByOptions,
      });
    },
    [setListUseCaseApiRequest, listUseCaseApiRequest]
  );

  // Content
  const isFilterApplied = (): boolean => {
    return equal(listUseCaseApiRequest, defaultListUseCaseApiRequest);
  };
  const hasNoFilteredResults = (): boolean => {
    return (
      !apiLoading &&
      listUseCaseApiResponse.items.length == 0 &&
      (listUseCaseApiResponse.totalCount != 0 || !isFilterApplied())
    );
  };
  const hasNoResults = (): boolean => {
    return !apiLoading && listUseCaseApiResponse.totalCount == 0 && isFilterApplied();
  };

  return (
    <AuthGuard>
      <Layout>
        <Grid.Col span={12}>
          <Paper>
            {!pageLoaded && (
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            )}
            {pageLoaded && (
              <Box>
                <PaperTitle
                  mb={30}
                  icon={IconTemplate}
                  title={t('useCaseTitlePage')}
                  searchValue={searchKeyValue}
                  showSearch={!hasNoResults()}
                  onSearchChange={onSearchTextChanged}
                  btnIcon={auth.canWrite() && !hasNoResults() ? IconPlus : undefined}
                  onBtnClick={auth.canWrite() ? newUseCaseOpenPanel : undefined}
                />
                {!hasNoResults() && (
                  <Box mb={'xl'}>
                    <Fieldset>
                      <Table>
                        <ColumnUseCaseComponent
                          sortBy={listUseCaseApiRequest.orderBy}
                          onSortingChanged={onSortingChanged}
                        />
                        {!hasNoFilteredResults() && (
                          <Table.Tbody>
                            {listUseCaseApiResponse.items.map((useCase) => (
                              <RowUseCaseComponent
                                key={useCase.id}
                                useCase={useCase}
                                handleGoToFlowsRequest={handleGoToFlowsRequest}
                                handleGoToRolloutRequest={handleGoToRolloutRequest}
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
                    <Group justify="center">
                      {listUseCaseApiResponse.totalCount > 0 && (
                        <Pagination
                          mt={40}
                          total={Math.ceil(
                            listUseCaseApiResponse.totalCount /
                              listUseCaseApiRequest.pageSize
                          )}
                          value={listUseCaseApiRequest.page}
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
                        btnHandle={newUseCaseOpenPanel}
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
        <Drawer opened={newUseCasePanelIsOpen} onClose={newUseCaseClosePanel}>
          <NewUseCaseComponent onUseCaseCreated={onUseCaseCreated} />
        </Drawer>
        <Drawer opened={updateUseCasePanelIsOpen} onClose={updateUseCaseClosePanel}>
          <UpdateUseCaseComponent
            useCase={selectedUseCase}
            onUseCaseUpdated={onUseCaseUpdated}
          />
        </Drawer>
        <Modal opened={deleteUseCasePanelIsOpen} onClose={deleteUseCaseClosePanel}>
          <DeleteUseCaseComponent
            useCase={selectedUseCase}
            title={t('deleteUseCaseTitle')}
            text={t('deleteUseCaseDescription')}
            confirmTextRequired
            onCancel={deleteUseCaseClosePanel}
            onUseCaseDeleted={onUseCaseDeleted}
          ></DeleteUseCaseComponent>
        </Modal>
      </Layout>
    </AuthGuard>
  );
}
