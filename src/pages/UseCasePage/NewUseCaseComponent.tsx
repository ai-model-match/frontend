import { UseCase } from '@entities/useCase';
import { Box, Button, Group, Text, Textarea, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseService } from '@services/useCaseService';
import { assets } from '@styles/assets';
import { IconPlus } from '@tabler/icons-react';
import { prepareCode, slugify } from '@utils/codeUtils';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface NewUseCaseComponentProps {
  onUseCaseCreated: (useCase: UseCase) => void;
}
export default function NewUseCaseComponent({
  onUseCaseCreated,
}: NewUseCaseComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
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

  // Handlers
  const handleTitleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const titleValue = event.currentTarget.value;
    if (!form.values.code) {
      form.setFieldValue('code', prepareCode(slugify(titleValue)));
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await useCaseService.createUseCase({
        title: values.title,
        code: values.code,
        description: values.description,
      });
      onUseCaseCreated(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'use-case-same-code-already-exists':
          form.setFieldError('code', t('newUseCaseCodeInputAlreadyExists'));
          break;
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
  const Image = assets[`../assets/new-use-case.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group>
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconPlus size={22} />
          </ThemeIcon>
          <Text size={'lg'}>{t('newUseCaseTitle')}</Text>
        </Group>
        <Box w={'100%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Box w={'100%'} h={'100mah'}>
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('newUseCaseTitleInput')}
              placeholder={t('newUseCaseTitleInputPlaceholder')}
              key={form.key('title')}
              {...form.getInputProps('title')}
              mb="sm"
              onBlur={handleTitleBlur}
            />
            <TextInput
              withAsterisk
              maxLength={30}
              label={t('newUseCaseCodeInput')}
              placeholder={t('newUseCaseCodeInputPlaceholder')}
              key={form.key('code')}
              {...form.getInputProps('code')}
              onChange={(event) =>
                form.setFieldValue('code', prepareCode(event.currentTarget.value))
              }
              mb="sm"
            />
            <Textarea
              withAsterisk
              maxLength={500}
              rows={5}
              label={t('newUseCaseDescriptionInput')}
              placeholder={t('newUseCaseDescriptionInputPlaceholder')}
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
          {t('newUseCaseCreateBtn')}
        </Button>
      </Box>
    </form>
  );
}
