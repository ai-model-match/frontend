import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { RolloutStrategyState, RsAdaptive } from '@entities/rolloutStrategy';
import {
  Divider,
  Fieldset,
  Flex,
  Group,
  NumberInput,
  Text,
  Tooltip,
} from '@mantine/core';
import { assets } from '@styles/assets';
import { IconHexagonNumber2Filled, IconInfoCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface AdaptiveComponentProps {
  rsStatus: RolloutStrategyState;
  rsAdaptive: RsAdaptive;
  onChange: (rsAdaptive: RsAdaptive) => void;
}
export function AdaptiveComponent({
  rsStatus,
  rsAdaptive,
  onChange,
}: AdaptiveComponentProps) {
  // Services
  const { t } = useTranslation();

  // Content
  const Image = assets[`../assets/rs-adaptive.svg`];
  return (
    <>
      <Group justify="flex-start" align="top" gap={0} mb={0}>
        <PaperTitle
          mb={15}
          icon={IconHexagonNumber2Filled}
          title={t('rsAdaptiveTitle')}
        />
        <Tooltip
          maw={350}
          withArrow
          multiline
          position="top"
          label={t('rsAdaptiveDescription')}
        >
          <IconInfoCircle color="gray" size={24} />
        </Tooltip>
      </Group>
      <Fieldset>
        <Flex gap="md" p={'xs'}>
          <Image width={350} />
          <Text size="xs">{t('rsAdaptiveIntro')}</Text>
        </Flex>
        <Divider my="sm" />
        <Group justify="flex-start" align="center" gap={25} mb={0}>
          <Group justify="flex-start" align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={rsStatus !== RolloutStrategyState.INIT}
              label={t('rsAdaptiveInterval')}
              value={rsAdaptive.intervalMins}
              min={1}
              max={999999}
              suffix={
                ' ' + t('rsAdaptiveTimeMin', { count: rsAdaptive.intervalMins ?? 0 })
              }
              onBlur={(event) => {
                if (event.target.value === '') {
                  onChange({ ...rsAdaptive, intervalMins: 1 });
                }
              }}
              onChange={(value) => {
                onChange({ ...rsAdaptive, intervalMins: parseInt(value.toString()) });
              }}
            />
            <Tooltip
              label={t('rsAdaptiveIntervalExplanation')}
              maw={300}
              withArrow
              multiline
              position="top"
            >
              <IconInfoCircle color="gray" size={18} />
            </Tooltip>
          </Group>
          <Group justify="flex-start" align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={rsStatus !== RolloutStrategyState.INIT}
              label={t('rsAdaptiveMaxStepPct')}
              value={rsAdaptive.maxStepPct}
              min={1}
              max={100}
              suffix={' %'}
              onBlur={(event) => {
                if (event.target.value === '') {
                  onChange({ ...rsAdaptive, maxStepPct: 1 });
                }
              }}
              onChange={(value) => {
                onChange({ ...rsAdaptive, maxStepPct: parseInt(value.toString()) });
              }}
            />
            <Tooltip
              label={t('rsAdaptiveMaxStepPctExplanation')}
              maw={300}
              withArrow
              multiline
              position="top"
            >
              <IconInfoCircle color="gray" size={18} />
            </Tooltip>
          </Group>
          <Group justify="flex-start" align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={rsStatus !== RolloutStrategyState.INIT}
              label={t('rsAdaptiveMinFeedback')}
              value={rsAdaptive.minFeedback}
              min={0}
              max={999999}
              onBlur={(event) => {
                if (event.target.value === '') {
                  onChange({ ...rsAdaptive, minFeedback: 0 });
                }
              }}
              onChange={(value) => {
                onChange({ ...rsAdaptive, minFeedback: parseInt(value.toString()) });
              }}
            />
            <Tooltip
              label={t('rsAdaptiveMinFeedbackExplanation')}
              maw={300}
              withArrow
              multiline
              position="top"
            >
              <IconInfoCircle color="gray" size={18} />
            </Tooltip>
          </Group>
        </Group>
      </Fieldset>
    </>
  );
}
