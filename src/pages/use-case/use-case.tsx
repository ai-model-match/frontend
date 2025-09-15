
import { ActionIcon, Badge, Code, CopyButton, Grid, Paper, Table, Text, Title, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutComponent } from '../../components/layout/layout.component';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { callListUseCaseApi, useCaseDto } from './use-case.api';


export default function UseCasePage() {
    // Services
    const { t } = useTranslation();
    var auth = useAuth();

    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<useCaseDto[]>([]);

    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        (async () => {
            try {
                const data = await callListUseCaseApi({
                    page: 1,
                    pageSize: 10,
                    orderDir: 'desc',
                    orderBy: 'updated_at',
                    searchKey: null
                });
                setDataLoaded(data.items);
            } catch (err) {
            } finally {
                setPageLoaded(true);
            }
        })();
    }, [auth.loaded]);

    const rows = dataLoaded.map((row) => {
        return (
            <Table.Tr key={row.id}>
                <Table.Td style={{ maxWidth: 100 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Tooltip withArrow style={{ fontSize: '12px' }} label={row.id}><Text size='xs' truncate="end">{row.id}</Text></Tooltip>
                        <CopyButton value={row.id} timeout={2000}>
                            {({ copied, copy }) => (
                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </div>
                </Table.Td>
                <Table.Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Code color="dark.3" c={'white'} style={{ fontSize: '10px' }} fw={800} >{row.code}</Code>
                        <CopyButton value={row.code} timeout={2000}>
                            {({ copied, copy }) => (
                                <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                                </ActionIcon>
                            )}
                        </CopyButton>
                    </div>
                </Table.Td>
                <Table.Td><Text size='xs'>{row.title}</Text></Table.Td>
                <Table.Td>{row.active ? <Badge color='green' size='xs'>enable</Badge> : <Badge color='grey' size='xs'>disable</Badge>}</Table.Td>
                <Table.Td><Text size='xs'>
                    {format(new Date(row.createdAt), 'yyyy-MM-dd, HH:mm')}
                </Text></Table.Td>
                <Table.Td><Text size='xs'>
                    {format(new Date(row.updatedAt), 'yyyy-MM-dd, HH:mm')}
                </Text></Table.Td>
                <Table.Td></Table.Td>
            </Table.Tr >
        );
    });

    // Content
    return (
        pageLoaded &&
        <AuthGuard>
            <LayoutComponent>
                <Grid.Col span={12}>
                    <Paper p="lg" ><Title order={4}>{t('useCaseTitlePage')}</Title>
                        <Table.ScrollContainer minWidth={900}>
                            <Table >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th style={{ maxWidth: 100 }}>{t('useCaseID')}</Table.Th>
                                        <Table.Th>{t('useCaseCode')}</Table.Th>
                                        <Table.Th>{t('useCaseTitle')}</Table.Th>
                                        <Table.Th>{t('useCaseIsActive')}</Table.Th>
                                        <Table.Th>{t('useCaseCreatedAt')}</Table.Th>
                                        <Table.Th>{t('useCaseUpdatedAt')}</Table.Th>
                                        <Table.Th></Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>{rows}</Table.Tbody>
                            </Table>
                        </Table.ScrollContainer>
                    </Paper>
                </Grid.Col>
            </LayoutComponent>
        </AuthGuard >
    );
}
