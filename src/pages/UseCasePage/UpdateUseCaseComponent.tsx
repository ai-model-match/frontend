import { UseCase } from '@entities/useCase';
import {
  Box,
  Button,
  Group,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseService } from '@services/useCaseService';
import { assets } from '@styles/assets';
import { IconEdit } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface UpdateUseCaseComponentProps {
  useCase: UseCase;
  onUseCaseUpdated: (useCase: UseCase) => void;
}
export default function UpdateUseCaseComponent({
  useCase,
  onUseCaseUpdated,
}: UpdateUseCaseComponentProps) {
  // Services
  const navigate = useNavigate();

  const { t } = useTranslation();

  // States
  const [apiloading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: useCase.title,
      code: useCase.code,
      description: useCase.description,
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
      const data = await useCaseService.updateUseCase({
        id: useCase.id,
        title: values.title,
        code: values.code,
        description: values.description,
      });
      onUseCaseUpdated(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-same-code-already-exists':
          form.setFieldError('code', t('updateUseCaseCodeInputAlreadyExists'));
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
  const Image = assets[`../assets/edit-use-case.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconEdit size={18} />
          </ThemeIcon>
          <Text size={'lg'}>{t('updateUseCaseTitle')}</Text>
        </Group>
        <Box w={'100%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('updateUseCaseTitleInput')}
              placeholder={t('updateUseCaseTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
            />
            {useCase.active && (
              <Tooltip
                withArrow
                style={{ fontSize: '12px' }}
                label={t('updateUseCaseCodeCannotUpdate')}
              >
                <TextInput
                  withAsterisk
                  maxLength={30}
                  label={t('updateUseCaseCodeInput')}
                  placeholder={t('updateUseCaseCodeInputPlaceholder')}
                  key={form.key('code')}
                  {...form.getInputProps('code')}
                  mb="sm"
                  disabled
                />
              </Tooltip>
            )}
            {!useCase.active && (
              <TextInput
                withAsterisk
                maxLength={30}
                label={t('updateUseCaseCodeInput')}
                placeholder={t('updateUseCaseCodeInputPlaceholder')}
                key={form.key('code')}
                {...form.getInputProps('code')}
                mb="sm"
              />
            )}
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('updateUseCaseDescriptionInput')}
              placeholder={t('updateUseCaseDescriptionInputPlaceholder')}
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
          loading={apiloading}
          loaderProps={{ type: 'dots' }}
          fullWidth
        >
          {t('updateUseCaseCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
