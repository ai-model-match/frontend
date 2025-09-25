import { useAuth } from '@context/AuthContext';
import { Flow } from '@entities/flow';
import { UseCase } from '@entities/useCase';
import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Slider,
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
    <Card withBorder>
      <Group justify="space-between" align="center">
        <Group justify="flex-start" align="center">
          <Text
            fw={500}
            td="underline"
            component={NavLink}
            to={`/use-cases/${useCase.id}/flows/${flow.id}`}
          >
            {flow.title}
          </Text>
          {flow.active ? (
            <Badge color="var(--mantine-color-teal-7)" size="md">
              {t('useCaseStatusActive')}
            </Badge>
          ) : (
            <Badge color="grey" size="md">
              {t('useCaseStatusInactive')}
            </Badge>
          )}
        </Group>

        <Group justify="flex-end" align="center" gap={0}>
          {auth.canWrite() && (
            <Tooltip withArrow label={t('useCaseUpdateAction')}>
              <ActionIcon variant="subtle" onClick={() => handleUpdateRequest(flow.id)}>
                <IconPencil size={22} />
              </ActionIcon>
            </Tooltip>
          )}
          {auth.canWrite() && !flow.active && (
            <Tooltip withArrow label={t('useCaseActivateAction')}>
              <ActionIcon variant="subtle" onClick={() => handleActivateRequest(flow.id)}>
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
                {flow.active ? <IconArrowRampRight size={22} /> : <IconTrash size={22} />}
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
      <Text my={'sm'} lineClamp={2}>
        {flow.description}
      </Text>
      <Divider my="sm" />
      <Text my={10}>
        <Trans i18nKey="flowCurrentServePct" values={{ pct: flow.currentServePct }} />
      </Text>
      <Slider
        mb="xl"
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
        marks={[
          { value: 0, label: '0%' },
          { value: 50, label: '50%' },
          { value: 100, label: '100%' },
        ]}
      />
    </Card>
  );
}
