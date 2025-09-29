import { Flow } from '@entities/flow';
import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowService } from '@services/flowService';
import { assets } from '@styles/assets';
import { IconEdit } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface UpdateFlowComponentProps {
  flow: Flow;
  onFlowUpdated: (flow: Flow) => void;
}
export default function UpdateFlowComponent({
  flow,
  onFlowUpdated,
}: UpdateFlowComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      title: flow.title,
      description: flow.description,
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
      const data = await flowService.updateFlow({
        id: flow.id,
        title: values.title,
        description: values.description,
      });
      onFlowUpdated(data.item);
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
  const Image = assets[`../assets/edit-flow.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconEdit size={22} />
          </ThemeIcon>
          <Text size={'lg'}>{t('updateFlowTitle')}</Text>
        </Group>
        <Box w={'85%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('updateFlowTitleInput')}
              placeholder={t('updateFlowTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
            />
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('updateFlowDescriptionInput')}
              placeholder={t('updateFlowDescriptionInputPlaceholder')}
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
          mt={40}
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          fullWidth
        >
          {t('updateFlowCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
