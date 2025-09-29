import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { FlowStep } from '@entities/flowStep';
import { UseCaseStep } from '@entities/useCaseStep';
import { Button, Divider, Group, JsonInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowStepService } from '@services/flowStepService';
import { IconCheck, IconRoute } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendSuccessNotification } from '@utils/notificationUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface FlowStepConfigComponentProps {
  useCaseStep: UseCaseStep;
  flowStep: FlowStep;
}

export function FlowStepConfigComponent({
  useCaseStep,
  flowStep,
}: FlowStepConfigComponentProps) {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);
  const [flowStepState, setFlowStepState] = useState<FlowStep>();

  const form = useForm({
    initialValues: {
      configuration: '',
    },
    onValuesChange(values, previous) {
      if (values.configuration !== previous.configuration) {
        try {
          JSON.parse(values.configuration);
          form.clearErrors();
        } catch {
          form.setErrors({ configuration: t('flowStepInvalidConfig') });
          return;
        }
      }
    },
    validate: {
      configuration: (value: string) =>
        value.trim().length != 0 ? null : t('flowStepInvalidConfig'),
    },
  });

  useEffect(() => {
    (async () => {
      if (flowStepState && flowStep.id === flowStepState.id) return;
      try {
        const data = await flowStepService.getFlowStep({
          id: flowStep.id,
        });
        setFlowStepState(data.item);
        form.setValues({
          configuration: JSON.stringify(data.item.configuration, null, 2),
        });
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        if (errorMessage === 'refresh-token-failed') {
          navigate('/logout', { replace: true });
        } else {
          navigate('/internal-server-error', { replace: true });
        }
      } finally {
        setApiLoading(false);
      }
    })();
  }, [flowStep, flowStepState, form, navigate]);

  // Handlers
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await flowStepService.updateFlowStep({
        id: flowStep.id,
        configuration: JSON.parse(values.configuration),
      });
      setFlowStepState(data.item);
      form.setValues({ configuration: JSON.stringify(data.item.configuration, null, 2) });
      sendSuccessNotification({
        id: 'update-flow-step-success',
        icon: <IconCheck />,
        title: t('flowStepConfigurationSaved'),
        message: '',
      });
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      if (errorMessage.startsWith('configuration')) {
        form.setErrors({ configuration: t('flowStepInvalidConfig') });
      } else if (errorMessage === 'refresh-token-failed') {
        navigate('/logout', { replace: true });
      } else {
        navigate('/internal-server-error', { replace: true });
      }
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <PaperTitle mb={0} icon={IconRoute} title={useCaseStep.title} />
      <Divider my="lg" />
      {flowStepState && (
        <JsonInput
          key={flowStepState.id}
          my="md"
          minRows={20}
          maxRows={20}
          readOnly={!auth.canWrite()}
          formatOnBlur
          autosize
          validationError={t('flowStepInvalidConfig')}
          {...form.getInputProps('configuration')}
        />
      )}
      {auth.canWrite() && (
        <Group justify="flex-end">
          <Button
            type="submit"
            loading={apiLoading}
            loaderProps={{ type: 'dots' }}
            disabled={!!form.errors.configuration}
          >
            {t('flowStepUpdateBtn')}
          </Button>
        </Group>
      )}
    </form>
  );
}
