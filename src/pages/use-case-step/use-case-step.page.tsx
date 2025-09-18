import { Anchor, Box, Breadcrumbs, Divider, Grid, Group, Loader, Paper, Text } from '@mantine/core';
import { IconArrowFork } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { getErrorMessage } from '../../core/err/err';
import { callGetUseCaseApi, getUseCasesOutputDto } from './use-case.api';

export default function UseCaseStepPage() {
    // Development
    const effectRan = useRef(false);

    // Params
    const { id } = useParams();
    // Services
    const auth = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<getUseCasesOutputDto>();
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { title: 'Use Cases', href: '/use-cases' },
    ]);

    // Effects
    useEffect(() => {
        if (!auth.loaded) return;
        if (effectRan.current) return;
        effectRan.current = true;
        (async () => {
            try {
                const data = await callGetUseCaseApi({ id: id! });
                setBreadcrumbItems((prev) => [...prev, { title: data.item.title, href: '#' }]);
                setDataLoaded(data);
            } catch (err: unknown) {
                switch (getErrorMessage(err)) {
                    case 'refresh-token-failed':
                        navigate('/logout');
                        break;
                    case 'use-case-not-found':
                        navigate('/not-found');
                        break;
                    default:
                        alert(t('appGenericError'));
                        break;
                }
            } finally {
                setPageLoaded(true);
            }
        })();
    }, [id, auth, t, navigate]);

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
            <LayoutComponent>
                <Grid.Col span={12}>
                    <Paper p="lg">
                        {pageLoaded && dataLoaded && (
                            <Box>
                                <Breadcrumbs mb={20}>{breadcrumbItemsRender()}</Breadcrumbs>
                                <Divider my={20} />
                                <PaperTitle icon={IconArrowFork} title={dataLoaded.item.title!} />
                            </Box>
                        )}
                        {!pageLoaded && (
                            <Group mt={100} mb={100} justify="center" align="center">
                                <Loader type="dots" />
                            </Group>
                        )}
                    </Paper>
                </Grid.Col>
            </LayoutComponent>
        </AuthGuard>
    );
}
