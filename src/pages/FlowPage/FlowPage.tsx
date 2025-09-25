import { Layout } from '@components/Layout';
import { PaperTitle } from '@components/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { GetUseCaseOutputDto } from '@dtos/useCaseDto';
import { AuthGuard } from '@guards/AuthGuard';
import {
  Anchor,
  Box,
  Breadcrumbs,
  Grid,
  Group,
  Loader,
  Paper,
  Text,
} from '@mantine/core';
import { useCaseService } from '@services/useCaseService';
import { IconArrowFork } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
interface BreadcrumbItem {
  title: string;
  href: string;
}
export default function FlowPage() {
  const { id } = useParams();

  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiUseCaseResponse, setApiUseCaseResponse] = useState<GetUseCaseOutputDto>();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  // Effects
  useEffect(() => {
    if (!auth.loaded) return;
    (async () => {
      try {
        const data = await useCaseService.getUseCase({ id: id! });

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
  }, [id, auth, navigate, t]);

  useEffect(() => {
    // Set breadcrumb and adapt by change on data or translation
    const items = [{ title: t('menuUseCases'), href: '/use-cases' }];
    if (apiUseCaseResponse)
      items.push({
        title: apiUseCaseResponse.item.title,
        href: `/use-cases/${apiUseCaseResponse.item.id}/steps`,
      });
    items.push({ title: t('menuFlows'), href: '#' });
    setBreadcrumbItems(items);
  }, [t, apiUseCaseResponse]);

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
          <Paper p="lg">
            {!pageLoaded && (
              <Group mt={100} mb={100} justify="center" align="center">
                <Loader type="dots" />
              </Group>
            )}
            {pageLoaded && (
              <Box>
                <PaperTitle mb={30} icon={IconArrowFork} title={t('flowTitlePage')} />
              </Box>
            )}
          </Paper>
        </Grid.Col>
      </Layout>
    </AuthGuard>
  );
}
