import { UseCaseStep } from '@entities/useCaseStep';
import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseStepService } from '@services/useCaseStepService';
import { assets } from '@styles/assets';
import { IconPlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface NewUseCaseStepComponentProps {
  useCaseId: string;
  onUseCaseStepCreated: (useCaseStep: UseCaseStep) => void;
}
export default function NewUseCaseStepComponent({
  useCaseId,
  onUseCaseStepCreated,
}: NewUseCaseStepComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      code: '',
      description: '',
    },
    validate: {
      title: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      code: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      description: (value: string) =>
        value.trim().length != 0 ? null : t('fieldRequired'),
    },
  });

  // Handles
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await useCaseStepService.createUseCaseStep({
        useCaseID: useCaseId,
        title: values.title,
        code: values.code,
        description: values.description,
      });
      onUseCaseStepCreated(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-step-same-code-already-exists':
          form.setFieldError('code', t('newUseCaseStepCodeInputAlreadyExists'));
          break;
        case 'refresh-token-failed':
          navigate('/logout');
          break;
        default:
          navigate('/internal-server-error');
          break;
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Content
  const Image = assets[`../assets/new-use-case-step.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconPlus size={22} />
          </ThemeIcon>
          <Text size={'lg'}>{t('newUseCaseStepTitle')}</Text>
        </Group>
        <Box w={'100%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('newUseCaseStepTitleInput')}
              placeholder={t('newUseCaseStepTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
            />
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('newUseCaseStepCodeInput')}
              placeholder={t('newUseCaseStepCodeInputPlaceholder')}
              key={form.key('code')}
              {...form.getInputProps('code')}
              mb="sm"
            />
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('newUseCaseStepDescriptionInput')}
              placeholder={t('newUseCaseStepDescriptionInputPlaceholder')}
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
          {t('newUseCaseStepCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
