import { TableHeader } from '@components/Table/TableHeader';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface ColumnUseCaseComponentProps {
  sortBy: string;
  onSortingChanged: (field: string, dir: string) => void;
}
export default function ColumnUseCaseComponent({
  sortBy,
  onSortingChanged,
}: ColumnUseCaseComponentProps) {
  // Services
  const { t } = useTranslation();

  // Data
  const tableColumns = useMemo(() => {
    return [
      {
        key: 'id',
        title: t('useCaseID'),
        sortable: false,
      },
      {
        key: 'code',
        title: t('useCaseCode'),
        sortable: true,
      },
      {
        key: 'title',
        title: t('useCaseTitle'),
        sortable: true,
      },
      {
        key: 'active',
        title: t('useCaseIsActive'),
        sortable: true,
      },
      {
        key: 'created_at',
        title: t('useCaseCreatedAt'),
        sortable: true,
      },
      {
        key: 'updated_at',
        title: t('useCaseUpdatedAt'),
        sortable: true,
      },
      {
        key: 'actions',
        title: '',
        sortable: false,
      },
    ];
  }, [t]);

  // Content
  return (
    <TableHeader
      sortBy={sortBy}
      onSortingChange={onSortingChanged}
      columns={tableColumns}
    ></TableHeader>
  );
}
