import {
  Accordion,
  ActionIcon,
  Anchor,
  Box,
  Breadcrumbs,
  Code,
  CopyButton,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Switch,
  Text,
  Textarea,
} from '@mantine/core';
import { IconArrowFork, IconCheck, IconCopy, IconMenu2 } from '@tabler/icons-react';
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
    orderDir: 'asc',
    orderBy: 'position',
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
        setBreadcrumbItems((prev) => [...prev, { key: 'title', title: data.item.title, href: '#' }]);
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
            navigate('/internal-server-error');
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

  const items = () => {
    return stepDataLoaded!.items.map((item) => (
      <Accordion.Item key={item.id} value={item.id}>
        <Accordion.Control>
          <Group justify="flex-start">
            <Group>
              <IconMenu2 />
              <Text size="sm" fw={600}>
                {item.title}
              </Text>
            </Group>
            <Group gap={2}>
              <Code mr={0}>{item.code}</Code>
              <CopyButton value={item.code} timeout={1000}>
                {({ copied, copy }) => (
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Text size="sm">{item.description}</Text>
        </Accordion.Panel>
      </Accordion.Item>
    ));
  };

  return (
    <AuthGuard>
      <LayoutComponent>
        <Grid.Col span={12}>
          <Paper p="lg">
            {pageLoaded && dataLoaded && (
              <Box>
                <Box mb={30}>
                  <Breadcrumbs mb={20}>{breadcrumbItemsRender()}</Breadcrumbs>
                  <Divider my={20} />
                  <Group justify="space-between" align="center" gap={0}>
                    <Group justify="flex-start" align="center" gap={0}>
                      <PaperTitle mb={0} icon={IconArrowFork} title={dataLoaded.item.title} />
                      <Group gap={2}>
                        <Code>{dataLoaded.item.code}</Code>
                        <CopyButton value={dataLoaded.item.code} timeout={1000}>
                          {({ copied, copy }) => (
                            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                            </ActionIcon>
                          )}
                        </CopyButton>
                      </Group>
                    </Group>
                    <Switch
                      defaultChecked={dataLoaded.item.active}
                      label={dataLoaded.item.active ? 'Active' : 'Inactive'}
                      labelPosition="left"
                      size="sm"
                    />
                  </Group>
                </Box>
                <Grid gutter="md" columns={12}>
                  <Grid.Col span={4}>
                    <Stack align="stretch" justify="center" gap="md">
                      <Textarea readOnly={true} rows={5} value={dataLoaded.item.description}></Textarea>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={8}>
                    <Accordion variant="separated" chevronPosition="right">
                      {items()}
                    </Accordion>
                  </Grid.Col>
                </Grid>
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
