import { Center, Group, Table, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconSelector } from '@tabler/icons-react';

export interface TableThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

export function TableTh({ children, reversed, sorted, onSort }: TableThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th h={'50'}>
      <UnstyledButton onClick={onSort}>
        <Group justify="space-between">
          <Text fw={600} fz="md">
            {children}
          </Text>
          <Center>
            <Icon size={18} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}
