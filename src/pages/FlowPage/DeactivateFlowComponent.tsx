import { Flow } from '@entities/flow';
import { Button, Group, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowService } from '@services/flowService';
import { IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification } from '@utils/notificationUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface DeactivateFlowComponentProps {
  flow: Flow;
  title: string;
  text: string;
  confirmTextRequired?: boolean;
  onFlowDeactivated: (id: string) => void;
  onCancel: () => void;
}

export default function DeactivateFlowComponent({
  flow,
  title,
  text,
  confirmTextRequired,
  onCancel,
  onFlowDeactivated,
}: DeactivateFlowComponentProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [textToConfirm, setTextToConfirm] = useState<string>();
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(true);
  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm();

  // Calculate if the confirm button can be enabled
  useEffect(() => {
    setIsConfirmDisabled(!!confirmTextRequired && textToConfirm !== t('deactivateMe'));
  }, [confirmTextRequired, textToConfirm, t]);

  // Handles
  const handleSubmit = async () => {
    try {
      setApiLoading(true);
      await flowService.updateFlow({ id: flow.id, active: false });
      onFlowDeactivated(flow.id);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'flow-cannot-be-deactivated-if-last-active':
          sendErrorNotification({
            id: 'flow-cannot-be-deactivated-if-last-active',
            icon: <IconX />,
            title: <Text>{t('deactivateFlowNotAllowed')}</Text>,
            message: <Text>{t('deactivateFlowNotAllowedDescription')}</Text>,
          });
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
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group justify="left" align="flex-start">
        <ThemeIcon variant="filled" color={'red'} size={34}>
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
          label={t('deactivateMeInput')}
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
