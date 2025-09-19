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
    setSorting: (key: string, dir: 'asc' | 'desc') => void;
}

export default function TableHeader({ sortBy, setSorting, columns }: TableHeaderProps) {
    // Services
    const [reverseSortDirection, setReverseSortDirection] = useState(false);

    // Handlers
    const setSortingHandler = (key: string) => {
        const newDirection = key === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(newDirection);
        setSorting(key, newDirection ? 'asc' : 'desc');
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
                                reversed={reverseSortDirection}
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
