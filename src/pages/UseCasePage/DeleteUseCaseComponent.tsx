import { UseCase } from '@entities/useCase';
import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCaseService } from '@services/useCaseService';
import { IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface DeleteUseCaseComponentProps {
  useCase: UseCase;
  title: string;
  text: string;
  confirmTextRequired?: boolean;
  onUseCaseDeleted: (id: string) => void;
  onCancel: () => void;
}

export default function DeleteUseCaseComponent({
  useCase,
  title,
  text,
  confirmTextRequired,
  onCancel,
  onUseCaseDeleted,
}: DeleteUseCaseComponentProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [apiLoading, setApiLoading] = useState(false);
  const [textToConfirm, setTextToConfirm] = useState<string>();
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);

  // Form
  const form = useForm();

  // Effects
  useEffect(() => {
    setIsConfirmDisabled(!!confirmTextRequired && textToConfirm !== t('deleteMe'));
  }, [confirmTextRequired, textToConfirm, t]);

  // Handlers
  const handleSubmit = async () => {
    try {
      setApiLoading(true);
      await useCaseService.deleteUseCase({ id: useCase.id });
      onUseCaseDeleted(useCase.id);
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
      <Group>
        <ThemeIcon variant="filled" color={'red'} size={34}>
          <IconX />
        </ThemeIcon>
        <Text size={'xl'}>{title}</Text>
      </Group>
      <Text mt={10}>{text}</Text>
      <Text mt={10} fw={'var(--mantine-heading-font-weight)'}>
        {t('deleteUndo')}
      </Text>
      {confirmTextRequired && (
        <TextInput
          mt={30}
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
