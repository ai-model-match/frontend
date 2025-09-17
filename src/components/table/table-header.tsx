import { Table } from "@mantine/core";
import { useState } from "react";
import Th from "./table-header-th";

type Columns = {
    key: string;
    title: string;
    sortable: boolean;
};
type TableHeaderProps = {
    sortBy: string;
    setSorting: (key: string, dir: 'asc' | 'desc') => void;
    columns: Columns[];
};
export default function TableHeader({ sortBy, setSorting, columns }: TableHeaderProps) {
    // Services
    const [reverseSortDirection, setReverseSortDirection] = useState(false);


    // Handlers
    const setSortingHandler = (key: string) => {
        key === sortBy ? setReverseSortDirection(!reverseSortDirection) : setReverseSortDirection(false);
        setSorting(key, reverseSortDirection ? 'desc' : 'asc');
    };

    // Content
    return <Table.Thead>
        <Table.Tr>
            {columns.map(x => {
                if (x.sortable) {
                    return <Th key={x.key} sorted={sortBy === x.key}
                        reversed={reverseSortDirection}
                        onSort={() => setSortingHandler(x.key)}>{x.title}</Th>;
                } else {
                    return <Table.Th key={x.key}>{x.title}</Table.Th>;
                }
            })}
        </Table.Tr>
    </Table.Thead>;
}