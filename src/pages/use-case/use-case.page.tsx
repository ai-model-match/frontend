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
import { IconArrowFork, IconPlus, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import equal from 'fast-deep-equal';
import { useEffect, useState } from 'react';
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
import {
    callDeleteUseCaseApi,
    callListUseCaseApi,
    listUseCaseInputDto,
    listUseCasesOutputDto,
    orderByOptions,
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
        searchKey: null,
    };

    const [newUseCaseOpen, newUseCaseActions] = useDisclosure(false);
    const [deleteUseCaseOpen, deleteUseCaseActions] = useDisclosure(false);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<listUseCasesOutputDto>();
    const [inputData, setInputData] = useState<listUseCaseInputDto>(defaultInputData);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [deleteUseCaseID, setDeleteUseCaseID] = useState<string>('');

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
    }, [auth.loaded, inputData, t, navigate]);

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

    const onPageSelected = (selected: number) => {
        setInputData({
            ...inputData,
            page: selected,
        });
    };

    // Handlers
    const handleResetFilter = () => {
        setInputData(defaultInputData);
    };

    const handleSearchChange = (value: string) => {
        const newValue = value !== null && value.length >= 3 ? value : null;
        const orderBy = newValue ? 'relevance' : 'updated_at';
        setInputData({
            ...inputData,
            searchKey: newValue,
            page: 1,
            orderBy: orderBy,
            orderDir: 'desc',
        });
    };

    const handleDeleteRequest = (id: string) => {
        setDeleteUseCaseID(id);
        deleteUseCaseActions.open();
    };

    const handleDelete = async () => {
        deleteUseCaseActions.close();
        try {
            await callDeleteUseCaseApi({ id: deleteUseCaseID });
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
            setDeleteUseCaseID('');
            let newPage = 1;
            if (dataLoaded) {
                const totalPages = Math.ceil((dataLoaded.totalCount - 1) / inputData.pageSize);
                newPage = inputData.page > totalPages ? totalPages : inputData.page;
            }
            if (newPage === 0) {
                setInputData(defaultInputData);
            } else {
                setInputData({
                    ...inputData,
                    page: newPage,
                });
            }
        }
    };

    const setSorting = (field: string, dir: string) => {
        setInputData({
            ...inputData,
            orderDir: dir as 'asc' | 'desc',
            orderBy: field as orderByOptions,
        });
    };

    // Columns
    const getColumns = () => {
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
    };

    // Rows
    const rows = dataLoaded?.items.map((row) => {
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
                                    navigate(`/use-cases/${row.id}/steps`, { replace: true })
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
                        text: format(new Date(row.createdAt), import.meta.env.VITE_DATE_FORMAT!),
                    },
                    {
                        text: format(new Date(row.updatedAt), import.meta.env.VITE_DATE_FORMAT!),
                    },
                    {
                        children: (
                            <>
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

    // Content
    return (
        <AuthGuard>
            <LayoutComponent>
                <Grid.Col span={12}>
                    <Paper p="lg">
                        {pageLoaded && (
                            <Box>
                                <PaperTitle
                                    icon={IconArrowFork}
                                    title={t('useCaseTitlePage')}
                                    showSearch={!hasNoResults()}
                                    onSearchChange={handleSearchChange}
                                    btnIcon={IconPlus}
                                    btnClick={newUseCaseActions.open}
                                />
                                {!hasNoResults() && (
                                    <>
                                        <Box>
                                            <Table>
                                                <TableHeader
                                                    sortBy={inputData.orderBy}
                                                    setSorting={setSorting}
                                                    columns={getColumns()}
                                                ></TableHeader>
                                                {!hasNoFilteredResults() && (
                                                    <Table.Tbody>{rows}</Table.Tbody>
                                                )}
                                            </Table>
                                            {hasNoFilteredResults() && (
                                                <EmptyState
                                                    image="no-results"
                                                    title={t('useCaseNoResultsTitle')}
                                                    btnText={t('useCaseNoResultsBtn')}
                                                    btnHandle={handleResetFilter}
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
                                        btnHandle={newUseCaseActions.open}
                                    ></EmptyState>
                                )}
                            </Box>
                        )}
                        {!pageLoaded && (
                            <Group mt={100} mb={100} justify="center" align="center">
                                <Loader type="dots" />
                            </Group>
                        )}
                    </Paper>
                </Grid.Col>
                <Drawer
                    opened={newUseCaseOpen}
                    padding={0}
                    onClose={newUseCaseActions.close}
                    position="right"
                    offset={10}
                    overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                    withCloseButton={false}
                    radius="md"
                >
                    <NewUseCaseComponent />
                </Drawer>
                <Modal
                    opened={deleteUseCaseOpen}
                    onClose={deleteUseCaseActions.close}
                    withCloseButton={false}
                    overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
                >
                    <DeleteUseCaseComponent
                        title={t('deleteUseCaseTitle')}
                        text={t('deleteUsecaseDescription')}
                        confirmTextRequired
                        onClose={deleteUseCaseActions.close}
                        onConfirm={handleDelete}
                    ></DeleteUseCaseComponent>
                </Modal>
            </LayoutComponent>
        </AuthGuard>
    );
}
