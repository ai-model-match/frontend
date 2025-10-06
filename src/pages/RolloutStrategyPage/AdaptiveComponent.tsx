import { PaperTitle } from '@components/PaperTitle/PaperTitle';
import { useAuth } from '@context/AuthContext';
import { RolloutStrategyState, RsAdaptive } from '@entities/rolloutStrategy';
import { Divider, Fieldset, Group, NumberInput, Text, Tooltip } from '@mantine/core';
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
  const auth = useAuth();

  // Content
  const canEdit = () => {
    return rsStatus === RolloutStrategyState.INIT && auth.canWrite();
  };

  const Image = assets[`../assets/rs-adaptive.svg`];
  return (
    <>
      <Group align="top" gap={0} mb={0}>
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
        <Group wrap="nowrap" p={'xs'}>
          <Image width={300} />
          <Text>{t('rsAdaptiveIntro')}</Text>
        </Group>
        <Divider my="sm" />
        <Group gap={25} mb={0}>
          <Group align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={!canEdit()}
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
          <Group align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={!canEdit()}
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
          <Group align="baseline" gap={0} mb={0}>
            <NumberInput
              readOnly={!canEdit()}
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
