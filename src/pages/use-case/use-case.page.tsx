import {
    ActionIcon,
    Badge,
    Box,
    Drawer,
    Grid,
    Group,
    Loader,
    Modal,
    Pagination,
    Paper,
    Table,
    Text,
    Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowFork, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import equal from 'fast-deep-equal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/empty-state/empty-state';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import TableHeader from '../../components/table/table-header';
import Tr from '../../components/table/table-tr';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { getErrorMessage } from '../../core/err/err';
import DeleteUseCaseComponent from './delete-use-case.component';
import NewUseCaseComponent from './new-use-case.component';
import UpdateUseCaseComponent from './update-use-case.component';
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

    const defaultInputData: listUseCaseInputDto = {
        page: 1,
        pageSize: 5,
        orderDir: 'desc',
        orderBy: 'updated_at',
    };

    const [newUseCaseOpen, { open: newUseCaseActionsOpen, close: newUseCaseActionsClose }] =
        useDisclosure(false);
    const [
        updateUseCaseOpen,
        { open: updateUseCaseActionsOpen, close: updateUseCaseActionsClose },
    ] = useDisclosure(false);
    const [
        deleteUseCaseOpen,
        { open: deleteUseCaseActionsOpen, close: deleteUseCaseActionsClose },
    ] = useDisclosure(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<listUseCaseOutputDto>();
    const [inputData, setInputData] = useState<listUseCaseInputDto>(defaultInputData);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [selectedUseCase, setSelectedUseCase] = useState<useCaseDto | null>();
    const [searchKeyValue, setSearchKeyValue] = useState<string>();
    const [refreshKey, setRefreshKey] = useState(0);

    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        (async () => {
            try {
                setIsDataLoading(true);
                const data = await callListUseCaseApi(inputData);
                setDataLoaded(data);
                setIsDataLoading(false);
            } catch (err: unknown) {
                switch (getErrorMessage(err)) {
                    case 'refresh-token-failed':
                        navigate('/logout');
                        break;
                    default:
                        alert(t('appGenericError'));
                        break;
                }
            } finally {
                setPageLoaded(true);
                setIsDataLoading(false);
            }
        })();
    }, [auth.loaded, t, navigate, inputData, refreshKey]);

    const onUseCaseCreated = useCallback(
        (useCase: useCaseDto) => {
            newUseCaseActionsClose();
            navigate(`/use-cases/${useCase.id}/steps`, { replace: true });
        },
        [navigate, newUseCaseActionsClose],
    );

    const handleUpdateRequest = useCallback(
        (id: string) => {
            const useCase = dataLoaded?.items.find((x) => x.id === id);
            setSelectedUseCase(useCase);
            updateUseCaseActionsOpen();
        },
        [dataLoaded, updateUseCaseActionsOpen],
    );

    const onUseCaseUpdated = useCallback(() => {
        updateUseCaseActionsClose();
        setRefreshKey((prev) => prev + 1);
    }, [setRefreshKey, updateUseCaseActionsClose]);

    const handleDeleteRequest = useCallback(
        (id: string) => {
            const useCase = dataLoaded?.items.find((x) => x.id === id);
            setSelectedUseCase(useCase);
            deleteUseCaseActionsOpen();
        },
        [dataLoaded, deleteUseCaseActionsOpen],
    );

    const onUseCaseDeleted = useCallback(() => {
        deleteUseCaseActionsClose();
        setRefreshKey((prev) => prev + 1);
    }, [setRefreshKey, deleteUseCaseActionsClose]);

    const onPageSelected = (selected: number) => {
        setInputData({
            ...inputData,
            page: selected,
        });
    };

    const onResetFilter = () => {
        setInputData(defaultInputData);
    };

    // Update the list of columns when the language changes
    const tableColumns = useMemo(() => {
        return [
            {
                key: 'id',
                title: t('useCaseID'),
                sortable: false,
            },
            {
                key: 'code',
                title: t('useCaseCode'),
                sortable: true,
            },
            {
                key: 'title',
                title: t('useCaseTitle'),
                sortable: true,
            },
            {
                key: 'active',
                title: t('useCaseIsActive'),
                sortable: true,
            },
            {
                key: 'created_at',
                title: t('useCaseCreatedAt'),
                sortable: true,
            },
            {
                key: 'updated_at',
                title: t('useCaseUpdatedAt'),
                sortable: true,
            },
        ];
    }, [t]);

    const tableRows = useMemo(() => {
        if (dataLoaded === undefined) return;
        return dataLoaded.items.map((row) => {
            return (
                <Tr
                    key={row.id}
                    trKey={row.id}
                    tds={[
                        {
                            mw: 100,
                            text: row.id,
                            textWithCopy: true,
                            textWithTooltip: true,
                        },
                        {
                            text: row.code,
                            textWithCopy: true,
                            textWithTooltip: true,
                        },
                        {
                            children: (
                                <Text
                                    td={'underline'}
                                    style={{ cursor: 'pointer' }}
                                    size="sm"
                                    onClick={() =>
                                        navigate(`/use-cases/${row.id}/steps`, {
                                            replace: true,
                                        })
                                    }
                                >
                                    {row.title}{' '}
                                </Text>
                            ),
                        },
                        {
                            children: row.active ? (
                                <Badge color="green" size="sm">
                                    {t('useCaseEnable')}
                                </Badge>
                            ) : (
                                <Badge color="grey" size="sm">
                                    {t('useCaseDisable')}
                                </Badge>
                            ),
                        },
                        {
                            text: format(
                                new Date(row.createdAt),
                                import.meta.env.VITE_DATE_FORMAT!,
                            ),
                        },
                        {
                            text: format(
                                new Date(row.updatedAt),
                                import.meta.env.VITE_DATE_FORMAT!,
                            ),
                        },
                        {
                            children: (
                                <>
                                    <Tooltip
                                        withArrow
                                        style={{ fontSize: '12px' }}
                                        label={t('useCaseUpdateAction')}
                                    >
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={() => handleUpdateRequest(row.id)}
                                        >
                                            <IconPencil size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                    <Tooltip
                                        withArrow
                                        style={{ fontSize: '12px' }}
                                        label={
                                            row.active
                                                ? t('useCaseCannotDelete')
                                                : t('useCaseDeleteAction')
                                        }
                                    >
                                        <ActionIcon
                                            color="red"
                                            variant="subtle"
                                            onClick={() => handleDeleteRequest(row.id)}
                                            disabled={row.active}
                                        >
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </>
                            ),
                        },
                    ]}
                ></Tr>
            );
        });
    }, [t, dataLoaded, navigate, handleDeleteRequest, handleUpdateRequest]);

    // Utils
    const isFilterApplied = (): boolean => {
        return equal(inputData, defaultInputData);
    };

    const hasNoFilteredResults = (): boolean => {
        return !!(
            !isDataLoading &&
            dataLoaded &&
            dataLoaded.items.length == 0 &&
            (dataLoaded.totalCount != 0 || !isFilterApplied())
        );
    };

    const hasNoResults = (): boolean => {
        return !!(!isDataLoading && dataLoaded && dataLoaded.totalCount == 0 && isFilterApplied());
    };

    const handleSearchChange = (value: string | undefined) => {
        const newValue = value !== undefined && value.length >= 3 ? value : undefined;
        setSearchKeyValue(value);
        const orderBy = newValue ? 'relevance' : 'updated_at';
        setInputData({
            ...inputData,
            searchKey: newValue,
            page: 1,
            orderBy: orderBy,
            orderDir: 'desc',
        });
    };

    const setSorting = useCallback(
        (field: string, dir: string) => {
            setInputData({
                ...inputData,
                orderDir: dir as 'asc' | 'desc',
                orderBy: field as orderByOptions,
            });
        },
        [setInputData, inputData],
    );

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
                                    icon={IconArrowFork}
                                    title={t('useCaseTitlePage')}
                                    searchValue={searchKeyValue}
                                    showSearch={!hasNoResults()}
                                    onSearchChange={handleSearchChange}
                                    btnIcon={IconPlus}
                                    onBtnClick={newUseCaseActionsOpen}
                                />
                                {!hasNoResults() && (
                                    <>
                                        <Box>
                                            <Table>
                                                <TableHeader
                                                    sortBy={inputData.orderBy}
                                                    setSorting={setSorting}
                                                    columns={tableColumns}
                                                ></TableHeader>
                                                {!hasNoFilteredResults() && (
                                                    <Table.Tbody>{tableRows}</Table.Tbody>
                                                )}
                                            </Table>
                                            {hasNoFilteredResults() && (
                                                <EmptyState
                                                    image="no-results"
                                                    title={t('useCaseNoResultsTitle')}
                                                    btnText={t('useCaseNoResultsBtn')}
                                                    btnHandle={onResetFilter}
                                                ></EmptyState>
                                            )}
                                        </Box>
                                        <Group justify="center" align="center">
                                            {dataLoaded && dataLoaded.totalCount > 0 && (
                                                <Pagination
                                                    mt={50}
                                                    total={Math.ceil(
                                                        dataLoaded.totalCount / inputData.pageSize,
                                                    )}
                                                    value={inputData.page}
                                                    size={'sm'}
                                                    radius={'sm'}
                                                    onChange={onPageSelected}
                                                />
                                            )}
                                        </Group>
                                    </>
                                )}
                                {hasNoResults() && (
                                    <EmptyState
                                        image="new-use-case"
                                        title={t('useCaseCreateNewTitle')}
                                        text={t('useCaseCreateNewText')}
                                        suggestion={t('useCaseCreateNewSuggestion')}
                                        btnText={t('useCaseCreateNewBtn')}
                                        btnHandle={newUseCaseActionsOpen}
                                    ></EmptyState>
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
                        text={t('deleteUsecaseDescription')}
                        confirmTextRequired
                        onClose={deleteUseCaseActionsClose}
                        onUseCaseDeleted={onUseCaseDeleted}
                    ></DeleteUseCaseComponent>
                </Modal>
            </LayoutComponent>
        </AuthGuard>
    );
}
