import { useAuth } from '@context/AuthContext';
import { Badge, Box, Center, NumberInput, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface NumberSelectorComponentProps {
  readonly?: boolean;
  color?: string;
  selectedNumber: number;
  tooltip: string;
  minValue?: number;
  maxValue?: number;
  suffix?: string;
  floatingPoint?: boolean;
  onChangeNumber?: (number: number) => void;
}
export function NumberSelectorComponent({
  readonly,
  color,
  selectedNumber,
  tooltip,
  minValue = 0,
  maxValue = 999999,
  suffix = '',
  floatingPoint = false,
  onChangeNumber,
}: NumberSelectorComponentProps) {
  const auth = useAuth();
  const [selectedPct, setSelectedPct] = useState(selectedNumber);
  const [inEditingMode, setInEditingMode] = useState(false);

  useEffect(() => {
    setSelectedPct(selectedNumber);
  }, [selectedNumber]);

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
              {floatingPoint ? selectedPct.toFixed(2) : (selectedPct ?? 0)}
              {suffix ? ` ${suffix}` : ''}
            </Badge>
          </Tooltip>
        )}
        {auth.canWrite() && !readonly && inEditingMode && (
          <NumberInput
            size={'xs'}
            min={minValue}
            max={maxValue}
            autoFocus
            clampBehavior="strict"
            allowDecimal={floatingPoint}
            decimalScale={floatingPoint ? 2 : 0}
            defaultValue={selectedPct}
            suffix={suffix ? ` ${suffix}` : ''}
            onChange={(value) => {
              setSelectedPct(
                parseFloat(value.toString()) >= 0
                  ? parseFloat(value.toString())
                  : minValue
              );
            }}
            onBlur={() => {
              if (onChangeNumber) onChangeNumber(selectedPct);
              setInEditingMode(false);
            }}
          />
        )}
      </Center>
    </Box>
  );
}
