import { useAuth } from '@context/AuthContext';
import { Badge, Box, Center, NumberInput, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface PercentageSelectorComponentProps {
  readonly?: boolean;
  color?: string;
  selectedPercentage: number;
  tooltip: string;
  onChangePercentage?: (percentage: number) => void;
}
export function PercentageSelectorComponent({
  readonly,
  color,
  selectedPercentage,
  tooltip,
  onChangePercentage,
}: PercentageSelectorComponentProps) {
  const auth = useAuth();
  const [selectedPct, setSelectedPct] = useState(selectedPercentage);
  const [inEditingMode, setInEditingMode] = useState(false);

  useEffect(() => {
    setSelectedPct(selectedPercentage);
  }, [selectedPercentage]);

  return (
    <Box miw={70} maw={70}>
      <Center h={32}>
        {!inEditingMode && (
          <Tooltip withArrow label={tooltip}>
            <Badge
              color={color ?? 'brand'}
              fullWidth
              size="md"
              style={{ cursor: auth.canWrite() && !readonly ? 'pointer' : 'default' }}
              onClick={() => {
                if (auth.canWrite() && !readonly) setInEditingMode(true);
              }}
            >
              {selectedPct ?? 0}%
            </Badge>
          </Tooltip>
        )}
        {auth.canWrite() && !readonly && inEditingMode && (
          <NumberInput
            size={'xs'}
            min={0}
            max={100}
            autoFocus
            clampBehavior="strict"
            allowDecimal={false}
            defaultValue={selectedPct}
            suffix="%"
            onChange={(value) => {
              setSelectedPct(
                parseInt(value.toString()) >= 0 ? parseInt(value.toString()) : 0
              );
            }}
            onBlur={() => {
              if (onChangePercentage) onChangePercentage(selectedPct);
              setInEditingMode(false);
            }}
          />
        )}
      </Center>
    </Box>
  );
}
