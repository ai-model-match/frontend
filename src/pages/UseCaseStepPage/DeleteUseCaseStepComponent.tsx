import { UseCaseStep } from '@entities/useCaseStep';
import { Alert, Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseStepService } from '@services/useCaseStepService';
import { IconExclamationCircle, IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface DeleteUseCaseStepComponentProps {
  useCaseStep: UseCaseStep;
  title: string;
  text: string;
  confirmTextRequired?: boolean;
  onUseCaseStepDeleted: (id: string) => void;
  onCancel: () => void;
}

export default function DeleteUseCaseStepComponent({
  useCaseStep,
  title,
  text,
  confirmTextRequired,
  onCancel,
  onUseCaseStepDeleted,
}: DeleteUseCaseStepComponentProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [textToConfirm, setTextToConfirm] = useState<string>();
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);
  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm();

  // Calculate if the confirm button can be enabled
  useEffect(() => {
    setIsConfirmDisabled(!!confirmTextRequired && textToConfirm !== t('deleteMe'));
  }, [confirmTextRequired, textToConfirm, t]);

  // Handles
  const handleSubmit = async () => {
    try {
      setApiLoading(true);
      await useCaseStepService.deleteUseCaseStep({ id: useCaseStep.id });
      onUseCaseStepDeleted(useCaseStep.id);
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
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group justify="left" align="flex-start">
        <ThemeIcon variant="filled" color={'red'} size={34}>
          <IconX />
        </ThemeIcon>
        <Text size={'xl'}>{title}</Text>
      </Group>
      <Text mt={10}>{text}</Text>
      {!confirmTextRequired && (
        <Text mt={10} fw={'var(--mantine-heading-font-weight)'}>
          {t('deleteUndo')}
        </Text>
      )}
      {confirmTextRequired && (
        <Alert color="yellow" p={'xs'} mt={'md'} icon={<IconExclamationCircle />}>
          {t('deleteUseCaseStepCodeWarning')}
        </Alert>
      )}
      {confirmTextRequired && (
        <TextInput
          withAsterisk
          required
          label={t('deleteMeInput')}
          onChange={(e) => setTextToConfirm(e.currentTarget.value)}
        />
      )}
      <Group mt="lg" justify="flex-end">
        <Button onClick={onCancel} variant="outline">
          {t('btnCancel')}
        </Button>
        <Button
          type="submit"
          color="red"
          disabled={isConfirmDisabled}
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
        >
          {t('btnConfirm')}
        </Button>
      </Group>
    </form>
  );
}
