import { Table } from '@mantine/core';
import { useState } from 'react';
import Th from './table-header-th';

export interface Columns {
  key: string;
  title: string;
  sortable: boolean;
}

export interface TableHeaderProps {
  sortBy: string;
  columns: Columns[];
  onSortingChange: (key: string, dir: 'asc' | 'desc') => void;
}

export default function TableHeader({ sortBy, onSortingChange, columns }: TableHeaderProps) {
  // Services
  const [sortDirection, setReverseSortDirection] = useState(false);

  // Handlers
  const setSortingHandler = (key: string) => {
    const newDirection = key === sortBy ? !sortDirection : false;
    setReverseSortDirection(newDirection);
    onSortingChange(key, newDirection ? 'asc' : 'desc');
  };

  // Content
  return (
    <Table.Thead>
      <Table.Tr>
        {columns.map((x) => {
          if (x.sortable) {
            return (
              <Th
                key={x.key}
                sorted={sortBy === x.key}
                reversed={sortDirection}
                onSort={() => setSortingHandler(x.key)}
              >
                {x.title}
              </Th>
            );
          } else {
            return <Table.Th key={x.key}>{x.title}</Table.Th>;
          }
        })}
      </Table.Tr>
    </Table.Thead>
  );
}
