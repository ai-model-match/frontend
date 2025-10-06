import { Center, Stack, Text } from '@mantine/core';
import { assets } from '@styles/assets';
import { useTranslation } from 'react-i18next';

export function UseCaseStepGraphComponent() {
  // Services
  const { t } = useTranslation();

  // Content
  const Image = assets[`../assets/coming-soon.svg`];
  return (
    <Center h={300} miw={'100%'} bg={'gray.0'}>
      <Stack align="center">
        <Image width={180} />
        <Text size="lg">{t('useCaseStepComingSoon')}</Text>
        <Text size="xs" maw={'60%'} ta={'center'}>
          {t('useCaseStepComingSoonText')}
        </Text>
      </Stack>
    </Center>
  );
  /*const range = [...Array(30).keys()].map((i) => i + 1);
  return (
    <LineChart
      h={300}
      miw={'100%'}
      withLegend
      data={range.map((v) => {
        return {
          date: new Date(Date.now() - (30 - v) * 24 * 60 * 60 * 1000).toLocaleDateString(
            'en-GB',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }
          ),
          Requests: Math.floor(Math.random() * 1000) + 0,
          UseCaseRequests: Math.floor(Math.random() * 1000) + 1000,
        };
      })}
      dataKey="date"
      series={[
        { name: 'Requests', label: t('useCaseGraphStepRequests'), color: 'brand.6' },
        {
          name: 'UseCaseRequests',
          label: t('useCaseGraphRequests'),
          color: 'red.6',
          strokeDasharray: '10 10',
        },
      ]}
      curveType="bump"
      tickLine="xy"
      gridAxis="y"
    />
  );*/
}
