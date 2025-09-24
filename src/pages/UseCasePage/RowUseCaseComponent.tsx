import { TableTr } from '@components/Table';
import { useAuth } from '@context/AuthContext';
import { UseCase } from '@entities/useCase';
import { ActionIcon, Badge, Code, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy, IconPencil, IconTrash } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface RowUseCaseComponentProps {
  useCase: UseCase;
  handleUpdateRequest: (id: string) => void;
  handleDeleteRequest: (id: string) => void;
}
export default function RowUseCaseComponent({
  useCase,
  handleUpdateRequest,
  handleDeleteRequest,
}: RowUseCaseComponentProps) {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <TableTr
      key={useCase.id}
      trKey={useCase.id}
      tds={[
        {
          mw: 100,
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
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
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
              size="sm"
              onClick={() =>
                navigate(`/use-cases/${useCase.id}/steps`, {
                  replace: true,
                })
              }
            >
              {useCase.title}
            </Text>
          ),
        },
        {
          children: useCase.active ? (
            <Badge color="var(--mantine-color-teal-7)" size="sm">
              {t('useCaseStatusActive')}
            </Badge>
          ) : (
            <Badge color="grey" size="sm">
              {t('useCaseStatusInactive')}
            </Badge>
          ),
        },
        {
          text: format(new Date(useCase.createdAt), import.meta.env.VITE_DATE_FORMAT!),
        },
        {
          text: format(new Date(useCase.updatedAt), import.meta.env.VITE_DATE_FORMAT!),
        },
        {
          children: auth.canWrite() && (
            <Group wrap="nowrap" gap={0}>
              <Tooltip
                withArrow
                style={{ fontSize: '12px' }}
                label={t('useCaseUpdateAction')}
              >
                <ActionIcon
                  variant="subtle"
                  onClick={() => handleUpdateRequest(useCase.id)}
                >
                  <IconPencil size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                withArrow
                style={{ fontSize: '12px' }}
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
                  <IconTrash size={18} />
                </ActionIcon>
              </Tooltip>
            </Group>
          ),
        },
      ]}
    ></TableTr>
  );
}
