import { LineChart } from '@mantine/charts';
import { useTranslation } from 'react-i18next';

export function UseCaseStepGraphComponent() {
  const { t } = useTranslation();

  return (
    <LineChart
      h={300}
      miw={'100%'}
      withLegend
      data={[
        {
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-GB',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }
          ),
          Requests: Math.floor(Math.random() * 4000) + 1000,
          UseCaseRequests: Math.floor(Math.random() * 7000) + 3000,
        },
        {
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-GB',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }
          ),
          Requests: Math.floor(Math.random() * 4000) + 1000,
          UseCaseRequests: Math.floor(Math.random() * 7000) + 3000,
        },
        {
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-GB',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }
          ),
          Requests: Math.floor(Math.random() * 4000) + 1000,
          UseCaseRequests: Math.floor(Math.random() * 7000) + 3000,
        },
        {
          date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-GB',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }
          ),
          Requests: Math.floor(Math.random() * 4000) + 1000,
          UseCaseRequests: Math.floor(Math.random() * 7000) + 3000,
        },
      ]}
      dataKey="date"
      series={[
        { name: 'Requests', label: t('useCaseGraphStepRequests'), color: 'brand.6' },
        {
          name: 'UseCaseRequests',
          label: t('useCaseGraphRequests'),
          color: 'red.6',
          strokeDasharray: '5 5',
        },
      ]}
      curveType="bump"
      tickLine="xy"
      gridAxis="y"
    />
  );
}
