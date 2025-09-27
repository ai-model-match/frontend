import { useAuth } from '@context/AuthContext';
import { Flow } from '@entities/flow';
import { UseCase } from '@entities/useCase';
import {
  ActionIcon,
  Box,
  Card,
  Divider,
  Group,
  Slider,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { IconArrowRampRight, IconPencil, IconTrash } from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

export interface FlowCardComponentProps {
  useCase: UseCase;
  flow: Flow;
  handleUpdateRequest: (id: string) => void;
  handleDeleteRequest: (id: string) => void;
  handleActivateRequest: (id: string) => void;
  handleDeactivateRequest: (id: string) => void;
}

export function FlowCardComponent({
  useCase,
  flow,
  handleUpdateRequest,
  handleDeleteRequest,
  handleActivateRequest,
  handleDeactivateRequest,
}: FlowCardComponentProps) {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <Card withBorder h={300} w={'100%'}>
      <Stack align="stretch" justify="flex-start" h={'100%'} gap={15}>
        <Group justify="space-between" align="center">
          <Tooltip withArrow label={flow.title}>
            <Text
              maw={'calc(100% - 116px)'}
              truncate="end"
              size="lg"
              td="underline"
              component={NavLink}
              to={`/use-cases/${useCase.id}/flows/${flow.id}`}
            >
              {flow.title}
            </Text>
          </Tooltip>
          <Group justify="flex-end" align="center" gap={0} w={100}>
            {auth.canWrite() && (
              <Tooltip withArrow label={t('useCaseUpdateAction')}>
                <ActionIcon variant="subtle" onClick={() => handleUpdateRequest(flow.id)}>
                  <IconPencil size={22} />
                </ActionIcon>
              </Tooltip>
            )}
            {auth.canWrite() && !flow.active && (
              <Tooltip withArrow label={t('useCaseActivateAction')}>
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleActivateRequest(flow.id)}
                >
                  <IconArrowRampRight size={22} />
                </ActionIcon>
              </Tooltip>
            )}
            {auth.canWrite() && (
              <Tooltip
                withArrow
                label={
                  flow.active ? t('useCaseDeactivateAction') : t('useCaseDeleteAction')
                }
              >
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => {
                    return flow.active
                      ? handleDeactivateRequest(flow.id)
                      : handleDeleteRequest(flow.id);
                  }}
                >
                  {flow.active ? (
                    <IconArrowRampRight size={22} />
                  ) : (
                    <IconTrash size={22} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
        <Divider />
        <Box>
          <Text lineClamp={4}>{flow.description}</Text>
        </Box>
        <Stack align="stretch" justify="flex-end" h={'100%'} gap={15}>
          <Divider />
          <Text>
            <Trans i18nKey="flowCurrentServePct" values={{ pct: flow.currentServePct }} />
          </Text>
          <Slider
            mb="md"
            color={
              flow.currentServePct >= 30
                ? 'brand'
                : flow.currentServePct >= 10
                  ? 'yellow'
                  : 'red'
            }
            showLabelOnHover={true}
            label={(value) => value + ' %'}
            value={flow.currentServePct}
            disabled={!flow.active}
            style={{ pointerEvents: 'none', cursor: 'default' }}
            marks={[
              { value: 0, label: '0%' },
              { value: 100, label: '100%' },
            ]}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
