import { Flow } from '@entities/flow';
import { UseCase } from '@entities/useCase';
import { Box, Button, Group, Slider, Stack, Text, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { flowService } from '@services/flowService';
import { assets } from '@styles/assets';
import { IconEdit } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface UpdateFlowPctBulkComponentProps {
  useCase: UseCase;
  flows: Flow[];
  onFlowsUpdated: (flows: Flow[]) => void;
}
export default function UpdateFlowPctBulkComponent({
  useCase,
  flows,
  onFlowsUpdated,
}: UpdateFlowPctBulkComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: Object.fromEntries(
      flows.map((flow) => [flow.id, flow.currentServePct])
    ),
  });

  // Compute the sum of all values
  const total = Object.values(form.values).reduce(
    (acc, currentServePct) => acc + currentServePct,
    0
  );

  // Handles
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await flowService.updateFlowPctBulk({
        useCaseId: useCase.id,
        flows: Object.entries(values).map(([flowId, currentServePct]) => ({
          flowId,
          currentServePct,
        })),
      });
      onFlowsUpdated(data.items);
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
  const Image = assets[`../assets/edit-flow.svg`];
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box>
        <Group justify="left" align="flex-start">
          <ThemeIcon variant="filled" c={'white'} size={30}>
            <IconEdit size={22} />
          </ThemeIcon>
          <Text size={'lg'}>{t('updateFlowTitle')}</Text>
        </Group>
        <Box w={'85%'} p={80} pt={10} pb={10}>
          <Box mt={20} component={Image} />
        </Box>
        <Group justify="space-between">
          <Stack align="stretch" justify="flex-start" w={'100%'} gap={15} p={15}>
            {flows.map((flow) => (
              <>
                <Text key={flow.id} mt={'xl'}>
                  {flow.title}
                </Text>
                <Slider
                  color={
                    form.getInputProps(flow.id).value >= 30
                      ? 'brand'
                      : form.getInputProps(flow.id).value >= 10
                        ? 'yellow'
                        : 'red'
                  }
                  label={() => form.getInputProps(flow.id).value + ' %'}
                  key={form.key(flow.id)}
                  {...form.getInputProps(flow.id)}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                  ]}
                  value={flow.active ? form.getInputProps(flow.id).value : 0}
                  mb="sm"
                />
              </>
            ))}
          </Stack>
        </Group>
      </Box>
      <Box>
        <Button
          type="submit"
          mt={40}
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          fullWidth
          disabled={total !== 100}
        >
          {total === 100 ? t('updateFlowCreateBtn') : total + '%'}
        </Button>
      </Box>
    </form>
  );
}
