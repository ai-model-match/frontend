
import { ActionIcon, Badge, Box, Grid, Group, Pagination, Paper, Table } from '@mantine/core';
import { IconArrowFork, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import equal from 'fast-deep-equal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../../components/empty-state/empty-state';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import TableHeader from '../../components/table/table-header';
import Tr from '../../components/table/table-tr';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { callListUseCaseApi, listUseCaseInputDto, listUseCasesOutputDto, orderByOptions } from './use-case.api';




export default function UseCasePage() {
    // Services
    var auth = useAuth();
    const { t } = useTranslation();

    const defaultInputData: listUseCaseInputDto = {
        page: 1,
        pageSize: 5,
        orderDir: 'desc',
        orderBy: 'updated_at',
        searchKey: null
    };
    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<listUseCasesOutputDto>();
    const [inputData, setInputData] = useState<listUseCaseInputDto>(defaultInputData);
    const [isDataLoading, setIsDataLoading] = useState(true);


    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        (async () => {
            try {
                setIsDataLoading(true);
                const data = await callListUseCaseApi(inputData);
                setDataLoaded(data);
                setIsDataLoading(false);
            } catch (err) {
            } finally {
                setPageLoaded(true);
                setIsDataLoading(false);
            }
        })();
    }, [auth.loaded, inputData]);



    // Utils
    const isFilterApplied = (): boolean => {
        return equal(inputData, defaultInputData);
    };

    const hasNoFilteredResults = (): boolean => {
        return !!(!isDataLoading && dataLoaded && dataLoaded.items.length == 0 && (dataLoaded.totalCount != 0 || !isFilterApplied()));
    };

    const hasNoResults = (): boolean => {
        return !!(!isDataLoading && dataLoaded && dataLoaded.totalCount == 0 && isFilterApplied());
    };

    const onPageSelected = (selected: number) => {
        setInputData({
            ...inputData,
            page: selected
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
            orderDir: 'desc'
        });
    };

    const handleDelete = (id: string) => {
        try {
            setDataLoaded((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    items: prev.items.filter((row) => row.id !== id),
                    totalCount: prev.totalCount - 1,
                };
            });
            setInputData({
                ...inputData,
                page: 1
            });
        } catch (err) {
        } finally { }
    };


    const [sortBy, setSortBy] = useState<orderByOptions>('title');
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const setSorting = (field: string) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field as orderByOptions);
        setInputData({
            ...inputData,
            orderDir: reversed ? 'asc' : 'desc',
            orderBy: field as orderByOptions
        });
    };

    // Columns
    const getColumns = () => {
        return [{
            key: 'id',
            title: t('useCaseID'),
            sortable: false
        }, {
            key: 'code',
            title: t('useCaseCode'),
            sortable: true
        }, {
            key: 'title',
            title: t('useCaseTitle'),
            sortable: true
        }, {
            key: 'active',
            title: t('useCaseIsActive'),
            sortable: true
        }, {
            key: 'created_at',
            title: t('useCaseCreatedAt'),
            sortable: true
        }, {
            key: 'updated_at',
            title: t('useCaseUpdatedAt'),
            sortable: true
        }];
    };

    // Rows
    const rows = dataLoaded?.items.map((row) => {
        return (
            <Tr key={row.id} trKey={row.id} tds={[{
                mw: 100,
                text: row.id,
                textWithCopy: true,
                textWithTooltip: true
            }, {
                text: row.code,
                textWithCopy: true,
                textWithTooltip: true
            }, {
                text: row.title
            }, {
                children: row.active ? <Badge color='green' size='xs'>enable</Badge> : <Badge color='grey' size='xs'>disable</Badge>
            }, {
                text: format(new Date(row.createdAt), import.meta.env.VITE_DATE_FORMAT!)
            }, {
                text: format(new Date(row.updatedAt), import.meta.env.VITE_DATE_FORMAT!)
            }, {
                children: <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(row.id)}>
                    <IconTrash size={16} />
                </ActionIcon>
            }
            ]}>
            </Tr>
        );
    });

    // Content
    return (
        pageLoaded &&
        <AuthGuard>
            <LayoutComponent>
                <Grid.Col span={12}>
                    <Paper p="lg" >
                        <PaperTitle
                            icon={IconArrowFork}
                            title={t('useCaseTitlePage')}
                            showSearch={!hasNoResults()}
                            onSearchChange={handleSearchChange}
                        />
                        {!hasNoResults() && <>
                            <Box>
                                <Table >
                                    <TableHeader
                                        sortBy={inputData.orderBy}
                                        setSorting={setSorting}
                                        columns={getColumns()} >
                                    </TableHeader>
                                    {!hasNoFilteredResults() &&
                                        <Table.Tbody>{rows}</Table.Tbody>
                                    }
                                </Table>
                                {hasNoFilteredResults() &&
                                    <EmptyState
                                        image="no-results"
                                        title={t('useCaseNoResultsTitle')}
                                        btnText={t('useCaseNoResultsBtn')}
                                        btnHandle={handleResetFilter}>
                                    </EmptyState>
                                }
                            </Box>
                            <Group justify="center" align="center">
                                {dataLoaded && dataLoaded.totalCount > 0 && <Pagination mt={50}
                                    total={Math.ceil(dataLoaded.totalCount / inputData.pageSize)}
                                    value={inputData.page}
                                    size={'sm'} radius={'sm'}
                                    onChange={onPageSelected}
                                />
                                }
                            </Group>
                        </>
                        }
                        {hasNoResults() &&
                            <EmptyState
                                image="new-use-case"
                                title={t('useCaseCreateNewTitle')}
                                text={t('useCaseCreateNewText')}
                                suggestion={t('useCaseCreateNewSuggestion')}
                                btnText={t('useCaseCreateNewBtn')}
                                btnHandle={() => { alert('ciao'); }}
                            ></EmptyState>
                        }
                    </Paper>
                </Grid.Col>
            </LayoutComponent>
        </AuthGuard >
    );
}
