import { ActionIcon, CopyButton, Table, Text, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

export interface TableTdProps {
  mw?: number;
  children?: React.ReactNode;
  text?: string;
  textWithCopy?: boolean;
  textWithTooltip?: boolean;
}

export interface TableTrProps {
  trKey: string;
  tds: TableTdProps[];
}

export function TableTr({ trKey, tds }: TableTrProps) {
  return (
    <Table.Tr key={trKey} h={'50'}>
      {tds.map((td, index) => {
        return (
          <Table.Td key={index} style={{ maxWidth: td.mw }}>
            {td.text && td.textWithCopy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {td.textWithTooltip && (
                  <Tooltip withArrow label={td.text}>
                    <Text truncate="end">{td.text}</Text>
                  </Tooltip>
                )}
                {!td.textWithTooltip && <Text truncate="end">{td.text}</Text>}
                <CopyButton value={td.text} timeout={1000}>
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
              </div>
            )}
            {td.text && !td.textWithCopy && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {td.textWithTooltip && (
                  <Tooltip withArrow label={td.text}>
                    <Text truncate="end">{td.text}</Text>
                  </Tooltip>
                )}
                {!td.textWithTooltip && <Text truncate="end">{td.text}</Text>}
              </div>
            )}

            {!td.text && td.children}
          </Table.Td>
        );
      })}
    </Table.Tr>
  );
}
