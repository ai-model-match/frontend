import { Flow } from '@entities/flow';
import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowService } from '@services/flowService';
import { IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface ActivateFlowComponentProps {
  flow: Flow;
  title: string;
  text: string;
  confirmTextRequired?: boolean;
  onFlowActivated: (id: string) => void;
  onCancel: () => void;
}

export default function ActivateFlowComponent({
  flow,
  title,
  text,
  confirmTextRequired,
  onCancel,
  onFlowActivated,
}: ActivateFlowComponentProps) {
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
    setIsConfirmDisabled(!!confirmTextRequired && textToConfirm !== t('ActivateMe'));
  }, [confirmTextRequired, textToConfirm, t]);

  // Handlers
  const handleSubmit = async () => {
    try {
      setApiLoading(true);
      await flowService.updateFlow({ id: flow.id, active: true });
      onFlowActivated(flow.id);
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
        <ThemeIcon variant="filled" size={34}>
          <IconX />
        </ThemeIcon>
        <Text size={'xl'}>{title}</Text>
      </Group>
      <Text mt={10}>{text}</Text>
      {confirmTextRequired && (
        <TextInput
          mt={30}
          withAsterisk
          required
          label={t('ActivateMeInput')}
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
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
        >
          {t('btnConfirm')}
        </Button>
      </Group>
    </form>
  );
}
