import {
    Anchor,
    Box,
    Breadcrumbs,
    Divider,
    Grid,
    Group,
    Loader,
    Paper,
    Text,
    TextInput,
} from '@mantine/core';
import { IconArrowFork } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import LayoutComponent from '../../components/layout/layout.component';
import PaperTitle from '../../components/paper-title/paper-title';
import { useAuth } from '../../core/auth/auth.context';
import AuthGuard from '../../core/auth/auth.guard';
import { getErrorMessage } from '../../core/err/err';
import {
    callGetUseCaseApi,
    callListUseCaseStepsApi,
    getUseCaseOutputDto,
    listUseCaseStepsInputDto,
    listUseCaseStepsOutputDto,
} from './use-case-step.api';

export default function UseCaseStepPage() {
    // Development
    const effectRan = useRef(false);
    // Params
    const { id } = useParams();
    const defaultInputData: listUseCaseStepsInputDto = {
        useCaseId: '',
        page: 1,
        pageSize: 5,
        orderDir: 'desc',
        orderBy: 'updated_at',
        searchKey: null,
    };
    // Services
    const auth = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [pageLoaded, setPageLoaded] = useState(false);
    const [dataLoaded, setDataLoaded] = useState<getUseCaseOutputDto>();
    const [stepDataLoaded, setStepDataLoaded] = useState<listUseCaseStepsOutputDto>();
    const [inputData] = useState<listUseCaseStepsInputDto>(defaultInputData);
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { key: 'useCases', title: t('menuUseCases'), href: '/use-cases' },
    ]);

    // Effects

    // In case of input
    useEffect(() => {
        if (!auth.loaded) return;
        if (effectRan.current) return;
        effectRan.current = true;
        (async () => {
            try {
                const data = await callGetUseCaseApi({ id: id! });
                setBreadcrumbItems((prev) => [
                    ...prev,
                    { key: 'title', title: data.item.title, href: '#' },
                ]);
                const stepData = await callListUseCaseStepsApi({
                    ...inputData,
                    useCaseId: data.item.id,
                });
                setStepDataLoaded(stepData);
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
    }, [id, auth, navigate, t, inputData]);

    useEffect(() => {
        setBreadcrumbItems((prev) => {
            return prev.map((item) => {
                if (item.key === 'useCases') return { ...item, title: t('menuUseCases') };
                return item;
            });
        });
    }, [i18n.language, t]);

    const breadcrumbItemsRender = () =>
        breadcrumbItems.map((item) => {
            if (item.href == '#') {
                return <Text size="sm">{item.title}</Text>;
            } else {
                return (
                    <Anchor size="sm" component={NavLink} to={item.href}>
                        {item.title}
                    </Anchor>
                );
            }
        });
    const a = () => {
        stepDataLoaded!.items.forEach((x) => <>{x.code}</>);
    };
    return (
        <AuthGuard>
            <LayoutComponent>
                <Grid.Col span={12}>
                    <Paper p="lg">
                        {pageLoaded && dataLoaded && (
                            <Box>
                                <Breadcrumbs mb={20}>{breadcrumbItemsRender()}</Breadcrumbs>
                                <Divider my={20} />
                                <PaperTitle icon={IconArrowFork} title={dataLoaded.item.title} />
                                <TextInput disabled value={dataLoaded.item.code}></TextInput>
                            </Box>
                        )}
                        {stepDataLoaded && <>{a()}</>}
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
