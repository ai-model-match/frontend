import { TableTr } from '@components/Table/TableTr';
import { useAuth } from '@context/AuthContext';
import { UseCase } from '@entities/useCase';
import { ActionIcon, Badge, Code, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import {
  IconArrowRampRight,
  IconCheck,
  IconCopy,
  IconPencil,
  IconSettingsAutomation,
  IconTrash,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface RowUseCaseComponentProps {
  useCase: UseCase;
  handleGoToFlowsRequest: (id: string) => void;
  handleGoToRolloutRequest: (id: string) => void;
  handleUpdateRequest: (id: string) => void;
  handleDeleteRequest: (id: string) => void;
}
export default function RowUseCaseComponent({
  useCase,
  handleGoToFlowsRequest,
  handleGoToRolloutRequest,
  handleUpdateRequest,
  handleDeleteRequest,
}: RowUseCaseComponentProps) {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Content
  return (
    <TableTr
      key={useCase.id}
      trKey={useCase.id}
      tds={[
        {
          mw: 120,
          text: useCase.id,
          textWithCopy: true,
          textWithTooltip: true,
        },
        {
          children: (
            <Group wrap="nowrap" gap={2}>
              <Code mr={0}>{useCase.code}</Code>
              <CopyButton value={useCase.code} timeout={1000}>
                {({ copied, copy }) => (
                  <ActionIcon
                    color={copied ? 'var(--mantine-color-teal-7)' : 'gray'}
                    variant="subtle"
                    onClick={copy}
                  >
                    {copied ? <IconCheck size={22} /> : <IconCopy size={22} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          ),
        },
        {
          children: (
            <Text
              td={'underline'}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/use-cases/${useCase.id}`)}
            >
              {useCase.title}
            </Text>
          ),
        },
        {
          children: useCase.active ? (
            <Badge color="var(--mantine-color-teal-7)">{t('useCaseStatusActive')}</Badge>
          ) : (
            <Badge color="grey">{t('useCaseStatusInactive')}</Badge>
          ),
        },
        {
          text: format(new Date(useCase.createdAt), import.meta.env.VITE_DATE_FORMAT!),
        },
        {
          text: format(new Date(useCase.updatedAt), import.meta.env.VITE_DATE_FORMAT!),
        },
        {
          mw: 100,
          children: (
            <Group wrap="nowrap" gap={0}>
              <Tooltip withArrow label={t('useCaseRolloutStrategyAction')}>
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleGoToRolloutRequest(useCase.id)}
                >
                  <IconSettingsAutomation size={22} />
                </ActionIcon>
              </Tooltip>
              <Tooltip withArrow label={t('useCaseFlowsAction')}>
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleGoToFlowsRequest(useCase.id)}
                >
                  <IconArrowRampRight size={22} />
                </ActionIcon>
              </Tooltip>
              {auth.canWrite() && (
                <>
                  <Tooltip withArrow label={t('useCaseUpdateAction')}>
                    <ActionIcon
                      variant="subtle"
                      onClick={() => handleUpdateRequest(useCase.id)}
                    >
                      <IconPencil size={22} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip
                    withArrow
                    label={
                      useCase.active ? t('useCaseCannotDelete') : t('useCaseDeleteAction')
                    }
                  >
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleDeleteRequest(useCase.id)}
                      disabled={useCase.active}
                    >
                      <IconTrash size={22} />
                    </ActionIcon>
                  </Tooltip>
                </>
              )}
            </Group>
          ),
        },
      ]}
    ></TableTr>
  );
}
