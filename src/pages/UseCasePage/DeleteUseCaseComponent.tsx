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

  const [textToConfirm, setTextToConfirm] = useState<string>();
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);
  const [apiloading, setApiLoading] = useState(false);

  const form = useForm();

  // Calculate if the confirm button can be enabled
  useEffect(() => {
    setIsConfirmDisabled(
      confirmTextRequired !== undefined && textToConfirm !== t('deleteMe')
    );
  }, [confirmTextRequired, textToConfirm, t]);

  // Handles
  const handleSubmit = async () => {
    try {
      setApiLoading(true);
      await useCaseService.deleteUseCase({ id: useCase.id });
      onUseCaseDeleted(useCase.id);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
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
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group justify="left" align="flex-start">
        <ThemeIcon variant="filled" c={'white'} size={30}>
          <IconX size={18} />
        </ThemeIcon>
        <Text size={'lg'}>{title}</Text>
      </Group>
      <Text size="sm" mt={10}>
        {text}
      </Text>
      <Text size="sm" mt={10} fw={600}>
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
          disabled={isConfirmDisabled}
          loading={apiloading}
          loaderProps={{ type: 'dots' }}
        >
          {t('btnConfirm')}
        </Button>
      </Group>
    </form>
  );
}
