import { Flow } from '@entities/flow';
import { UseCase } from '@entities/useCase';
import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowService } from '@services/flowService';
import { assets } from '@styles/assets';
import { IconPlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface NewFlowComponentProps {
  useCase: UseCase;
  onFlowCreated: (flow: Flow) => void;
}
export default function NewFlowComponent({
  useCase,
  onFlowCreated,
}: NewFlowComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
    },
    validate: {
      title: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      description: (value: string) =>
        value.trim().length != 0 ? null : t('fieldRequired'),
    },
  });

  // Handlers
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await flowService.createFlow({
        useCaseID: useCase.id,
        title: values.title,
        description: values.description,
      });
      onFlowCreated(data.item);
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
    }
  };

  // Content
  const Image = assets[`../assets/new-flow.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconPlus size={22} />
          </ThemeIcon>
          <Text size={'lg'}>{t('newFlowTitle')}</Text>
        </Group>
        <Box w={'100%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('newFlowTitleInput')}
              placeholder={t('newFlowTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
            />
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('newFlowDescriptionInput')}
              placeholder={t('newFlowDescriptionInputPlaceholder')}
              key={form.key('description')}
              {...form.getInputProps('description')}
              mb="sm"
            />
          </Box>
        </Group>
      </Box>
      <Box>
        <Button
          type="submit"
          mt={'lg'}
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          fullWidth
        >
          {t('newFlowCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
