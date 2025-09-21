import { ActionIcon, Badge, Code, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy, IconPencil, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Tr from '../../../components/table/table-tr';
import { useAuth } from '../../../core/auth/auth.context';
import { useCaseDto } from '../use-case.api';

export interface RowUseCaseComponentProps {
  useCase: useCaseDto;
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
    <Tr
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
            <Group gap={2}>
              <Code mr={0}>{useCase.code}</Code>
              <CopyButton value={useCase.code} timeout={1000}>
                {({ copied, copy }) => (
                  <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
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
            <Badge color="green" size="sm">
              {t('useCaseEnable')}
            </Badge>
          ) : (
            <Badge color="grey" size="sm">
              {t('useCaseDisable')}
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
            <>
              <Tooltip withArrow style={{ fontSize: '12px' }} label={t('useCaseUpdateAction')}>
                <ActionIcon variant="subtle" onClick={() => handleUpdateRequest(useCase.id)}>
                  <IconPencil size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                withArrow
                style={{ fontSize: '12px' }}
                label={useCase.active ? t('useCaseCannotDelete') : t('useCaseDeleteAction')}
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
            </>
          ),
        },
      ]}
    ></Tr>
  );
}
