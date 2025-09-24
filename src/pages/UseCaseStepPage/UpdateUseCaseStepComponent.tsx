import { UseCase } from '@entities/useCase';
import { UseCaseStep } from '@entities/useCaseStep';
import {
  Alert,
  Box,
  Button,
  Group,
  NumberInput,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseStepService } from '@services/useCaseStepService';
import { assets } from '@styles/assets';
import { IconEdit, IconExclamationCircle } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface UpdateUseCaseStepComponentProps {
  totalItemsCount: number;
  useCase: UseCase;
  useCaseStep: UseCaseStep;
  onUseCaseStepUpdated: (useCaseStep: UseCaseStep) => void;
}
export default function UpdateUseCaseStepComponent({
  totalItemsCount,
  useCase,
  useCaseStep,
  onUseCaseStepUpdated,
}: UpdateUseCaseStepComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiloading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: useCaseStep.title,
      code: useCaseStep.code,
      description: useCaseStep.description,
      position: useCaseStep.position,
    },
    validate: {
      title: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      code: (value: string) => (value.trim().length != 0 ? null : t('fieldRequired')),
      description: (value: string) =>
        value.trim().length != 0 ? null : t('fieldRequired'),
      position: (value: number) => (value <= totalItemsCount ? null : t('fieldRequired')),
    },
  });

  // Handles
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await useCaseStepService.updateUseCaseStep({
        id: useCaseStep.id,
        title: values.title,
        code: values.code,
        description: values.description,
        position: values.position,
      });
      onUseCaseStepUpdated(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-same-code-already-exists':
          form.setFieldError('code', t('updateUseCaseStepCodeInputAlreadyExists'));
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
  const Image = assets[`../assets/edit-use-case-step.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconEdit size={18} />
          </ThemeIcon>
          <Text size={'lg'}>{t('updateUseCaseStepTitle')}</Text>
        </Group>
        <Box w={'100%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        {useCase.active && (
          <Alert
            variant="light"
            color="yellow"
            p={'xs'}
            mb={'md'}
            icon={<IconExclamationCircle />}
          >
            {t('updateUseCaseStepCodeWarning')}
          </Alert>
        )}
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('updateUseCaseStepTitleInput')}
              placeholder={t('updateUseCaseStepTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
            />
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('updateUseCaseStepCodeInput')}
              placeholder={t('updateUseCaseStepCodeInputPlaceholder')}
              key={form.key('code')}
              {...form.getInputProps('code')}
              mb="sm"
            />
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('updateUseCaseStepDescriptionInput')}
              placeholder={t('updateUseCaseStepDescriptionInputPlaceholder')}
              key={form.key('description')}
              {...form.getInputProps('description')}
              mb="sm"
            />
            <NumberInput
              min={1}
              max={totalItemsCount}
              label={t('updateUseCaseStepPositionInput')}
              key={form.key('position')}
              {...form.getInputProps('position')}
            />
          </Box>
        </Group>
      </Box>
      <Box>
        <Button
          type="submit"
          mt={'lg'}
          loading={apiloading}
          loaderProps={{ type: 'dots' }}
          fullWidth
        >
          {t('updateUseCaseStepCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
